import Image from "next/image";
import Link from "next/link";
import { getCities } from "@/lib/api";
import { cityImage } from "@/lib/format";
import { CitySearch } from "@/components/city-search";

export default async function HomePage() {
  const cities = await getCities()
    .then((all) => all.filter((city) => city.propertyCount > 0))
    .catch(() => []);

  return (
    <>
      <section
        className="bg-cover bg-center bg-fixed text-white"
        style={{ backgroundImage: "url('/img/bg.png')" }}
      >
        <div className="bg-charcoal/70">
          <div className="page-container py-24 text-center sm:py-36">
            <h1 className="mb-6 text-3xl font-bold sm:text-4xl">Happiness per Square Foot</h1>
            <CitySearch cities={cities} />
          </div>
        </div>
      </section>

      <section className="page-container py-14">
        <h2 className="mb-8 text-center text-2xl font-bold text-ink">Major Cities</h2>

        {cities.length === 0 ? (
          <p className="text-center text-muted">
            No cities are listed yet. Start the API and run the seed script.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {cities.map((city) => (
              <li key={city.id} className="text-center">
                <Link
                  href={`/properties?city=${encodeURIComponent(city.name)}`}
                  className="card-shadow inline-block rounded-full bg-white p-4"
                >
                  <Image
                    src={cityImage(city.name)}
                    alt={city.name}
                    width={96}
                    height={96}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                  <span className="mt-2 block text-sm font-semibold text-ink">{city.name}</span>
                  <span className="block text-xs text-muted">
                    {city.propertyCount} PG{city.propertyCount === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
