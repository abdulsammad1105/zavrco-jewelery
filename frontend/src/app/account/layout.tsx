import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { serverApiFetch } from "@/lib/api";
import LogoutButton from "./LogoutButton";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  let user = null;
  try {
    const res = await serverApiFetch("/api/auth/me", cookieStore.toString());
    if (res.ok) ({ user } = await res.json());
  } catch {
    // Backend may be unreachable
  }
  if (!user) redirect("/login");

  const links = [
    { href: "/account", label: "Profile" },
    { href: "/account/orders", label: "Orders" },
    { href: "/account/wishlist", label: "Wishlist" },
  ];

  return (
    <main className="min-h-screen pt-40 pb-24 px-5 sm:px-8 max-w-5xl mx-auto">
      <h1 className="heading-display text-3xl text-offwhite mb-10">Account</h1>
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-10">
        <nav className="flex sm:flex-col gap-4 sm:gap-2 text-[11px] tracking-[0.15em] uppercase overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-chrome hover:text-offwhite transition-colors whitespace-nowrap py-1"
            >
              {l.label}
            </Link>
          ))}
          <LogoutButton />
        </nav>
        <div>{children}</div>
      </div>
    </main>
  );
}
