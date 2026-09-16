import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">
        Shipping Information
      </h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>We deliver across Pakistan. All orders are processed within 1–2 business days.</p>
        <div>
          <h2 className="text-offwhite text-base mb-2">Delivery Timeline</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Major cities (Karachi, Lahore, Islamabad): 2–3 business days</li>
            <li>Other cities: 3–5 business days</li>
            <li>Remote areas: 5–7 business days</li>
          </ul>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Shipping Cost</h2>
          <p>We currently offer <span className="text-offwhite">free shipping</span> on all orders across Pakistan.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Payment</h2>
          <p>Cash on Delivery (COD) is available nationwide. Pay when your order arrives at your doorstep.</p>
        </div>
      </div>
    </>
  );
}
