"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { request } from "@/lib/api-client";
import { apiBaseUrl } from "@/lib/site";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await request(apiBaseUrl, "/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button type="button" onClick={handleLogout} disabled={pending} className="nav-link">
      <FaSignOutAlt aria-hidden /> {pending ? "Logging out" : "Logout"}
    </button>
  );
}
