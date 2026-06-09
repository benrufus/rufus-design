import { defineType, defineField } from 'sanity'

export const aboutPageSchema = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Main Heading', type: 'string', initialValue: "We're Rufus." }),
    defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text', rows: 3 }),
    defineField({
      name: 'stats', title: 'Stats', type: 'array',
      of: [{ type: 'object', name: 'stat', fields: [
        { name: 'value', title: 'Value', type: 'string' },
        { name: 'label', title: 'Label', type: 'string' },
      ]}]
    }),
    defineField({
      name: 'values', title: 'Values', type: 'array',
      of: [{ type: 'object', name: 'value', fields: [
        { name: 'number', title: 'Number', type: 'string' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
      ]}]
    }),
    defineField({
      name: 'team', title: 'Team Members', type: 'array',
      of: [{ type: 'object', name: 'member', fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'role', title: 'Role', type: 'string' },
        { name: 'bio', title: 'Bio', type: 'text', rows: 3 },
        { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
      ]}]
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'object', fields: [
      { name: 'metaTitle', type: 'string' },
      { name: 'metaDescription', type: 'text', rows: 2 },
      { name: 'ogImage', type: 'image' },
    ]}),
  ],
})
