import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">
        Contact Us
      </h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>We&apos;d love to hear from you. Reach out through any of the channels below.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-charcoal p-6 rounded">
            <h2 className="text-offwhite text-base mb-2">Instagram</h2>
            <p>DM us on Instagram for the fastest response.</p>
            <a href="https://instagram.com/zavr.co" target="_blank" rel="noopener noreferrer" className="text-offwhite underline underline-offset-4 mt-2 inline-block">@zavr.co</a>
          </div>
          <div className="bg-charcoal p-6 rounded">
            <h2 className="text-offwhite text-base mb-2">Email</h2>
            <p>For order inquiries and business matters.</p>
            <p className="text-offwhite mt-2">hello@zavr.co</p>
          </div>
        </div>
        <p>Based in Islamabad, Pakistan. We typically respond within 24 hours.</p>
      </div>
    </>
  );
}
