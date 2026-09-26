"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaStar } from "react-icons/fa";
import type { Gender, SortOption } from "@/types";
import { SORT_LABEL } from "@/lib/format";

const GENDER_OPTIONS: Array<{ value: Gender | "all"; label: string }> = [
  { value: "all", label: "No Filter" },
  { value: "unisex", label: "Unisex" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const SORT_OPTIONS: SortOption[] = ["rating_desc", "rent_asc", "rent_desc", "name_asc"];

export function FilterBar({ city }: { city?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);

  const activeGender = (searchParams.get("gender") as Gender | null) ?? "all";
  const activeSort = (searchParams.get("sort") as SortOption | null) ?? "rating_desc";

  function apply(next: { gender?: Gender | "all"; sort?: SortOption }) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (value === undefined) continue;
      if (key === "gender") {
        if (value === "all") params.delete("gender");
        else params.set("gender", value);
      }
      if (key === "sort") params.set("sort", value);
    }

    startTransition(() => router.push(`/properties?${params.toString()}`, { scroll: false }));
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setShowFilters((open) => !open)}
          aria-expanded={showFilters}
          className={`flex flex-col items-center gap-1.5 rounded-md border p-3 text-xs font-semibold transition-colors sm:flex-row sm:justify-center ${
            activeGender === "all" ? "border-line bg-white" : "border-brand bg-brand-tint text-brand"
          }`}
        >
          <FaFilter aria-hidden className="text-lg" />
          {showFilters ? "Hide filters" : "Filter"}
        </button>

        {SORT_OPTIONS.filter((option) => option !== "name_asc").map((option) => {
          const icon =
            option === "rent_asc" ? (
              <FaSortAmountUp aria-hidden className="text-lg" />
            ) : option === "rent_desc" ? (
              <FaSortAmountDown aria-hidden className="text-lg" />
            ) : (
              <FaStar aria-hidden className="text-lg" />
            );

          return (
            <button
              key={option}
              type="button"
              onClick={() => apply({ sort: option })}
              aria-pressed={activeSort === option}
              className={`flex flex-col items-center gap-1.5 rounded-md border p-3 text-xs font-semibold transition-colors sm:flex-row sm:justify-center ${
                activeSort === option
                  ? "border-brand bg-brand-tint text-brand"
                  : "border-line bg-white"
              }`}
            >
              {icon}
              {SORT_LABEL[option]}
            </button>
          );
        })}
      </div>

      {showFilters && (
        <div className="mt-4 rounded-md border border-line bg-white p-5">
          <h3 className="mb-3 text-sm font-bold text-ink">Gender</h3>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => apply({ gender: option.value })}
                aria-pressed={activeGender === option.value}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeGender === option.value
                    ? "border-brand bg-brand text-white"
                    : "border-charcoal bg-white text-charcoal hover:border-brand hover:text-brand"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {city && <p className="mt-4 text-xs text-muted">Showing results for {city}.</p>}
        </div>
      )}
    </div>
  );
}
