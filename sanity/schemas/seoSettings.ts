import { defineType, defineField } from 'sanity'

// Global SEO + integrations settings — one document, edited in Studio
export const seoSettingsSchema = defineType({
  name: 'seoSettings',
  title: 'SEO & Integrations',
  type: 'document',
  
  fields: [
    // ── Global SEO ──
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', initialValue: 'Rufus Design' }),
    defineField({ name: 'defaultTitle', title: 'Default Meta Title', type: 'string', description: 'Used when a page has no title set.' }),
    defineField({ name: 'titleSeparator', title: 'Title Separator', type: 'string', initialValue: '|', description: 'e.g. "About | Rufus Design"' }),
    defineField({ name: 'defaultDescription', title: 'Default Meta Description', type: 'text', rows: 2 }),
    defineField({ name: 'defaultOgImage', title: 'Default Social Share Image', type: 'image' }),
    defineField({ name: 'canonicalBase', title: 'Canonical Base URL', type: 'string', initialValue: 'https://www.rufusdesign.co.uk' }),

    // ── Google ──
    defineField({ name: 'googleVerification', title: 'Google Search Console Verification Code', type: 'string', description: 'The content= value from the meta tag Google gives you.' }),
    defineField({ name: 'googleAnalyticsId', title: 'Google Analytics 4 Measurement ID', type: 'string', description: 'e.g. G-XXXXXXXXXX' }),
    defineField({ name: 'googleTagManagerId', title: 'Google Tag Manager ID', type: 'string', description: 'e.g. GTM-XXXXXXX — use instead of GA4 if you manage tags via GTM.' }),

    // ── Social ──
    defineField({ name: 'twitterHandle', title: 'Twitter/X Handle', type: 'string', description: '@handle without the @' }),
    defineField({ name: 'facebookAppId', title: 'Facebook App ID', type: 'string' }),

    // ── Schema.org ──
    defineField({ name: 'localBusinessType', title: 'Business Type (Schema.org)', type: 'string', initialValue: 'ProfessionalService' }),
    defineField({ name: 'googleRating', title: 'Google Rating', type: 'number', initialValue: 4.9 }),
    defineField({ name: 'googleReviewCount', title: 'Google Review Count', type: 'number' }),

    // ── Cookies / Scripts ──
    defineField({ name: 'headScripts', title: 'Extra <head> Scripts', type: 'text', rows: 4, description: 'Paste any verification tags or custom scripts (e.g. Hotjar, cookie consent). Added to every page <head>.' }),
    defineField({ name: 'bodyScripts', title: 'Extra <body> Scripts', type: 'text', rows: 4, description: 'Added just before </body>. GTM noscript tag goes here.' }),
  ],
})
