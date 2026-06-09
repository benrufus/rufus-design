import { defineType, defineField } from 'sanity'

export const postSchema = defineType({
  name: 'post',
  title: 'News / Blog Posts',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, description: 'Short summary shown in listings and social sharing.' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true }, description: 'Main article image. 1400×700px recommended.' }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['Web Design', 'SEO', 'PPC', 'Digital Marketing', 'Hosting', 'News', 'Case Study'] } }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              { name: 'link', type: 'object', title: 'Link', fields: [
                { name: 'href', type: 'url', title: 'URL' },
                { name: 'blank', type: 'boolean', title: 'Open in new tab' },
              ]},
            ],
          },
        },
        // Inline images with caption
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'fullWidth', title: 'Full width', type: 'boolean', initialValue: false },
          ],
        },
        // Callout / highlight box
        {
          type: 'object', name: 'callout', title: 'Callout Box',
          fields: [
            { name: 'text', title: 'Text', type: 'text', rows: 3 },
            { name: 'type', title: 'Type', type: 'string', options: { list: ['info', 'tip', 'warning'] }, initialValue: 'tip' },
          ],
          preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: '💡 Callout: ' + title }) }
        },
      ]
    }),
    defineField({ name: 'author', title: 'Author', type: 'string', initialValue: 'Rufus Design' }),
    defineField({ name: 'authorPhoto', title: 'Author Photo', type: 'image' }),
    defineField({ name: 'seo', title: 'SEO', type: 'object', fields: [
      { name: 'metaTitle', title: 'Meta Title', type: 'string', description: 'Defaults to post title. Keep under 60 chars.' },
      { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2, description: 'Keep under 160 chars.' },
      { name: 'ogImage', title: 'Social Share Image', type: 'image', description: 'Defaults to cover image. 1200×630px.' },
    ]}),
  ],
  preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'coverImage' } }
})
