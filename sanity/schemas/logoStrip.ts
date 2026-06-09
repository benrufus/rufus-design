import { defineType, defineField } from 'sanity'

export const logoStripSchema = defineType({
  name: 'logoStrip',
  title: 'Logo Strips',
  type: 'document',
  fields: [
    defineField({ name: 'stripName', title: 'Strip Name (internal)', type: 'string', description: 'e.g. "Clients" or "Partners"', validation: r => r.required() }),
    defineField({ name: 'label', title: 'Label above strip', type: 'string', description: 'e.g. "Trusted by" or "Our partners"' }),
    defineField({ name: 'active', title: 'Show on site', type: 'boolean', initialValue: true }),
    defineField({ name: 'speed', title: 'Scroll speed (seconds)', type: 'number', initialValue: 30, description: 'Higher = slower' }),
    defineField({
      name: 'logos', title: 'Logos', type: 'array',
      of: [{ type: 'object', name: 'logo', fields: [
        { name: 'name', title: 'Company Name', type: 'string' },
        { name: 'logo', title: 'Logo Image', type: 'image', options: { hotspot: true }, description: 'SVG or PNG with transparent background. White version works best on dark background.' },
        { name: 'url', title: 'Link (optional)', type: 'url' },
      ], preview: { select: { title: 'name', media: 'logo' } }}],
    }),
  ],
  preview: { select: { title: 'stripName', subtitle: 'label' } }
})
