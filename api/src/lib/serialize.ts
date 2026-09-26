import { isGender, type Gender } from "./gender.js";

/** Authenticated user, as attached to the request by `requireAuth`. */
export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface PropertySummary {
  id: number;
  name: string;
  address: string;
  gender: Gender;
  rent: number;
  ratingClean: number;
  ratingFood: number;
  ratingSafety: number;
  totalRating: number;
  image: string | null;
  city: { id: number; name: string };
  interestedCount: number;
  isInterested: boolean;
}

export interface PropertyDetail extends PropertySummary {
  description: string | null;
  images: string[];
  amenities: Array<{ id: number; name: string; type: string; icon: string }>;
  testimonials: Array<{ id: number; userName: string; content: string }>;
}

/**
 * The minimum shape `toSummary` needs. Declared structurally so both the
 * summary query and the wider detail query can be passed in.
 *
 * `DECIMAL` columns come back from Prisma as Decimal objects. Ratings are
 * display-only, so normalise them to plain numbers at the API boundary.
 *
 * `gender` arrives as a plain `string` because the column is VARCHAR rather than
 * a native enum, hence the wider type here and the narrowing in `toSummary`.
 */
export interface RawProperty {
  id: number;
  name: string;
  address: string;
  gender: string;
  rent: number;
  ratingClean: unknown;
  ratingFood: unknown;
  ratingSafety: unknown;
  city: { id: number; name: string };
  images: Array<{ src: string }>;
  _count: { interestedBy: number };
}

export function toSummary(
  property: RawProperty,
  interestedPropertyIds: ReadonlySet<number>,
): PropertySummary {
  const ratingClean = Number(property.ratingClean);
  const ratingFood = Number(property.ratingFood);
  const ratingSafety = Number(property.ratingSafety);

  // Signup validates the value, so anything stored should already be valid. If
  // legacy or hand-edited data ever slips past that, fall back to the most
  // permissive option rather than failing the whole listing response.
  const gender: Gender = isGender(property.gender) ? property.gender : "unisex";

  return {
    id: property.id,
    name: property.name,
    address: property.address,
    gender,
    rent: property.rent,
    ratingClean,
    ratingFood,
    ratingSafety,
    totalRating: Math.round(((ratingClean + ratingFood + ratingSafety) / 3) * 10) / 10,
    image: property.images[0]?.src ?? null,
    city: { id: property.city.id, name: property.city.name },
    interestedCount: property._count.interestedBy,
    isInterested: interestedPropertyIds.has(property.id),
  };
}
