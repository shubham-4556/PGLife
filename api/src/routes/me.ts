import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { toSummary } from "../lib/serialize.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

router.use(requireAuth);

/** GET /api/me/interested — the dashboard's saved-properties list. */
router.get(
  "/interested",
  asyncHandler(async (req, res) => {
    const userId = req.user!.id;

    const rows = await prisma.interestedUserProperty.findMany({
      where: { userId },
      orderBy: { property: { rent: "desc" } },
      include: {
        property: {
          include: {
            city: true,
            images: { orderBy: { position: "asc" }, take: 1 },
            _count: { select: { interestedBy: true } },
          },
        },
      },
    });

    // Every property here is by definition interested in.
    const interestedIds = new Set(rows.map((row) => row.property.id));

    res.json({ properties: rows.map((row) => toSummary(row.property, interestedIds)) });
  }),
);

export default router;
