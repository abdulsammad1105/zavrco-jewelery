import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>ZAVR.CO respects your privacy. This policy explains how we collect, use, and protect your information.</p>
        <div>
          <h2 className="text-offwhite text-base mb-2">Information We Collect</h2>
          <p>We collect your name, phone number, email, and shipping address when you place an order. We do not store payment information.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">How We Use Your Information</h2>
          <p>Your information is used solely to process and deliver your orders. We may also send order updates via SMS or email.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Third Parties</h2>
          <p>We do not sell or share your personal information with third parties, except courier partners for delivery purposes.</p>
        </div>
        <div>
          <h2 className="text-offwhite text-base mb-2">Contact</h2>
          <p>For privacy-related inquiries, contact us at hello@zavr.co.</p>
        </div>
      </div>
    </>
  );
}
