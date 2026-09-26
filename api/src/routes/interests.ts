import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/errors.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

const idParam = z.coerce.number().int().positive();

/** POST /api/properties/:id/interested — idempotent "mark as interested". */
router.post(
  "/:id/interested",
  requireAuth,
  asyncHandler(async (req, res) => {
    const propertyId = idParam.parse(req.params.id);

    const exists = await prisma.property.count({ where: { id: propertyId } });
    if (!exists) throw AppError.notFound("Sorry! We could not find that property.");

    await prisma.interestedUserProperty.upsert({
      where: { userId_propertyId: { userId: req.user!.id, propertyId } },
      create: { userId: req.user!.id, propertyId },
      update: {},
    });

    const interestedCount = await prisma.interestedUserProperty.count({
      where: { propertyId },
    });

    res.status(201).json({ isInterested: true, interestedCount });
  }),
);

/** DELETE /api/properties/:id/interested — remove the user's interest. */
router.delete(
  "/:id/interested",
  requireAuth,
  asyncHandler(async (req, res) => {
    const propertyId = idParam.parse(req.params.id);

    await prisma.interestedUserProperty.deleteMany({
      where: { userId: req.user!.id, propertyId },
    });

    const interestedCount = await prisma.interestedUserProperty.count({
      where: { propertyId },
    });

    res.json({ isInterested: false, interestedCount });
  }),
);

export default router;
