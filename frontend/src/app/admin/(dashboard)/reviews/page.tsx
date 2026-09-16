"use client";

import { apiFetch } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch("/api/reviews/admin/all");
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublished(r: Review) {
    await apiFetch(`/api/reviews/admin/${r.id}/publish`, {
      method: "PUT",
      body: JSON.stringify({ published: !r.published }),
    });
    load();
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review?")) return;
    await apiFetch(`/api/reviews/admin/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-xl tracking-wider uppercase font-light mb-6">
        Reviews ({reviews.length})
      </h1>

      {loading ? (
        <p className="text-sm text-muted py-10 text-center">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted py-10 text-center">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-charcoal rounded border border-border p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-chrome">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded tracking-wider uppercase border ${
                    r.published ? "border-green-500/30 text-green-500" : "border-red-400/30 text-red-400"
                  }`}
                >
                  {r.published ? "Published" : "Hidden"}
                </span>
              </div>
              <p className="text-sm text-muted mb-3">{r.comment}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => togglePublished(r)}
                  className="text-xs tracking-wider uppercase text-chrome hover:text-offwhite transition-colors"
                >
                  {r.published ? "Hide" : "Publish"}
                </button>
                <button
                  onClick={() => deleteReview(r.id)}
                  className="text-xs tracking-wider uppercase text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
