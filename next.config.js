const { NEXT_PUBLIC_VERCEL_URL, HOTPEPPER_API_KEY } = process.env;

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' https://*.vercel.app http://localhost:3000`,
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_HOST: NEXT_PUBLIC_VERCEL_URL ? `https://${NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000',
  },
  serverRuntimeConfig: {
    HOTPEPPER_API_KEY,
  },
};
