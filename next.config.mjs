/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // proxy same-origin → API: cookie httpOnly refresh hoạt động không cần CORS
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_INTERNAL_URL ?? 'http://localhost:9000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
