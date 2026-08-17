'use client'

export function ConfirmButton({ confirmText, className, children }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault()
      }}
      className={className}
    >
      {children}
    </button>
  )
}
