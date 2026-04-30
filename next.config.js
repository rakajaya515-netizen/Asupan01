/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              img-src 'self' data: https:;
              media-src 'self' https:;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
              style-src 'self' 'unsafe-inline' https:;
              connect-src 'self' https:;
              frame-src *;
            `.replace(/\n/g, "")
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
