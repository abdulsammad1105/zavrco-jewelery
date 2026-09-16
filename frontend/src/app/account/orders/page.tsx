import { cookies } from "next/headers";
import type { Order } from "@/types";
import { formatPrice, formatOrderId } from "@/lib/utils";
import { serverApiFetch } from "@/lib/api";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  let userOrders: Order[] = [];

  try {
    const res = await serverApiFetch("/api/orders/mine", cookieStore.toString());
    if (res.ok) userOrders = await res.json();
  } catch {
    // Backend may be unreachable
  }

  return (
    <div>
      <h2 className="text-[11px] tracking-[0.2em] uppercase text-chrome mb-5">Orders</h2>

      {userOrders.length === 0 ? (
        <p className="text-[13px] text-muted">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div key={order.id} className="border border-border/50 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[13px] text-offwhite">Order {formatOrderId(order.id)}</p>
                  <p className="text-[11px] text-muted">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.15em] uppercase text-chrome border border-border/50 px-2 py-1">
                  {order.status}
                </span>
              </div>
              <p className="text-[12px] text-muted mb-2">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
              <p className="text-[14px] text-offwhite">{formatPrice(order.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}