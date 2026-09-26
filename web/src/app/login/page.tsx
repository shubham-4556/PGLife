"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { useAuthForm } from "@/hooks/use-auth-form";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submit, pending, fieldErrors, formError } = useAuthForm("/api/auth/login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const next = searchParams.get("next") ?? "/";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const ok = await submit({ email, password });
    if (ok) {
      router.push(next);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {formError && (
        <p role="alert" className="rounded-md bg-brand-tint px-4 py-3 text-sm text-brand-dark">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
          Email
        </label>
        <div className="relative">
          <FaUser
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            className={`field pl-10 ${fieldErrors.email ? "field-invalid" : ""}`}
          />
        </div>
        {fieldErrors.email && <p className="mt-1 text-xs text-brand">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ink">
          Password
        </label>
        <div className="relative">
          <FaLock
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            className="field pl-10"
          />
        </div>
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="page-container flex justify-center py-16">
      <div className="card-shadow w-full max-w-md rounded-md bg-white p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-ink">Login with PGLife</h1>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-line/40" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
