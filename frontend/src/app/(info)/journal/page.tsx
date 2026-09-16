import type { Metadata } from "next";

export const metadata: Metadata = { title: "Journal" };

const ARTICLES = [
  {
    title: "Caring for Your Pieces",
    body: "Keep your jewellery away from water, perfume, and harsh chemicals — apply these before, not after, putting your pieces on. Store each piece separately in a dry place to avoid scratching, and wipe gently with a soft cloth after wear to keep the finish sharp.",
  },
  {
    title: "Building a Layered Look",
    body: "Start with one anchor piece — a chain or pendant with real presence — then layer lighter pieces around it. Mixing lengths and finishes (matte against polished) creates depth without looking cluttered. Unisex by design, every piece is meant to move between looks.",
  },
  {
    title: "Designed Without a Label",
    body: "ZAVR was built on a simple idea: jewellery shouldn't be split by gender. Every piece — rings, chains, cuffs, pendants — is designed to be worn by anyone, styled any way. Premium materials, industrial edge, no rules.",
  },
];

export default function JournalPage() {
  return (
    <>
      <h1 className="text-3xl font-light tracking-wider uppercase mb-8">Journal</h1>
      <div className="space-y-10">
        {ARTICLES.map((article) => (
          <article key={article.title}>
            <h2 className="text-offwhite text-base mb-2">{article.title}</h2>
            <p className="text-sm text-muted leading-relaxed">{article.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
