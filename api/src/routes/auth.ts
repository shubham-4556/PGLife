import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/errors.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();

const BCRYPT_ROUNDS = 12;

const password = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(200, "Password is too long");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(30, "Full name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  email,
  password,
  collegeName: z.string().trim().min(1, "College name is required").max(150, "College name is too long"),
  gender: z.enum(["male", "female", "unisex"]),
});

const loginSchema = z.object({ email, password });

function setAuthCookie(res: import("express").Response, token: string): void {
  res.cookie(config.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const data = signupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (existing) {
      throw AppError.conflict("This email id is already registered with us!", {
        email: "This email id is already registered with us!",
      });
    }

    // The original app used unsalted SHA1; bcrypt is the fix for that.
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: await bcrypt.hash(data.password, BCRYPT_ROUNDS),
        fullName: data.fullName,
        phone: data.phone,
        collegeName: data.collegeName,
        gender: data.gender,
      },
      select: { id: true, email: true, fullName: true },
    });

    setAuthCookie(res, signToken(user));
    res.status(201).json({ user });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });

    // Compare against a dummy hash when the user is missing so that response
    // timing does not reveal whether the email is registered.
    const hash = user?.password ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
    const valid = await bcrypt.compare(data.password, hash);

    if (!user || !valid) {
      throw AppError.unauthorized("Login failed! Invalid email or password.");
    }

    const safeUser = { id: user.id, email: user.email, fullName: user.fullName };
    setAuthCookie(res, signToken(safeUser));
    res.json({ user: safeUser });
  }),
);

router.post("/logout", (_req, res) => {
  res.clearCookie(config.COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        collegeName: true,
        gender: true,
      },
    });
    if (!user) throw AppError.unauthorized();

    res.json({ user });
  }),
);

export default router;
