import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import type { Product, Category } from "@/types";
import { API_URL } from "@/lib/api";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full ZAVR.CO collection — rings, chains, bracelets, pendants, biker chains & statement pieces.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ category?: string; sort?: string; search?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  let allProducts: Product[] = [];
  let allCategories: Category[] = [];

  try {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.sort) qs.set("sort", params.sort);
    if (params.search) qs.set("search", params.search);

    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/api/products?${qs.toString()}`, { cache: "no-store" }),
      fetch(`${API_URL}/api/categories`, { cache: "no-store" }),
    ]);
    allProducts = await productsRes.json();
    allCategories = await categoriesRes.json();
  } catch {
    // Backend may be unreachable at build/render time
  }

  return (
    <ShopClient
      products={allProducts}
      categories={allCategories}
      activeCategory={params.category || ""}
      activeSort={params.sort || ""}
      searchQuery={params.search || ""}
    />
  );
}
