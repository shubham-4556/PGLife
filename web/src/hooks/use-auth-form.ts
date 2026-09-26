"use client";

import { useState } from "react";
import { ApiError, request } from "@/lib/api-client";
import { apiBaseUrl } from "@/lib/site";

export interface AuthFormValues {
  email: string;
  password: string;
}

export interface AuthResult {
  fieldErrors: Record<string, string>;
  formError: string | null;
}

export function useAuthForm(endpoint: "/api/auth/login" | "/api/auth/signup") {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AuthResult>({ fieldErrors: {}, formError: null });

  async function submit(values: Record<string, string>): Promise<boolean> {
    setPending(true);
    setResult({ fieldErrors: {}, formError: null });

    try {
      await request(apiBaseUrl, endpoint, { method: "POST", body: values });
      return true;
    } catch (error) {
      const fields = error instanceof ApiError ? (error.fields ?? {}) : {};
      setResult({
        fieldErrors: fields,
        formError:
          error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      });
      return false;
    } finally {
      setPending(false);
    }
  }

  return { submit, pending, ...result };
}
