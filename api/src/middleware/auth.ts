import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "./errors.js";

interface TokenPayload {
  sub: number;
  email: string;
}

export function signToken(user: { id: number; email: string }): string {
  return jwt.sign(
    { sub: user.id, email: user.email } satisfies TokenPayload,
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function readToken(req: Request): string | null {
  const fromCookie = req.cookies?.[config.COOKIE_NAME];
  if (fromCookie) return fromCookie;

  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);

  return null;
}

async function resolveUser(token: string) {
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET) as unknown as TokenPayload;
  } catch {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, fullName: true },
  });
}

/** Attaches `req.user` when a valid token is present, but never rejects. */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  void (async () => {
    try {
      const token = readToken(req);
      if (token) req.user = (await resolveUser(token)) ?? undefined;
      next();
    } catch (error) {
      next(error);
    }
  })();
}

/** Rejects the request unless a valid token maps to an existing user. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  void (async () => {
    try {
      const token = readToken(req);
      const user = token ? await resolveUser(token) : null;

      if (!user) {
        next(AppError.unauthorized());
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  })();
}
