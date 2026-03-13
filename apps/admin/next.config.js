/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pharmabag/ui', '@pharmabag/api-client', '@pharmabag/utils'],
  reactStrictMode: true,
};

module.exports = nextConfig;
