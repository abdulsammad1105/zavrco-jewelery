"use client";

import { apiFetch } from "@/lib/api";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { formatPrice, formatOrderId } from "@/lib/utils";
import type { OrderItemData } from "@/types";

type Order = {
  id: number;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  items: OrderItemData[];
  subtotal: string;
  total: string;
  status: string;
  paymentMethod: string;
  paymentProof: string | null;
  createdAt: string;
};

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await apiFetch("/api/orders");
    setOrders(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: string) {
    await apiFetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-xl tracking-wider uppercase font-light mb-6">
        Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <p className="text-sm text-muted py-10 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-charcoal rounded border border-border"
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium">{formatOrderId(order.id)}</span>
                  <span className="text-sm text-muted">
                    {order.customerName}
                  </span>
                  <span className="text-sm">{formatPrice(order.total)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded tracking-wider uppercase border ${
                      order.status === "delivered"
                        ? "border-green-500/30 text-green-500"
                        : order.status === "cancelled"
                          ? "border-red-400/30 text-red-400"
                          : "border-border text-chrome"
                    }`}
                  >
                    {order.status}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-muted transition-transform ${expandedId === order.id ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {expandedId === order.id && (
                <div className="px-6 pb-6 border-t border-border pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-chrome uppercase tracking-wider mb-1">
                        Customer
                      </p>
                      <p>{order.customerName}</p>
                      <p className="text-muted">{order.customerPhone}</p>
                      {order.customerEmail && (
                        <p className="text-muted">{order.customerEmail}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-chrome uppercase tracking-wider mb-1">
                        Shipping Address
                      </p>
                      <p>{order.address}</p>
                      <p className="text-muted">
                        {order.city}, {order.province}
                        {order.postalCode ? ` ${order.postalCode}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-chrome uppercase tracking-wider mb-1">
                        Payment
                      </p>
                      <p className="uppercase">{order.paymentMethod}</p>
                      <p className="text-muted text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {order.paymentProof && (
                    <div>
                      <p className="text-xs text-chrome uppercase tracking-wider mb-2">
                        Payment Screenshot
                      </p>
                      <a href={order.paymentProof} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={order.paymentProof}
                          alt="Payment proof"
                          width={220}
                          height={160}
                          className="max-w-[220px] border border-border rounded"
                        />
                      </a>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-chrome uppercase tracking-wider mb-2">
                      Items
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>
                            {formatPrice(
                              parseFloat(item.price) * item.quantity,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border/50 mt-2 pt-2 flex justify-between text-sm font-medium">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-chrome uppercase tracking-wider">
                      Update Status:
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                      className="bg-obsidian border border-border px-3 py-1.5 text-xs text-offwhite focus:outline-none focus:border-chrome cursor-pointer"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}