export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/account'],
    },
    sitemap: 'https://www.thedesivenue.com/sitemap.xml',
  }
}
