import type { NextConfig } from "next";

const repo = 'puyo-puyo';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? `/${repo}` : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repo}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
