export function Pill({ children, active = false, as: Tag = 'span', ...props }) {
  return (
    <Tag
      className={
        active
          ? 'inline-flex items-center rounded-sm border border-plum bg-plum px-3.5 py-1.5 text-[11px] uppercase tracking-wide text-gold-light'
          : 'inline-flex items-center rounded-sm border border-cream-border px-3.5 py-1.5 text-[11px] uppercase tracking-wide text-plum-light transition hover:border-plum-light hover:text-plum'
      }
      {...props}
    >
      {children}
    </Tag>
  )
}
