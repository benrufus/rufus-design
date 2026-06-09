import { workSchema } from './work'
import { postSchema } from './post'
import { testimonialSchema } from './testimonial'
import { siteSettingsSchema } from './siteSettings'
import { pageSchema } from './page'
import { seoSettingsSchema } from './seoSettings'
import { redirectSchema } from './redirect'
import { homePageSchema } from './homePage'
import { aboutPageSchema } from './aboutPage'
import { logoStripSchema } from './logoStrip'
import { locationSchema } from './location'

export const schemaTypes = [
  homePageSchema, aboutPageSchema, pageSchema,
  workSchema, postSchema, testimonialSchema, logoStripSchema, locationSchema,
  siteSettingsSchema, seoSettingsSchema, redirectSchema,
]
