// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  turbopack: {}, // Đặt ở đây thay vì trong experimental
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [75],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  // experimental: {
  //   turbo: {},
  // },
};

export default config;