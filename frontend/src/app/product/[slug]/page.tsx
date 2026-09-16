import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import type { Product } from "@/types";
import { API_URL } from "@/lib/api";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function fetchProductData(slug: string) {
  const res = await fetch(`${API_URL}/api/products/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as {
    product: Product;
    categoryName: string | null;
    related: Product[];
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchProductData(slug);
  if (!data) return { title: "Product Not Found" };
  const { product } = data;
  return {
    title: product.name,
    description: product.description || `${product.name} — ZAVR.CO`,
    openGraph: {
      title: `${product.name} | ZAVR.CO`,
      description: product.description || `${product.name} — Premium fashion jewellery`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchProductData(slug);

  if (!data) notFound();

  return (
    <ProductDetail
      product={data.product}
      categoryName={data.categoryName}
      related={data.related}
    />
  );
}
