"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import { useAuthForm } from "@/hooks/use-auth-form";
import type { Gender } from "@/types";

const GENDERS: Array<{ value: Gender; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

export default function SignupPage() {
  const router = useRouter();
  const { submit, pending, fieldErrors, formError } = useAuthForm("/api/auth/signup");
  const [gender, setGender] = useState<Gender>("male");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const ok = await submit({
      fullName: String(data.get("fullName") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      collegeName: String(data.get("collegeName") ?? ""),
      gender,
    });

    if (ok) {
      router.push("/dashboard");
      router.refresh();
    }
  }

  const invalid = (name: string) => Boolean(fieldErrors[name]);

  return (
    <div className="page-container flex justify-center py-16">
      <div className="card-shadow w-full max-w-lg rounded-md bg-white p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-ink">Signup with PGLife</h1>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {formError && (
            <p role="alert" className="rounded-md bg-brand-tint px-4 py-3 text-sm text-brand-dark">
              {formError}
            </p>
          )}

          <Field
            id="fullName"
            label="Full Name"
            icon={<FaUser aria-hidden />}
            error={fieldErrors.fullName}
          >
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              maxLength={30}
              autoComplete="name"
              placeholder="Your full name"
              aria-invalid={invalid("fullName")}
              className={`field pl-10 ${invalid("fullName") ? "field-invalid" : ""}`}
            />
          </Field>

          <Field
            id="phone"
            label="Phone Number"
            icon={<FaPhoneAlt aria-hidden />}
            error={fieldErrors.phone}
          >
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              pattern="\d{10}"
              minLength={10}
              maxLength={10}
              autoComplete="tel"
              placeholder="10 digit mobile number"
              aria-invalid={invalid("phone")}
              className={`field pl-10 ${invalid("phone") ? "field-invalid" : ""}`}
            />
          </Field>

          <Field id="email" label="Email" icon={<FaEnvelope aria-hidden />} error={fieldErrors.email}>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={invalid("email")}
              className={`field pl-10 ${invalid("email") ? "field-invalid" : ""}`}
            />
          </Field>

          <Field id="password" label="Password" icon={<FaLock aria-hidden />}>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="field pl-10"
            />
          </Field>

          <Field
            id="collegeName"
            label="College Name"
            icon={<FaUniversity aria-hidden />}
            error={fieldErrors.collegeName}
          >
            <input
              id="collegeName"
              name="collegeName"
              type="text"
              required
              maxLength={150}
              placeholder="Where do you study or work?"
              aria-invalid={invalid("collegeName")}
              className={`field pl-10 ${invalid("collegeName") ? "field-invalid" : ""}`}
            />
          </Field>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink">I&apos;m a</legend>
            <div className="flex flex-wrap gap-4">
              {GENDERS.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={gender === option.value}
                    onChange={() => setGender(option.value)}
                    className="h-4 w-4 accent-brand"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {fieldErrors.gender && <p className="mt-1 text-xs text-brand">{fieldErrors.gender}</p>}
          </fieldset>

          <button type="submit" disabled={pending} className="btn-primary w-full py-3">
            {pending ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">
          {icon}
        </span>
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-brand">{error}</p>}
    </div>
  );
}
