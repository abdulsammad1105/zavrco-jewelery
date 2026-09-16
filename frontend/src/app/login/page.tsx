"use client";

import { apiFetch } from "@/lib/api";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const inputClass =
  "w-full bg-charcoal/50 border border-border/50 px-4 py-3.5 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 focus:bg-charcoal transition-all duration-300";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/auth/login", {
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
      router.push(searchParams.get("redirect") || "/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-40 pb-24 px-5 sm:px-8 max-w-md mx-auto relative">
      {/* Decorative gold glow */}
      <div className="pointer-events-none absolute top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-silver/10 rounded-full blur-3xl" />

      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="editorial-index mb-4 text-center"
      >
        ZAVR / ACCOUNT ACCESS
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="heading-display text-4xl text-offwhite text-center mb-2"
      >
        Welcome Back
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[12px] text-muted text-center mb-10"
      >
        Sign in to continue to ZAVR.CO
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-4 relative"
      >
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
          placeholder="Password *"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={inputClass}
        />

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[12px] text-red-400 overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-4 bg-offwhite text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-silver transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center gap-4 my-8"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-silver/30 to-transparent" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="text-[12px] text-muted text-center"
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-silver hover:text-offwhite transition-colors">
          Create one
        </Link>
      </motion.p>
    </main>
  );
}