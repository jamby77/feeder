/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // reactCompiler: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
      },
    ],
  },
};

export default nextConfig;
