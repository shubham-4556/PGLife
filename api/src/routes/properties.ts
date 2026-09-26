import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import type { Gender } from "../lib/gender.js";
import { prisma } from "../lib/prisma.js";
import { toSummary } from "../lib/serialize.js";
import { AppError } from "../middleware/errors.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

const listQuerySchema = z.object({
  // Accepts a city name (as the old ?city=Delhi links did) or a numeric id.
  city: z.string().trim().min(1).optional(),
  gender: z.enum(["male", "female", "unisex"]).optional(),
  sort: z.enum(["rent_asc", "rent_desc", "rating_desc", "name_asc"]).default("rating_desc"),
});

const PROPERTY_INCLUDE = {
  city: true,
  images: { orderBy: { position: "asc" as const }, take: 1 },
  _count: { select: { interestedBy: true } },
} satisfies Prisma.PropertyInclude;

/**
 * The overall rating is the mean of three columns, so it cannot be expressed as
 * a Prisma `orderBy`. Resolve the id order with a parameterised raw query, then
 * hydrate the rows and restore that order.
 */
async function idsByRating(
  cityId: number | undefined,
  gender: Gender | undefined,
): Promise<number[]> {
  const filters: Prisma.Sql[] = [];

  if (cityId !== undefined) filters.push(Prisma.sql`city_id = ${cityId}`);
  if (gender) filters.push(Prisma.sql`gender = ${gender}`);

  const where = filters.length > 0 ? Prisma.join(filters, " AND ") : Prisma.sql`TRUE`;

  const rows = await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
    SELECT id
    FROM properties
    WHERE ${where}
    ORDER BY (rating_clean + rating_food + rating_safety) / 3 DESC, id ASC
  `);

  return rows.map((row) => row.id);
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { city, gender, sort } = listQuerySchema.parse(req.query);

    let cityId: number | undefined;
    if (city) {
      const asNumber = Number(city);
      const match =
        Number.isInteger(asNumber) && String(asNumber) === city
          ? { id: asNumber }
          : { name: { equals: city } };

      const found = await prisma.city.findFirst({ where: match, select: { id: true, name: true } });
      if (!found) {
        throw AppError.notFound("Sorry! We do not have any PG listed in this city.");
      }
      cityId = found.id;
    }

    const where: Prisma.PropertyWhereInput = {
      ...(cityId !== undefined ? { cityId } : {}),
      ...(gender ? { gender } : {}),
    };

    let properties: Awaited<ReturnType<typeof prisma.property.findMany<{
      include: typeof PROPERTY_INCLUDE;
    }>>>;

    if (sort === "rating_desc") {
      const orderedIds = await idsByRating(cityId, gender);
      const rows = await prisma.property.findMany({
        where: { id: { in: orderedIds } },
        include: PROPERTY_INCLUDE,
      });
      const byId = new Map(rows.map((row) => [row.id, row]));
      properties = orderedIds
        .map((id) => byId.get(id))
        .filter((row): row is NonNullable<typeof row> => row !== undefined);
    } else {
      properties = await prisma.property.findMany({
        where,
        include: PROPERTY_INCLUDE,
        orderBy:
          sort === "rent_asc"
            ? [{ rent: "asc" }, { id: "asc" }]
            : sort === "rent_desc"
              ? [{ rent: "desc" }, { id: "asc" }]
              : [{ name: "asc" }, { id: "asc" }],
      });
    }

    const interestedIds = new Set<number>();
    if (req.user) {
      const rows = await prisma.interestedUserProperty.findMany({
        where: { userId: req.user.id, propertyId: { in: properties.map((p) => p.id) } },
        select: { propertyId: true },
      });
      for (const row of rows) interestedIds.add(row.propertyId);
    }

    res.json({ properties: properties.map((p) => toSummary(p, interestedIds)) });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = z.coerce.number().int().positive().parse(req.params.id);

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        city: true,
        images: { orderBy: { position: "asc" } },
        amenities: { include: { amenity: true } },
        testimonials: { orderBy: { id: "asc" } },
        _count: { select: { interestedBy: true } },
      },
    });

    if (!property) throw AppError.notFound("Sorry! We could not find that property.");

    const isInterested = req.user
      ? (await prisma.interestedUserProperty.count({
          where: { userId: req.user.id, propertyId: id },
        })) > 0
      : false;

    res.json({
      property: {
        ...toSummary(property, new Set(isInterested ? [id] : [])),
        description: property.description,
        images: property.images.map((image) => image.src),
        amenities: property.amenities.map(({ amenity }) => amenity),
        testimonials: property.testimonials.map(({ id, userName, content }) => ({
          id,
          userName,
          content,
        })),
      },
    });
  }),
);

export default router;
