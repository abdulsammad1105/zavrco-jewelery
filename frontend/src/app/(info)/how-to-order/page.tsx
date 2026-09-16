import type { Metadata } from "next";

export const metadata: Metadata = { title: "How to Order" };

export default function HowToOrderPage() {
  const steps = [
    { title: "Browse the Collection", desc: "Explore Rings, Chains, Bracelets, Pendants, Biker Chains and Statement pieces in the Shop." },
    { title: "Add to Cart", desc: "Every product is automatically 10% off — no code needed. Add as many pieces as you like." },
    { title: "Checkout", desc: "Enter your name, phone number and delivery address. No account required to order." },
    { title: "Cash on Delivery", desc: "Pay in cash when your order arrives at your doorstep — nationwide across Pakistan." },
    { title: "Track Your Order", desc: "Use your Order ID and phone number on the Track Order page to check delivery status anytime." },
  ];

  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">How to Order</h1>
      <div className="space-y-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-5">
            <span className="editorial-index shrink-0 pt-1">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-offwhite text-base mb-1">{step.title}</h2>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
