"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import type { City } from "@/types";

export function CitySearch({ cities }: { cities: City[] }) {
  const router = useRouter();
  const [city, setCity] = useState("");

  const suggestions = cities
    .filter((candidate) => candidate.name.toLowerCase().includes(city.trim().toLowerCase()))
    .slice(0, 6);

  function go(target?: string) {
    const name = (target ?? city).trim();
    if (!name) return;
    router.push(`/properties?city=${encodeURIComponent(name)}`);
  }

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          go(suggestions[0]?.name);
        }}
        role="search"
      >
        <label htmlFor="city" className="sr-only">
          Search for PGs by city
        </label>
        <div className="flex overflow-hidden rounded-md bg-white shadow-lg">
          <input
            id="city"
            list="city-options"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter your city to search for PGs"
            className="w-full border-0 px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:outline-none"
          />
          <button type="submit" className="btn-secondary px-5" aria-label="Search">
            <FaSearch aria-hidden />
          </button>
        </div>
      </form>

      <datalist id="city-options">
        {cities.map((candidate) => (
          <option key={candidate.id} value={candidate.name} />
        ))}
      </datalist>

      {city.trim() && suggestions.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-line bg-white shadow-lg">
          {suggestions.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                onClick={() => go(candidate.name)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-brand-tint"
              >
                {candidate.name}
                <span className="text-xs text-muted">
                  {candidate.propertyCount} PG{candidate.propertyCount === 1 ? "" : "s"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
