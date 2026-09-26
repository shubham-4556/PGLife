import Image from "next/image";
import Link from "next/link";
import type { PropertySummary } from "@/types";
import { GENDER_ICON, GENDER_LABEL, PROPERTY_PLACEHOLDER, formatRent } from "@/lib/format";
import { RatingStars } from "./rating-stars";
import { InterestButton } from "./interest-button";

export function PropertyCard({
  property,
  signedIn,
}: {
  property: PropertySummary;
  signedIn: boolean;
}) {
  const href = `/properties/${property.id}`;

  return (
    <article className="card-shadow overflow-hidden rounded-md bg-white md:flex">
      <Link
        href={href}
        className="relative flex shrink-0 items-center justify-center bg-surface p-4 md:w-1/3"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={property.image ?? PROPERTY_PLACEHOLDER}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="aspect-[4/3] rounded-md object-cover md:aspect-auto md:max-h-44"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <RatingStars rating={property.totalRating} />
          <InterestButton
            propertyId={property.id}
            initialIsInterested={property.isInterested}
            initialCount={property.interestedCount}
            signedIn={signedIn}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-ink">
            <Link href={href} className="hover:text-brand">
              {property.name}
            </Link>
          </h2>
          <p className="text-sm text-muted">{property.address}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Image
              src={GENDER_ICON[property.gender]}
              alt=""
              aria-hidden
              width={20}
              height={20}
              className="h-5 w-5"
            />
            {GENDER_LABEL[property.gender]} &middot; {property.city.name}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="text-xl font-bold text-ink">
              &#8377; {formatRent(property.rent)}
              <span className="text-sm font-normal text-muted">/-</span>
            </p>
            <p className="text-xs text-muted">per month</p>
          </div>
          <Link href={href} className="btn-primary">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
