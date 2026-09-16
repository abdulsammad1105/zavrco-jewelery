"use client";

import { apiFetch } from "@/lib/api";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-40 pb-24 px-5 sm:px-8 max-w-md mx-auto">
      <h1 className="heading-display text-3xl text-offwhite mb-2">Create Account</h1>
      <p className="text-[12px] text-muted mb-10">
        Join ZAVR.CO for faster checkout and order tracking.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name *"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        <input
          type="email"
          placeholder="Email *"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password (min. 8 characters) *"
          required
          minLength={8}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-[12px] text-muted mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-offwhite hover:text-chrome transition-colors">
          Login
        </Link>
      </p>
    </main>
  );
}
