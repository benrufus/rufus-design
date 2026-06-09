import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'rufus-design',
  title: 'Rufus Design CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Rufus Design CMS').items([
          S.listItem().title('🏠 Home Page').schemaType('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
          S.listItem().title('👋 About Page').schemaType('aboutPage').child(S.document().schemaType('aboutPage').documentId('aboutPage')),
          S.listItem().title('📄 Extra Pages').schemaType('page').child(S.documentTypeList('page').title('Extra Pages')),
          S.divider(),
          S.listItem().title('💼 Work / Case Studies').schemaType('work').child(S.documentTypeList('work').title('Work')),
          S.listItem().title('📰 News / Blog Posts').schemaType('post').child(S.documentTypeList('post').title('Posts')),
          S.listItem().title('⭐ Testimonials').schemaType('testimonial').child(S.documentTypeList('testimonial').title('Testimonials')),
          S.listItem().title('🏷 Logo Strips').schemaType('logoStrip').child(S.documentTypeList('logoStrip').title('Logo Strips')),
          S.listItem().title('📍 Where We Operate').schemaType('location').child(S.documentTypeList('location').title('Locations')),
          S.divider(),
          S.listItem().title('⚙️ Site Settings').schemaType('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          S.listItem().title('🔍 SEO & Integrations').schemaType('seoSettings').child(S.document().schemaType('seoSettings').documentId('seoSettings')),
          S.listItem().title('↪️ Redirects').schemaType('redirect').child(S.documentTypeList('redirect').title('Redirects')),
        ])
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
