import Link from "next/link";
import Logo from "./Logo";

const footerLinks = {
  shop: [
    { href: "/shop?category=rings", label: "Rings" },
    { href: "/shop?category=chains", label: "Chains" },
    { href: "/shop?category=bracelets", label: "Bracelets" },
    { href: "/shop?category=pendants", label: "Pendants" },
    { href: "/shop?category=biker-chains", label: "Biker Chains" },
    { href: "/shop?category=others", label: "Others" },
  ],
  info: [
    { href: "/about", label: "About ZAVR" },
    { href: "/shipping", label: "Shipping" },
    { href: "/returns", label: "Returns" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-obsidian">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-lg" />
            <p className="mt-5 text-[11px] text-muted leading-relaxed max-w-xs">
              Affordable jewellery with a premium brand experience. Designed for everyone.
            </p>
            <a
              href="https://instagram.com/zavr.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-[11px] text-chrome hover:text-offwhite transition-colors tracking-wider"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              @zavr.co
            </a>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-chrome mb-5">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[11px] text-muted hover:text-offwhite transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-chrome mb-5">Info</h3>
            <ul className="space-y-3">
              {footerLinks.info.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[11px] text-muted hover:text-offwhite transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-chrome mb-5">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[11px] text-muted hover:text-offwhite transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted tracking-wider">
            © {new Date().getFullYear()} ZAVR.CO — All rights reserved
          </p>
          <p className="text-[10px] text-muted tracking-wider">
            Islamabad, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
