import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site Title', type: 'string' }),
    defineField({ name: 'description', title: 'Default Meta Description', type: 'text', rows: 3 }),
    defineField({ name: 'keywords', title: 'Default Keywords', type: 'string' }),
    defineField({ name: 'ogImage', title: 'Default OG Image', type: 'image' }),
    defineField({ name: 'googleRating', title: 'Google Rating', type: 'number', initialValue: 4.9 }),
    defineField({ name: 'googleReviewCount', title: 'Google Review Count', type: 'number' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', initialValue: '01442 967775' }),
    defineField({ name: 'email', title: 'Email', type: 'string', initialValue: 'hello@rufusdesign.co.uk' }),
    defineField({ name: 'address', title: 'Address', type: 'string', initialValue: 'Friars Field, Berkhamsted, Hertfordshire' }),
  ],
})
