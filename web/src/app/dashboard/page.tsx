import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { getInterestedProperties, getSessionUser } from "@/lib/api";
import { GENDER_LABEL } from "@/lib/format";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PropertyCard } from "@/components/property-card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getSessionUser().catch(() => null);

  if (!user) redirect("/login?next=/dashboard");

  const properties = await getInterestedProperties().catch(() => []);

  return (
    <>
      <div className="page-container pt-4">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
      </div>

      <section className="page-container py-6">
        <h1 className="mb-6 text-2xl font-bold text-ink">My Profile</h1>

        <div className="card-shadow flex flex-col gap-6 rounded-md bg-white p-6 sm:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-tint">
            <FaUser aria-hidden className="text-4xl text-brand" />
          </div>

          <dl className="flex-1 space-y-1 text-sm">
            <div>
              <dt className="sr-only">Full name</dt>
              <dd className="text-xl font-bold text-ink">{user.fullName}</dd>
            </div>
            <div>
              <dt className="sr-only">Email</dt>
              <dd className="text-muted">{user.email}</dd>
            </div>
            <div>
              <dt className="sr-only">Phone</dt>
              <dd className="text-muted">{user.phone}</dd>
            </div>
            <div>
              <dt className="sr-only">College</dt>
              <dd className="text-muted">{user.collegeName}</dd>
            </div>
            <div>
              <dt className="sr-only">Gender</dt>
              <dd className="text-muted">{GENDER_LABEL[user.gender]}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="page-container py-6">
        <h2 className="mb-6 text-2xl font-bold text-ink">My Interested Properties</h2>

        {properties.length === 0 ? (
          <div className="rounded-md border border-line bg-white p-16 text-center">
            <p className="mb-4 text-muted">
              You have not marked any PG as interested yet.
            </p>
            <Link href="/" className="btn-primary">
              Browse PGs
            </Link>
          </div>
        ) : (
          <ul className="space-y-5">
            {properties.map((property) => (
              <li key={property.id}>
                <PropertyCard property={property} signedIn />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
