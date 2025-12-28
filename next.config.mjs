/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: API routes require server mode (no static export)
  // This works with Hostinger Node.js hosting
  basePath: '/pepperoni',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
