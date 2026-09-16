import type { Metadata } from "next";
import Link from "next/link";
import { formatOrderId } from "@/lib/utils";
 
export const metadata: Metadata = {
  title: "Order Confirmed",
};
 
type Props = {
  searchParams: Promise<{ id?: string }>;
};
 
export default async function OrderConfirmationPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.id;
 
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
      <div className="mb-8">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="mx-auto text-green-500"
        >
          <circle
            cx="32"
            cy="32"
            r="30"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 32l8 8 16-16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
 
      <h1 className="text-3xl font-light tracking-wider uppercase mb-4">
        Order Confirmed
      </h1>
 
      {orderId && (
        <p className="text-sm text-chrome mb-2">
          Order {formatOrderId(Number(orderId))}
        </p>
      )}
 
      <p className="text-sm text-muted leading-relaxed max-w-md mx-auto mb-4">
        Thank you for your order! We&apos;ve received your order and will
        process it shortly. You&apos;ll receive an update when your order
        ships.
      </p>
 
      <div className="bg-charcoal rounded p-6 max-w-sm mx-auto mb-8">
        <p className="text-xs tracking-wider uppercase text-chrome mb-2">
          Payment Method
        </p>
        <p className="text-sm">Cash on Delivery(Delivery Charges Paid)</p>
        <p className="text-xs text-muted mt-1">
          We&apos;ll confirm your payment shortly and begin processing your order.
        </p>
      </div>
 
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/shop"
          className="px-8 py-3 bg-offwhite text-obsidian text-sm tracking-wider uppercase font-medium hover:bg-silver transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="px-8 py-3 border border-border text-offwhite text-sm tracking-wider uppercase hover:border-chrome transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}