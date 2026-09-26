"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-container py-24 text-center">
      <FaExclamationTriangle aria-hidden className="mb-4 text-4xl text-brand" />
      <h1 className="mb-2 text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="mb-8 text-muted">
        We could not load this page. Please check that the PGLife API is running, then try again.
      </p>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-outline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
