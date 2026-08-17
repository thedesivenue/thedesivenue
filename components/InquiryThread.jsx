'use client'

import { useActionState, useEffect, useRef } from 'react'

export function InquiryThread({ inquiryId, messages, replyAction }) {
  const [state, formAction, pending] = useActionState(replyAction, undefined)
  const formRef = useRef(null)

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state])

  return (
    <div className="mt-3">
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromOwner ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-sm px-3.5 py-2.5 text-[14px] leading-relaxed ${
              m.fromOwner ? 'bg-plum text-gold-light' : 'bg-cream text-ink'
            }`}>
              <p>{m.body}</p>
              <p className={`mt-1 text-[10px] uppercase tracking-wide ${m.fromOwner ? 'text-gold-light/60' : 'text-muted'}`}>
                {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form ref={formRef} action={formAction} className="mt-3 flex gap-2">
        <input type="hidden" name="inquiry_id" value={inquiryId} />
        <input
          name="body"
          placeholder="Write a reply..."
          required
          className="flex-1 rounded-sm border border-cream-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-plum"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-gold-light hover:bg-ink disabled:opacity-60"
        >
          {pending ? '…' : 'Send'}
        </button>
      </form>
      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
    </div>
  )
}
