import { defineType, defineField } from 'sanity'

export const workSchema = defineType({
  name: 'work',
  title: 'Work / Case Studies',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Project Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'client', title: 'Client Name', type: 'string' }),
    defineField({ name: 'year', title: 'Year', type: 'number' }),
    defineField({ name: 'url', title: 'Live URL', type: 'url' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
    defineField({
      name: 'tags', title: 'Services', type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Web Design', 'Web Development', 'SEO', 'PPC', 'Managed Hosting', 'Branding', 'Data Analytics', 'Social Media'] }
    }),
    defineField({ name: 'excerpt', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body', title: 'Case Study Body', type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ]
    }),
    defineField({
      name: 'results', title: 'Key Results', type: 'array',
      of: [defineField({ name: 'result', type: 'object', fields: [
        { name: 'metric', title: 'Metric', type: 'string' },
        { name: 'value', title: 'Value', type: 'string' },
      ]})]
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'coverImage' }
  }
})
