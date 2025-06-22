import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: { test: { test: (arg0: string) => unknown } }) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      use: ['@svgr/webpack'],
    });

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
