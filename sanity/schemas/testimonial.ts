import { defineType, defineField } from 'sanity'

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'role', title: 'Job Title', type: 'string' }),
    defineField({ name: 'company', title: 'Company', type: 'string' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', initialValue: 5 }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  preview: { select: { title: 'name', subtitle: 'company' } }
})
