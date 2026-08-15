export function StarRating({ value, size = 'text-sm' }) {
  return (
    <span className={`inline-flex ${size} leading-none text-gold`} aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden className={n <= Math.round(value) ? '' : 'text-cream-border'}>★</span>
      ))}
    </span>
  )
}
