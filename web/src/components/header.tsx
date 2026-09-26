import Image from "next/image";
import Link from "next/link";
import { FaUser, FaSignInAlt } from "react-icons/fa";
import type { SessionUser } from "@/types";
import { LogoutButton } from "./logout-button";

export function Header({ user }: { user: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <nav className="page-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="PG Life home">
          <Image src="/img/logo.png" alt="PG Life" width={138} height={51} className="h-8 w-auto" priority />
        </Link>

        <ul className="flex items-center gap-1 text-sm sm:gap-3">
          {user ? (
            <>
              <li className="hidden text-muted sm:block">
                Hi, <span className="font-semibold text-ink">{user.fullName}</span>
              </li>
              <li>
                <Link href="/dashboard" className="nav-link">
                  <FaUser aria-hidden /> Dashboard
                </Link>
              </li>
              <li aria-hidden className="hidden h-6 w-px bg-line sm:block" />
              <li>
                <LogoutButton />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/signup" className="nav-link">
                  <FaUser aria-hidden /> Signup
                </Link>
              </li>
              <li aria-hidden className="hidden h-6 w-px bg-line sm:block" />
              <li>
                <Link href="/login" className="nav-link">
                  <FaSignInAlt aria-hidden /> Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
