import { defineType, defineField } from 'sanity'

// Redirects managed from the CMS — synced to vercel.json or Next.js config
export const redirectSchema = defineType({
  name: 'redirect',
  title: 'Redirects',
  type: 'document',
  fields: [
    defineField({ name: 'from', title: 'From Path', type: 'string', description: 'e.g. /old-page', validation: r => r.required() }),
    defineField({ name: 'to', title: 'To Path or URL', type: 'string', description: 'e.g. /new-page or https://external.com', validation: r => r.required() }),
    defineField({ name: 'permanent', title: 'Permanent (301)', type: 'boolean', initialValue: true, description: 'Use 301 for SEO-safe permanent redirects. Use 302 for temporary.' }),
  ],
  preview: { select: { title: 'from', subtitle: 'to' } }
})
