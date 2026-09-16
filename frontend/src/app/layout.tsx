import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import CartProvider from "@/components/cart/CartProvider";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "ZAVR.CO — Jewellery Without a Label",
    template: "%s | ZAVR.CO",
  },
  description:
    "Affordable fashion jewellery with a premium brand experience. Rings, chains, bracelets, pendants, biker chains & statement pieces for everyone.",
  keywords: [
    "ZAVR",
    "jewellery",
    "fashion jewelry",
    "rings",
    "chains",
    "bracelets",
    "pendants",
    "biker chains",
    "statement jewellery",
    "Pakistan",
    "unisex jewellery",
  ],
  openGraph: {
    title: "ZAVR.CO — Jewellery Without a Label",
    description: "Affordable fashion jewellery with a premium brand experience.",
    siteName: "ZAVR.CO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-obsidian text-offwhite antialiased min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1 pt-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
