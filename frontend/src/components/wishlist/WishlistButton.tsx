"use client";

import { apiFetch } from "@/lib/api";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistButton({
  productId,
  className = "",
  children,
}: {
  productId: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    if (!active) {
      const res = await apiFetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.status === 401) {
        router.push("/login");
        setLoading(false);
        return;
      }
      setActive(true);
    } else {
      await apiFetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      setActive(false);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={className}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1.2 6 3.8C14.5 6.2 16 5 18 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
      </svg>
      {children}
    </button>
  );
}
