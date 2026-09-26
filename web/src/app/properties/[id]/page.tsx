import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  FaBroom,
  FaLock,
  FaQuoteLeft,
  FaStar,
  FaUtensils,
} from "react-icons/fa";
import { getProperty, getSessionUser, NotFoundError } from "@/lib/api";
import {
  AMENITY_TYPE_LABEL,
  AMENITY_TYPE_ORDER,
  GENDER_ICON,
  GENDER_LABEL,
  TESTIMONIAL_AVATAR,
  formatRent,
} from "@/lib/format";
import type { AmenityType, PropertyDetail } from "@/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ImageCarousel } from "@/components/image-carousel";
import { InterestButton } from "@/components/interest-button";
import { RatingStars } from "@/components/rating-stars";

interface PageProps {
  params: Promise<{ id: string }>;
}

const RATING_CRITERIA = [
  { key: "ratingClean", label: "Cleanliness", icon: FaBroom },
  { key: "ratingFood", label: "Food Quality", icon: FaUtensils },
  { key: "ratingSafety", label: "Safety", icon: FaLock },
] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getProperty(Number(id));
    return { title: property.name, description: property.description ?? undefined };
  } catch {
    return { title: "Property not found" };
  }
}

function groupAmenities(amenities: PropertyDetail["amenities"]): Array<{
  type: AmenityType;
  items: PropertyDetail["amenities"];
}> {
  return AMENITY_TYPE_ORDER.map((type) => ({
    type,
    items: amenities.filter((amenity) => amenity.type === type),
  })).filter((group) => group.items.length > 0);
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId <= 0) notFound();

  let property: PropertyDetail;
  let signedIn = false;

  try {
    [property, signedIn] = await Promise.all([
      getProperty(propertyId),
      getSessionUser().then((user) => Boolean(user)),
    ]);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const amenityGroups = groupAmenities(property.amenities);

  return (
    <>
      <div className="page-container pt-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            {
              label: property.city.name,
              href: `/properties?city=${encodeURIComponent(property.city.name)}`,
            },
            { label: property.name },
          ]}
        />
      </div>

      <ImageCarousel
        images={property.images}
        alt={`${property.name} — ${property.city.name}`}
      />

      <section className="page-container py-8">
        <div className="card-shadow rounded-md bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <RatingStars rating={property.totalRating} className="text-base" />
            <InterestButton
              propertyId={property.id}
              initialIsInterested={property.isInterested}
              initialCount={property.interestedCount}
              signedIn={signedIn}
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-ink">{property.name}</h1>
          <p className="text-muted">{property.address}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Image
              src={GENDER_ICON[property.gender]}
              alt=""
              aria-hidden
              width={20}
              height={20}
              className="h-5 w-5"
            />
            {GENDER_LABEL[property.gender]} PG in {property.city.name}
          </p>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="text-2xl font-bold text-ink">
                &#8377; {formatRent(property.rent)}
                <span className="text-base font-normal text-muted">/-</span>
              </p>
              <p className="text-sm text-muted">per month</p>
            </div>
            <button type="button" className="btn-primary px-8 py-3 text-base">
              Book Now
            </button>
          </div>
        </div>
      </section>

      {amenityGroups.length > 0 && (
        <section className="border-y border-line bg-white py-10">
          <div className="page-container">
            <h2 className="mb-6 text-2xl font-bold text-ink">Amenities</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {amenityGroups.map((group) => (
                <div key={group.type}>
                  <h3 className="mb-3 font-bold text-ink">{AMENITY_TYPE_LABEL[group.type]}</h3>
                  <ul className="space-y-2">
                    {group.items.map((amenity) => (
                      <li key={amenity.id} className="flex items-center gap-3 text-sm text-muted">
                        <Image
                          src={`/img/amenities/${amenity.icon}.svg`}
                          alt=""
                          aria-hidden
                          width={28}
                          height={28}
                          className="h-7 w-7"
                        />
                        {amenity.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {property.description && (
        <section className="page-container py-10">
          <h2 className="mb-4 text-2xl font-bold text-ink">About the Property</h2>
          <p className="leading-relaxed text-muted">{property.description}</p>
        </section>
      )}

      <section className="border-y border-line bg-white py-10">
        <div className="page-container">
          <h2 className="mb-6 text-2xl font-bold text-ink">Property Rating</h2>

          <div className="grid gap-10 md:grid-cols-3">
            <ul className="space-y-4 md:col-span-2">
              {RATING_CRITERIA.map(({ key, label, icon: Icon }) => (
                <li key={key} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3 text-ink">
                    <Icon aria-hidden className="text-muted" />
                    {label}
                  </span>
                  <RatingStars rating={property[key]} />
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center justify-center rounded-lg border border-line p-8">
              <FaStar aria-hidden className="text-3xl text-brand" />
              <p className="my-2 text-5xl font-bold text-ink">{property.totalRating.toFixed(1)}</p>
              <RatingStars rating={property.totalRating} />
              <p className="mt-2 text-sm text-muted">Overall rating</p>
            </div>
          </div>
        </div>
      </section>

      {property.testimonials.length > 0 && (
        <section className="page-container py-10">
          <h2 className="mb-6 text-2xl font-bold text-ink">What people say</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {property.testimonials.map((testimonial) => (
              <li key={testimonial.id} className="card-shadow rounded-md bg-white p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src={TESTIMONIAL_AVATAR}
                    alt=""
                    aria-hidden
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <FaQuoteLeft aria-hidden className="text-brand" />
                    <p className="mt-1 text-sm text-ink">{testimonial.content}</p>
                    <p className="mt-2 text-sm font-semibold text-muted">
                      &ndash; {testimonial.userName}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="page-container pb-10">
        <Link
          href={`/properties?city=${encodeURIComponent(property.city.name)}`}
          className="btn-outline"
        >
          More PGs in {property.city.name}
        </Link>
      </div>
    </>
  );
}
