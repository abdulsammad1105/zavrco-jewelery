"use client";

import { apiFetch } from "@/lib/api";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-left text-chrome hover:text-offwhite transition-colors whitespace-nowrap py-1 disabled:opacity-50"
    >
      {loading ? "..." : "Logout"}
    </button>
  );
}
