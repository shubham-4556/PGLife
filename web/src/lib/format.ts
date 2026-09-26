import type { AmenityType, Gender, SortOption } from "@/types";

/** Indian rupee formatting, e.g. 15000 -> "15,000". */
export function formatRent(rent: number): string {
  return new Intl.NumberFormat("en-IN").format(rent);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export const GENDER_LABEL: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  unisex: "Unisex",
};

export const GENDER_ICON: Record<Gender, string> = {
  male: "/img/male.png",
  female: "/img/female.png",
  unisex: "/img/unisex.png",
};

export const AMENITY_TYPE_LABEL: Record<AmenityType, string> = {
  Building: "Building",
  CommonArea: "Common Area",
  Bedroom: "Bedroom",
  Washroom: "Washroom",
};

export const AMENITY_TYPE_ORDER: AmenityType[] = [
  "Building",
  "CommonArea",
  "Bedroom",
  "Washroom",
];

export const SORT_LABEL: Record<SortOption, string> = {
  rent_asc: "Lowest rent first",
  rent_desc: "Highest rent first",
  rating_desc: "Top rated first",
  name_asc: "Name (A-Z)",
};

/** City artwork shipped in /public/img. Unknown cities fall back to the logo. */
const CITY_IMAGE: Record<string, string> = {
  delhi: "/img/delhi.png",
  mumbai: "/img/mumbai.png",
  bengaluru: "/img/bangalore.png",
  bangalore: "/img/bangalore.png",
  hyderabad: "/img/hyderabad.png",
  chennai: "/img/chennai.png",
};

export function cityImage(cityName: string): string {
  return CITY_IMAGE[cityName.trim().toLowerCase()] ?? "/img/logo.png";
}

/** Placeholder used when a property has no image row. */
export const PROPERTY_PLACEHOLDER = "/img/logo.png";

export const TESTIMONIAL_AVATAR = "/img/man.jpg";
