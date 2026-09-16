import { cookies } from "next/headers";
import { serverApiFetch } from "@/lib/api";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  let user: { name: string; email: string } | null = null;
  try {
    const res = await serverApiFetch("/api/auth/me", cookieStore.toString());
    if (res.ok) ({ user } = await res.json());
  } catch {
    // Backend may be unreachable
  }

  return (
    <div>
      <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Profile</h2>
      <div className="space-y-4 max-w-sm">
        <div>
          <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1">Name</p>
          <p className="text-[14px] text-offwhite">{user?.name}</p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1">Email</p>
          <p className="text-[14px] text-offwhite">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
