import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden">
        <Image
          src="/images/logo.jpg"
          alt="ZAVR.CO"
          fill
          sizes="32px"
          className="object-cover"
          priority
        />
      </span>
      <span className="font-medium tracking-[0.35em] uppercase text-silver">
        ZAVR<span className="text-silver/70">.CO</span>
      </span>
    </span>
  );
}
