import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & Exchanges" };

export default function ReturnsPage() {
  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">
        Returns & Exchanges
      </h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>We want you to love your ZAVR piece. If something isn&apos;t right, we&apos;re here to help.</p>
        <div>
          <h2 className="text-offwhite text-base mb-2">Return Policy</h2>
          <p>Returns are accepted within 7 days of delivery for unused items in their original packaging.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">How to Return</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Contact us via Instagram DM or email with your order number</li>
            <li>Ship the item back in its original packaging</li>
            <li>Once received and inspected, we&apos;ll process your refund or exchange</li>
          </ol>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Non-Returnable Items</h2>
          <p>Items that show signs of wear, damage, or have been altered cannot be returned.</p>
        </div>
      </div>
    </>
  );
}
