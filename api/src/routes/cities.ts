import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cities = await prisma.city.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { properties: true } } },
    });

    res.json({
      cities: cities.map(({ id, name, _count }) => ({
        id,
        name,
        propertyCount: _count.properties,
      })),
    });
  }),
);

export default router;
