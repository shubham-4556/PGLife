import { config } from "./site";

/** Thrown for any non-2xx response from the PGLife API. */
export class ApiError extends Error {
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/** Shared request pipeline for both the server and browser API clients. */
export async function request<T>(baseUrl: string, path: string, options: RequestOptions = {}) {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${baseUrl}${path}`, {
    ...rest,
    // The API runs on a different origin (port 4000 vs 3000), and `fetch`
    // defaults to `same-origin`, which would make the browser silently drop the
    // `Set-Cookie` on login/signup and never send the session cookie back.
    // The API enables CORS with `credentials: true` and an explicit origin
    // allowlist to make this work.
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as { error?: string } | null)?.error ?? `Request failed with status ${response.status}`;
    throw new ApiError(
      response.status,
      message,
      (payload as { fields?: Record<string, string> } | null)?.fields,
    );
  }

  return payload as T;
}

export { config };
