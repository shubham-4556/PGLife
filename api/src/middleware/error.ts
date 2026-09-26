import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { config } from "../config.js";
import { AppError } from "./errors.js";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.status).json({ error: error.message, fields: error.fields });
    return;
  }

  if (error instanceof ZodError) {
    res.status(422).json({
      error: "Validation failed",
      fields: Object.fromEntries(
        error.issues.map((issue) => [issue.path.join("."), issue.message]),
      ),
    });
    return;
  }

  console.error("Unhandled error:", error);

  const message =
    error instanceof Error && !config.isProduction ? error.message : "Internal server error";
  res.status(500).json({ error: message });
}

/** Wraps an async route handler so rejected promises reach `errorHandler`. */
export function asyncHandler<T extends Request = Request>(
  handler: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req as T, res, next).catch(next);
  };
}
