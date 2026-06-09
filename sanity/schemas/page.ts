import { defineType, defineField } from 'sanity'

// Reusable block types for the page builder
const heroBlock = defineField({
  name: 'heroBlock',
  title: 'Hero Section',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'subheading', title: 'Subheading', type: 'text', rows: 2 },
    { name: 'ctaLabel', title: 'CTA Button Label', type: 'string' },
    { name: 'ctaLink', title: 'CTA Button Link', type: 'string' },
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: '🎯 Hero: ' + (title || 'Untitled') }) }
})

const textBlock = defineField({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label (small orange text)', type: 'string' },
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'align', title: 'Alignment', type: 'string', options: { list: ['left', 'center'], layout: 'radio' }, initialValue: 'left' },
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: '📝 Text: ' + (title || 'Untitled') }) }
})

const imageTextBlock = defineField({
  name: 'imageTextBlock',
  title: 'Image + Text',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }] },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'imagePosition', title: 'Image Side', type: 'string', options: { list: ['left', 'right'], layout: 'radio' }, initialValue: 'right' },
    { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
    { name: 'ctaLink', title: 'CTA Link', type: 'string' },
  ],
  preview: { select: { title: 'heading', media: 'image' }, prepare: ({ title, media }) => ({ title: '🖼 Image+Text: ' + (title || 'Untitled'), media }) }
})

const statsBlock = defineField({
  name: 'statsBlock',
  title: 'Stats Row',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Section Heading', type: 'string' },
    {
      name: 'stats', title: 'Stats', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'value', title: 'Value (e.g. 18+)', type: 'string' },
        { name: 'label', title: 'Label', type: 'string' },
      ]}]
    },
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: '📊 Stats: ' + (title || 'Untitled') }) }
})

const gridBlock = defineField({
  name: 'gridBlock',
  title: 'Card Grid',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'heading', title: 'Heading', type: 'string' },
    {
      name: 'cards', title: 'Cards', type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'number', title: 'Number (e.g. 01)', type: 'string' },
        { name: 'title', title: 'Card Title', type: 'string' },
        { name: 'body', title: 'Card Body', type: 'text', rows: 3 },
      ]}]
    },
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: '🃏 Grid: ' + (title || 'Untitled') }) }
})

const ctaBlock = defineField({
  name: 'ctaBlock',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'subtext', title: 'Subtext', type: 'string' },
    { name: 'ctaLabel', title: 'Button Label', type: 'string' },
    { name: 'ctaLink', title: 'Button Link', type: 'string' },
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: '📣 CTA: ' + (title || 'Untitled') }) }
})

const imageBlock = defineField({
  name: 'imageBlock',
  title: 'Full-width Image',
  type: 'object',
  fields: [
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'caption', title: 'Caption', type: 'string' },
  ],
  preview: { select: { media: 'image', title: 'caption' }, prepare: ({ media, title }) => ({ title: '🖼 Image' + (title ? ': ' + title : ''), media }) }
})

export const pageSchema = defineType({
  name: 'page',
  title: 'Pages',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'seo', title: 'SEO', type: 'object', fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string', description: 'Defaults to page title if empty. Keep under 60 chars.' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2, description: 'Keep under 160 chars.' },
        { name: 'ogImage', title: 'Social Share Image', type: 'image', description: '1200×630px recommended.' },
        { name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false },
      ]
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [heroBlock, textBlock, imageTextBlock, statsBlock, gridBlock, ctaBlock, imageBlock],
      description: 'Drag to reorder sections. Click + to add a new section.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } }
})
