export function Pill({ children, active = false, as: Tag = 'span', ...props }) {
  return (
    <Tag
      className={
        active
          ? 'inline-flex items-center rounded-full border border-plum bg-plum px-3.5 py-1.5 text-[13px] text-gold-light'
          : 'inline-flex items-center rounded-full border border-gold-border bg-gold-pale px-3.5 py-1.5 text-[13px] text-gold-ink'
      }
      {...props}
    >
      {children}
    </Tag>
  )
}
