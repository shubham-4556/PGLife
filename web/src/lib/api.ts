import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { ApiError, request } from "./api-client";
import { apiServerUrl } from "./site";
import type { City, PropertyDetail, PropertySummary, SessionUser, SortOption } from "@/types";

/**
 * Forwards the visitor's auth cookie so server components render with the same
 * session state the browser would send. The API lives on another origin, so the
 * cookie has to be relayed explicitly.
 */
async function authHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();
  return cookie ? { cookie } : {};
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/** Wraps a server fetch so a 404 becomes NotFoundError and 401 becomes null. */
async function serverGet<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    return await request<T>(apiServerUrl, path, {
      ...init,
      headers: { ...(await authHeaders()), ...init.headers },
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) throw new NotFoundError(error.message);
    throw error;
  }
}

export const getCities = cache(async (): Promise<City[]> => {
  const { cities } = await serverGet<{ cities: City[] }>("/api/cities");
  return cities;
});

export interface PropertyQuery {
  city?: string;
  gender?: string;
  sort?: SortOption;
}

function toQueryString(query: PropertyQuery): string {
  const params = new URLSearchParams();
  if (query.city) params.set("city", query.city);
  if (query.gender) params.set("gender", query.gender);
  if (query.sort) params.set("sort", query.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getProperties(query: PropertyQuery = {}): Promise<PropertySummary[]> {
  const { properties } = await serverGet<{ properties: PropertySummary[] }>(
    `/api/properties${toQueryString(query)}`,
  );
  return properties;
}

export async function getProperty(id: number): Promise<PropertyDetail> {
  const { property } = await serverGet<{ property: PropertyDetail }>(`/api/properties/${id}`);
  return property;
}

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const { user } = await serverGet<{ user: SessionUser }>("/api/auth/me");
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthorized) return null;
    throw error;
  }
});

export async function getInterestedProperties(): Promise<PropertySummary[]> {
  const { properties } = await serverGet<{ properties: PropertySummary[] }>("/api/me/interested");
  return properties;
}
