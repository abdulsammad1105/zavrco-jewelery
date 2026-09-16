import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "uhafdcciheiejdyrbsws.supabase.co" },
    ],
  },
};

export default nextConfig;
