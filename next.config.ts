import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  devIndicators: {
    allowedDevOrigins: [
      "https://6000-firebase-studio-1769757188156.cluster-fdkw7vjj7bgguspe3fbbc25tra.cloudworkstations.dev",
    ]
  },
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
};

export default nextConfig;

