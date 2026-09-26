"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaHeart } from "react-icons/fa";
import { ApiError, request } from "@/lib/api-client";
import { apiBaseUrl } from "@/lib/site";

interface InterestButtonProps {
  propertyId: number;
  initialIsInterested: boolean;
  initialCount: number;
  signedIn: boolean;
  showCount?: boolean;
}

export function InterestButton({
  propertyId,
  initialIsInterested,
  initialCount,
  signedIn,
  showCount = true,
}: InterestButtonProps) {
  const router = useRouter();
  const [isInterested, setIsInterested] = useState(initialIsInterested);
  const [count, setCount] = useState(initialCount);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function toggle() {
    if (!signedIn) {
      router.push("/login?next=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    const next = !isInterested;
    setError(null);

    // Optimistic: flip the heart immediately, revert if the API disagrees.
    setIsInterested(next);
    setCount((current) => current + (next ? 1 : -1));

    try {
      const result = await request<{ isInterested: boolean; interestedCount: number }>(
        apiBaseUrl,
        `/api/properties/${propertyId}/interested`,
        { method: next ? "POST" : "DELETE" },
      );
      setIsInterested(result.isInterested);
      setCount(result.interestedCount);
      startTransition(() => router.refresh());
    } catch (cause) {
      setIsInterested(!next);
      setCount((current) => current + (next ? -1 : 1));
      setError(
        cause instanceof ApiError && cause.isUnauthorized
          ? "Your session expired. Please log in again."
          : "Could not update your interest. Please try again.",
      );
    }
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        aria-pressed={isInterested}
        aria-label={isInterested ? "Remove from interested properties" : "Mark as interested"}
        className="text-2xl text-brand transition-transform hover:scale-110 disabled:opacity-60"
      >
        <FaHeart aria-hidden className={isInterested ? "" : "text-line"} />
      </button>

      {showCount && (
        <p className="text-xs text-muted">
          <span className="sr-only">Number of people interested: </span>
          {count} interested
        </p>
      )}

      {error && (
        <p role="alert" className="mt-1 text-xs text-brand">
          {error}
        </p>
      )}
    </div>
  );
}
