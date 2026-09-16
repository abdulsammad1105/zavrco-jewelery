import type { ReactNode } from "react";

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      {children}
    </div>
  );
}
