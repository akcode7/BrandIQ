/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: 'custom-sw.js',
  fallbacks: {
    document: '/',
  },
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  // Prevent PWA from generating Pages Router files
  buildExcludes: [/app-build-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/hackathon\.api\.qloo\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'qloo-api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'gemini-api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 5,
      },
    },
    {
      urlPattern: /\/api\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Disable static export for PWA with dynamic features
  output: 'standalone',
  trailingSlash: false,
  // Configure dynamic routes that need server-side rendering
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb'],
  },
  // Disable legacy pages directory
  pageExtensions: ['tsx', 'ts'],
};

module.exports = withPWA(nextConfig);
