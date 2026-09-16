"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full bg-charcoal/50 border border-border/50 px-4 py-3 text-[12px] text-offwhite placeholder:text-muted focus:outline-none focus:border-silver/60 transition-colors";

export default function ReviewForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await apiFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
    router.refresh();
  }

  if (done) {
    return <p className="text-[13px] text-muted">Thank you — your review has been posted.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input
        type="text"
        placeholder="Your Name *"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputClass}
      />
      <select
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        className={`${inputClass} cursor-pointer`}
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
        ))}
      </select>
      <textarea
        placeholder="Share your experience *"
        required
        rows={3}
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        className={`${inputClass} resize-none`}
      />
      {error && <p className="text-[12px] text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="py-3 px-6 bg-offwhite text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-silver transition-colors disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
}
