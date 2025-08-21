/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // helps catch React issues in dev
  output: 'standalone', // useful for deploying to environments like Docker
  experimental: {
    // No turbo or runtime flags here to avoid warnings
  },
};

export default nextConfig;