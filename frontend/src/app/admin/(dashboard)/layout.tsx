import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import { serverApiFetch } from "@/lib/api";
import AdminLogoutButton from "./AdminLogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  let isAdmin = false;
  try {
    const res = await serverApiFetch("/api/auth/admin-me", cookieStore.toString());
    if (res.ok) ({ isAdmin } = await res.json());
  } catch {
    // Backend may be unreachable
  }

  if (!isAdmin) redirect("/admin/login");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Logo className="text-lg" />
          <span className="text-xs tracking-wider uppercase text-chrome bg-charcoal px-2 py-1 rounded">
            Admin
          </span>
        </div>
        <nav className="flex gap-4 text-xs tracking-wider uppercase items-center">
          <Link href="/admin" className="text-chrome hover:text-offwhite transition-colors">
            Products
          </Link>
          <Link href="/admin/orders" className="text-chrome hover:text-offwhite transition-colors">
            Orders
          </Link>
          <Link href="/admin/logs" className="text-chrome hover:text-offwhite transition-colors">
            Logs
          </Link>
          <Link href="/admin/reviews" className="text-chrome hover:text-offwhite transition-colors">
            Reviews
          </Link>
          <Link href="/" className="text-chrome hover:text-offwhite transition-colors">
            Store →
          </Link>
          <AdminLogoutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}
