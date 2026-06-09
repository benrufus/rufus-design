import { defineType, defineField } from 'sanity'

export const locationSchema = defineType({
  name: 'location',
  title: 'Where We Operate',
  type: 'document',
  fields: [
    defineField({ name: 'town', title: 'Town / Area', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'town' }, validation: r => r.required() }),
    defineField({ name: 'county', title: 'County', type: 'string', initialValue: 'Hertfordshire' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text', rows: 3, description: 'e.g. "Rufus Design provides web design and digital marketing services to businesses in Berkhamsted..."' }),
    defineField({
      name: 'body', title: 'Page Body', type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      description: 'Full page content. Use H2s for sections — they\'ll appear in the table of contents.'
    }),
    defineField({
      name: 'services', title: 'Services offered in this area', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Web Design', 'Web Development', 'SEO', 'PPC', 'Managed Hosting', 'Branding', 'Data Analytics'] }
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
    defineField({ name: 'featured', title: 'Featured on overview page', type: 'boolean', initialValue: true }),
    defineField({ name: 'seo', title: 'SEO', type: 'object', fields: [
      { name: 'metaTitle', title: 'Meta Title', type: 'string' },
      { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
    ]}),
  ],
  preview: { select: { title: 'town', subtitle: 'county', media: 'heroImage' } }
})
