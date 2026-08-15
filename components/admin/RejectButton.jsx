'use client'

export function RejectButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm('Delete this venue submission permanently?')) e.preventDefault()
      }}
      className="rounded-sm border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Reject &amp; delete
    </button>
  )
}
