const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Optimize for Netlify
  sw: 'sw.js',
  swcMinify: true,
  // Exclude static files from service worker
  publicExcludes: ['!noprecache/**/*'],
  buildExcludes: [/app-build-manifest\.json$/],
});

module.exports = withPWA({
  reactStrictMode: true,
  // next-pwa adds webpack config, so we need to use webpack instead of Turbopack
  // Add empty turbopack config to silence the warning
  turbopack: {},
  // Fix workspace root warning
  outputFileTracingRoot: require('path').join(__dirname),
  // Netlify's Next.js plugin handles the output
  // Don't use standalone mode - let Netlify plugin handle it
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
});
