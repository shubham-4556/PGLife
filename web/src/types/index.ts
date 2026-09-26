export type Gender = "male" | "female" | "unisex";

export type AmenityType = "Building" | "CommonArea" | "Bedroom" | "Washroom";

export interface City {
  id: number;
  name: string;
  propertyCount: number;
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

export interface Amenity {
  id: number;
  name: string;
  type: AmenityType;
  icon: string;
}

export interface Testimonial {
  id: number;
  userName: string;
  content: string;
}

export interface PropertyDetail extends PropertySummary {
  description: string | null;
  images: string[];
  amenities: Amenity[];
  testimonials: Testimonial[];
}

export interface SessionUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  collegeName: string;
  gender: Gender;
}

export type SortOption = "rent_asc" | "rent_desc" | "rating_desc" | "name_asc";
