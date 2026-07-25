export const CULTURAL_FEATURES = [
  { key: 'mandap_allowed', label: 'Mandap allowed' },
  { key: 'fire_ceremony', label: 'Fire ceremony' },
  { key: 'vegetarian_kitchen', label: 'Veg kitchen' },
  { key: 'outside_catering', label: 'Outside catering' },
  { key: 'baraat_friendly', label: 'Baraat friendly' },
  { key: 'separate_bridal_room', label: 'Separate bridal room' },
  { key: 'multi_day_events', label: 'Multi-day events' },
  { key: 'late_night_events', label: 'Late night events' },
  { key: 'dj_allowed', label: 'DJ allowed' },
  { key: 'alcohol_allowed', label: 'Alcohol allowed' },
]

export const FEATURE_LABELS = Object.fromEntries(
  CULTURAL_FEATURES.map(({ key, label }) => [key, label])
)
