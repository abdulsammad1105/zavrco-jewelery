import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ZAVR.CO — affordable, premium-quality jewellery designed for the modern individual.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.4em] text-chrome uppercase mb-4">
          About Us
        </p>
        <h1 className="text-3xl md:text-5xl font-light tracking-wider uppercase leading-tight">
          We Don&apos;t Do Labels.
          <br />
          <span className="text-silver">We Do Jewellery.</span>
        </h1>
      </div>

      {/* Image */}
      <div className="relative aspect-[16/9] mb-8 rounded-3xl overflow-hidden ">
        <Image
          src="/images/about.png"
          alt="ZAVR.CO"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="space-y-8 text-sm text-muted leading-relaxed max-w-2xl mx-auto">
        <p>
          ZAVR.CO was born from a simple frustration — why does looking good
          have to cost so much? We believe in creating jewellery that&apos;s
          accessible, well-designed, and built to last.
        </p>

        <p>
          Based in Pakistan, we design every piece with intention. Our
          collections span from everyday essentials like bands and chains to
          bold statement pieces like biker links and industrial cuffs. No
          gender rules. No arbitrary markups. Just honest jewellery.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-border">
          <div className="text-center">
            <p className="text-2xl font-light text-offwhite mb-1">Premium</p>
            <p className="text-xs tracking-wider uppercase text-chrome">
              Quality Materials
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-offwhite mb-1">Unisex</p>
            <p className="text-xs tracking-wider uppercase text-chrome">
              Designed for All
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-offwhite mb-1">Pakistan</p>
            <p className="text-xs tracking-wider uppercase text-chrome">
              Nationwide Shipping
            </p>
          </div>
        </div>

        <p>
          Every ZAVR piece is made from stainless steel or titanium alloy —
          materials chosen for their durability, weight, and skin-safe
          properties. We use PVD coating and silver plating to achieve
          premium finishes that resist wear and tarnishing.
        </p>

        <p>
          We&apos;re not trying to be the biggest jewellery brand. We&apos;re
          trying to be the one you actually wear.
        </p>
      </div>
    </div>
  );
}
