import type { NextConfig } from 'next';
import { securityHeaders } from './app/lib/security-headers';

const nextConfig: NextConfig = {
  async headers() {
    const headers = securityHeaders(process.env.NODE_ENV === 'production');
    // A raiz fica explícita: no vinext 1.0.0-beta.3, `/:path*` não casa com `/`.
    return [
      { source: '/', headers },
      { source: '/:path*', headers },
    ];
  },
};

export default nextConfig;
