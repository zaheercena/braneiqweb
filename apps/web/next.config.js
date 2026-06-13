/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@braneiq/shared-types'],
  output: 'standalone',
};

module.exports = nextConfig;
