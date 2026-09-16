"use client";

import { apiFetch } from "@/lib/api";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await apiFetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-chrome hover:text-offwhite transition-colors"
    >
      Logout
    </button>
  );
}
