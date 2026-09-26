/**
 * The `gender` columns are `VARCHAR(10)` in MySQL rather than native ENUMs, so
 * Prisma types them as plain `string`. This union is the application's own
 * contract for the allowed values, and it is what the API validates against
 * before writing (see `signupSchema` in `routes/auth.ts`).
 *
 * Keeping it here — rather than importing a Prisma enum — is what allows the
 * datamodel to match the live database exactly instead of reporting drift.
 */
export const GENDERS = ["male", "female", "unisex"] as const;

export type Gender = (typeof GENDERS)[number];

export function isGender(value: unknown): value is Gender {
  return typeof value === "string" && (GENDERS as readonly string[]).includes(value);
}
