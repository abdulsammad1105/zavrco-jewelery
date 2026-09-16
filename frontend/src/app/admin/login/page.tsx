"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-chrome/50 transition-colors";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-40 pb-24 px-5 sm:px-8 max-w-md mx-auto">
      <h1 className="heading-display text-3xl text-offwhite mb-2">Admin Login</h1>
      <p className="text-[12px] text-muted mb-10">
        Restricted access — ZAVR.CO staff only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Admin Email *"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password *"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={inputClass}
        />

        {error && <p className="text-[12px] text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-4 bg-offwhite text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-silver transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
