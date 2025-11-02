const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  // next-pwa adds webpack config, so we need to use webpack instead of Turbopack
  // Add empty turbopack config to silence the warning
  turbopack: {},
  // Fix workspace root warning
  outputFileTracingRoot: require('path').join(__dirname),
});
