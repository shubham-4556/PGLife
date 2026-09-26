import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProperties, getSessionUser, NotFoundError } from "@/lib/api";
import type { Gender, SortOption } from "@/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FilterBar } from "@/components/filter-bar";
import { PropertyCard } from "@/components/property-card";

interface PageProps {
  searchParams: Promise<{ city?: string; gender?: string; sort?: string }>;
}

const VALID_GENDERS: Gender[] = ["male", "female", "unisex"];
const VALID_SORTS: SortOption[] = ["rent_asc", "rent_desc", "rating_desc", "name_asc"];

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { city } = await searchParams;
  return { title: city ? `Best PGs in ${city}` : "PG Listings" };
}

export default async function PropertyListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const city = params.city?.trim() || undefined;
  const gender = VALID_GENDERS.includes(params.gender as Gender)
    ? (params.gender as Gender)
    : undefined;
  const sort = VALID_SORTS.includes(params.sort as SortOption)
    ? (params.sort as SortOption)
    : "rating_desc";

  const [user, properties] = await Promise.all([
    getSessionUser().catch(() => null),
    getProperties({ city, gender, sort }).catch((error) => {
      if (error instanceof NotFoundError) return null;
      throw error;
    }),
  ]);

  // The API 404s for a city that does not exist; show the friendly message the
  // original PHP page printed instead of a generic error page.
  if (properties === null) {
    return (
      <div className="page-container py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-ink">City not found</h1>
        <p className="mb-6 text-muted">Sorry! We do not have any PG listed in this city.</p>
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    );
  }

  const heading = city ? `Best PG's in ${city}` : "All PGs";

  return (
    <>
      <div className="page-container pt-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: city ?? "All PGs" }]} />
      </div>

      <section className="page-container py-6">
        <h1 className="mb-6 text-2xl font-bold text-ink">{heading}</h1>

        <Suspense fallback={<div className="mb-6 h-16 animate-pulse rounded-md bg-line/40" />}>
          <FilterBar city={city} />
        </Suspense>

        {properties.length === 0 ? (
          <div className="rounded-md border border-line bg-white p-16 text-center">
            <p className="text-lg text-muted">No PG to list</p>
          </div>
        ) : (
          <ul className="space-y-5">
            {properties.map((property) => (
              <li key={property.id}>
                <PropertyCard property={property} signedIn={Boolean(user)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
