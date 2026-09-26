import Image from "next/image";
import Link from "next/link";
import { getCities } from "@/lib/api";

export async function Footer() {
  const cities = await getCities()
    .then((all) => all.filter((city) => city.propertyCount > 0).slice(0, 5))
    .catch(() => []);

  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="page-container flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {cities.map((city) => (
            <li key={city.id}>
              <Link
                href={`/properties?city=${encodeURIComponent(city.name)}`}
                className="text-sm font-semibold text-ink transition-colors hover:text-brand"
              >
                PG in {city.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Image src="/img/logo.png" alt="" aria-hidden width={122} height={45} className="h-7 w-auto" />
          <p className="text-sm text-muted">&copy; {new Date().getFullYear()} PG Life</p>
        </div>
      </div>
    </footer>
  );
}
