import Hero from "./sections/Hero";
import BrandStatement from "./sections/BrandStatement";
import FeaturedProducts from "./sections/FeaturedProducts";
import CollectionsGrid from "./sections/CollectionsGrid";
import NewArrivals from "./sections/NewArrivals";
import AboutSection from "./sections/AboutSection";
import Newsletter from "@/components/layout/Newsletter";
import type { Product, Category } from "@/types";
import { API_URL } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  let featuredProducts: Product[] = [];
  let newProducts: Product[] = [];
  let allCategories: Category[] = [];

  try {
    const [featuredRes, newRes, categoriesRes] = await Promise.all([
      fetch(`${API_URL}/api/products?featured=true&limit=8`, { cache: "no-store" }),
      fetch(`${API_URL}/api/products?new=true&sort=newest&limit=4`, { cache: "no-store" }),
      fetch(`${API_URL}/api/categories`, { cache: "no-store" }),
    ]);
    featuredProducts = await featuredRes.json();
    newProducts = await newRes.json();
    allCategories = await categoriesRes.json();
  } catch {
    // Backend may be unreachable at build/render time
  }

  return (
    <>
      <Hero />
      <BrandStatement />
      <FeaturedProducts products={featuredProducts} />
      <CollectionsGrid categories={allCategories} />
      <NewArrivals products={newProducts} />
      <AboutSection />
      <Newsletter />
    </>
  );
}
