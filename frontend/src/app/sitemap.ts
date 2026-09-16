import type { MetadataRoute } from "next";
import type { Product, Category } from "@/types";
import { API_URL } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://zavr.co";

  let productSlugs: { slug: string }[] = [];
  let categorySlugs: { slug: string }[] = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/api/products?limit=1000`, { cache: "no-store" }),
      fetch(`${API_URL}/api/categories`, { cache: "no-store" }),
    ]);
    const products: Product[] = await productsRes.json();
    const categories: Category[] = await categoriesRes.json();
    productSlugs = products.map((p) => ({ slug: p.slug }));
    categorySlugs = categories.map((c) => ({ slug: c.slug }));
  } catch {
    // Backend may be unreachable at build time
  }

  const staticPages = [
    "",
    "/shop",
    "/collections",
    "/about",
    "/shipping",
    "/returns",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })),
    ...productSlugs.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(),
    })),
    ...categorySlugs.map((c) => ({
      url: `${baseUrl}/shop?category=${c.slug}`,
      lastModified: new Date(),
    })),
  ];
}
