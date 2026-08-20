const VARIANTS = [
  'bg-gradient-to-br from-plum-pale to-cream',
  'bg-gradient-to-br from-gold-pale to-cream',
  'bg-gradient-to-tr from-plum-pale to-cream',
  'bg-gradient-to-br from-plum-pale to-gold-pale',
]

// Deterministic per-venue variant so the same venue always looks the same,
// but a grid of many venues doesn't read as one repeated tile.
export function placeholderVariant(id = '') {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return VARIANTS[hash % VARIANTS.length]
}
