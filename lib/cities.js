export function citySlug(city) {
  return city.toLowerCase().trim().replace(/\s+/g, '-')
}

export function slugToCityFilter(slug) {
  return slug.replace(/-/g, ' ')
}
