/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', // พอร์ตของ Backend Go
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;