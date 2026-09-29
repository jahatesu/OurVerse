import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-cdn-ak.spotifycdn.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "image-cdn-fa.spotifycdn.com",
        pathname: "/image/**",
      },
    ],
  },
};
export default nextConfig;
