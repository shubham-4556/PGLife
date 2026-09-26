import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container py-24 text-center">
      <h1 className="mb-2 text-5xl font-bold text-brand">404</h1>
      <h2 className="mb-4 text-2xl font-bold text-ink">Page not found</h2>
      <p className="mb-8 text-muted">Sorry, we could not find the page you were looking for.</p>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </div>
  );
}
