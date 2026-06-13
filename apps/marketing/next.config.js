const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      { source: '/login', destination: '/en', permanent: true },
      { source: '/register', destination: '/en', permanent: true },
      { source: '/:locale/login', destination: '/en', permanent: true },
      { source: '/:locale/register', destination: '/en', permanent: true },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
