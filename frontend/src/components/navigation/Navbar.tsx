"use client";

import { apiFetch } from "@/lib/api";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/layout/Logo";
import { useCart } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/journal", label: "Journal" },
  { href: "/track-order", label: "Track Order" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { itemCount, setIsOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setLoggedIn(!!data.user))
      .catch(() => {});
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian/95 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-14">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-1.5 -ml-1.5 text-offwhite/80 hover:text-silver transition-colors"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 7h16M4 12h12M4 17h8" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 xl:static xl:translate-x-0">
            <Logo />
          </Link>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-2 ml-8">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-1.5 rounded-full text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    active
                      ? "bg-silver/10 text-silver border border-silver/30"
                      : "text-chrome hover:text-offwhite border border-transparent"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5">
            <Link
              href="/shop"
              className="hidden sm:block text-chrome/70 hover:text-offwhite transition-colors"
              aria-label="Search"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
            </Link>

            <Link
              href="/account/wishlist"
              className="hidden sm:block text-chrome/70 hover:text-offwhite transition-colors"
              aria-label="Wishlist"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1.2 6 3.8C14.5 6.2 16 5 18 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
              </svg>
            </Link>

            <Link
              href={loggedIn ? "/account" : "/login"}
              className="hidden sm:block text-chrome/70 hover:text-offwhite transition-colors"
              aria-label="Account"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative text-chrome/70 hover:text-offwhite transition-colors"
              aria-label="Cart"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-offwhite text-obsidian text-[9px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-obsidian/90 backdrop-blur-sm z-40 xl:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[86%] max-w-xs bg-charcoal z-50 xl:hidden flex flex-col border-r border-silver/15 shadow-2xl"
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between px-6 h-14 border-b border-silver/15 shrink-0">
                <Logo className="text-[13px]" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 -mr-1.5 text-chrome hover:text-silver transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <p className="editorial-index mb-4">Navigate</p>
                <nav>
                  {links.map((l, i) => {
                    const active = pathname === l.href;
                    return (
                      <motion.div
                        key={l.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, duration: 0.35 }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex items-center justify-between py-3.5 text-xl heading-display transition-colors ${
                            active ? "text-silver" : "text-offwhite/90 hover:text-silver"
                          }`}
                        >
                          <span>{l.label}</span>
                          <span className="text-silver opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                            →
                          </span>
                        </Link>
                        {i < links.length - 1 && (
                          <div className="h-px bg-gradient-to-r from-silver/40 via-silver/10 to-transparent" />
                        )}
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="h-px bg-gradient-to-r from-silver/40 via-silver/10 to-transparent my-8" />

                <p className="editorial-index mb-4">Account</p>
                <div className="space-y-1">
                  <Link
                    href={loggedIn ? "/account" : "/login"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-[12px] tracking-[0.1em] uppercase text-chrome hover:text-silver transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                    </svg>
                    {loggedIn ? "My Account" : "Login / Register"}
                  </Link>
                  <Link
                    href="/account/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-[12px] tracking-[0.1em] uppercase text-chrome hover:text-silver transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1.2 6 3.8C14.5 6.2 16 5 18 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
                    </svg>
                    Wishlist
                  </Link>
                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-[12px] tracking-[0.1em] uppercase text-chrome hover:text-silver transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4-4" />
                    </svg>
                    Search
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-silver/15 shrink-0">
                <p className="text-[10px] tracking-[0.2em] uppercase text-silver text-center">
                  10% off everything — no code needed
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
