const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  )
}

export function ScaleIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18M8 21h8M6 7h12M6 7l-3 6a3 3 0 0 0 6 0L6 7ZM18 7l-3 6a3 3 0 0 0 6 0l-3-6Z" />
    </svg>
  )
}

export function MessageIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v11H8.5L4 19.5V5Z" />
    </svg>
  )
}

export function FilterIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16M7 12h10M10.5 19h3" />
    </svg>
  )
}

export function TagIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M11.5 4H5a1 1 0 0 0-1 1v6.5a1 1 0 0 0 .3.7l9 9a1 1 0 0 0 1.4 0l6.5-6.5a1 1 0 0 0 0-1.4l-9-9a1 1 0 0 0-.7-.3Z" />
      <circle cx="8.5" cy="8.5" r="1.25" />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16v12H4V6Z" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
  )
}
