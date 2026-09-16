import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">Terms of Service</h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>By using ZAVR.CO, you agree to the following terms.</p>
        <div>
          <h2 className="text-offwhite text-base mb-2">Orders</h2>
          <p>All orders are subject to availability and confirmation. We reserve the right to cancel orders if stock is unavailable or if we detect fraudulent activity.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Pricing</h2>
          <p>All prices are listed in Pakistani Rupees (PKR) and are inclusive of applicable taxes. We reserve the right to change prices without prior notice.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Product Descriptions</h2>
          <p>We make every effort to display product colors and details accurately. However, actual colors may vary slightly depending on your device settings.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Intellectual Property</h2>
          <p>All content on ZAVR.CO — including images, text, and design — is the property of ZAVR.CO and may not be used without permission.</p>
        </div>
      </div>
    </>
  );
}
