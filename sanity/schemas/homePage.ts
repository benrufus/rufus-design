import { defineType, defineField } from 'sanity'

export const homePageSchema = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // Hero
    defineField({ name: 'heroWords', title: 'Cycling Words (hero)', type: 'array', of: [{ type: 'string' }], description: 'Words that cycle in the hero headline. Keep short — max 3 words each.' }),
    defineField({ name: 'heroSubtext', title: 'Hero Subtext', type: 'text', rows: 3 }),
    defineField({ name: 'heroCta1Label', title: 'Hero CTA 1 Label', type: 'string', initialValue: "Let's talk" }),
    defineField({ name: 'heroCta2Label', title: 'Hero CTA 2 Label', type: 'string', initialValue: 'Our work' }),

    // Services strip
    defineField({
      name: 'services', title: 'Services', type: 'array',
      of: [{ type: 'object', name: 'service', fields: [
        { name: 'number', title: 'Number', type: 'string' },
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 3 },
      ]}],
      description: 'The 4 service cards on the homepage.'
    }),

    // Services marquee
    defineField({
      name: 'servicesMarquee', title: 'Services Marquee (scrolling strip)', type: 'array',
      of: [{ type: 'string' }],
      description: 'Words that scroll in the services ticker strip.'
    }),

    // About section
    defineField({ name: 'aboutHeading', title: 'About Heading', type: 'string' }),
    defineField({ name: 'aboutBody', title: 'About Body', type: 'text', rows: 4 }),
    defineField({
      name: 'stats', title: 'Stats', type: 'array',
      of: [{ type: 'object', name: 'stat', fields: [
        { name: 'value', title: 'Value (e.g. 18+)', type: 'string' },
        { name: 'label', title: 'Label', type: 'string' },
      ]}]
    }),
    defineField({ name: 'aboutQuote', title: 'About Quote', type: 'string' }),

    // SEO
    defineField({ name: 'seo', title: 'SEO', type: 'object', fields: [
      { name: 'metaTitle', title: 'Meta Title', type: 'string' },
      { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
      { name: 'ogImage', title: 'OG Image', type: 'image' },
    ]}),
  ],
})
