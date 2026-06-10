import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fjdyhfutrbjlonekigfh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    staleTimes: { dynamic: 0, static: 0 },
  },
  async rewrites() {
    return [
      {
        source: '/sites/:path*',
        destination: 'https://fjdyhfutrbjlonekigfh.supabase.co/storage/v1/object/public/marketing-assets/sites/:path*',
      },
    ]
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://calendly.com https://consent.cookiefirst.com https://analytics.rufusdesign.co.uk",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://fjdyhfutrbjlonekigfh.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://consent.cookiefirst.com",
            "media-src 'self' https://fjdyhfutrbjlonekigfh.supabase.co",
            "connect-src 'self' https://fjdyhfutrbjlonekigfh.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://api.brevo.com https://www.google.com/recaptcha/ https://consent.cookiefirst.com https://analytics.rufusdesign.co.uk",
            "frame-src https://www.google.com/recaptcha/ https://calendly.com https://www.googletagmanager.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
      ],
    },
  ],
}

export default nextConfig
