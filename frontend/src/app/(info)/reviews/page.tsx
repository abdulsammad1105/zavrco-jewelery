import type { Metadata } from "next";
import type { Review } from "@/types";
import { API_URL } from "@/lib/api";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = { title: "Reviews" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  let reviews: Review[] = [];
  try {
    const res = await fetch(`${API_URL}/api/reviews`, { cache: "no-store" });
    reviews = await res.json();
  } catch {
    // Backend may be unreachable
  }

  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">Reviews</h1>

      <div className="mb-12">
        <h2 className="text-offwhite text-base mb-4">Leave a Review</h2>
        <ReviewForm />
      </div>

      <div className="space-y-6 border-t border-border/50 pt-10">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet — be the first to share your experience.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-border/30 pb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-offwhite text-sm">{r.name}</span>
                <span className="text-chrome text-xs">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
