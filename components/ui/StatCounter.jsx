'use client'

import { useEffect, useRef, useState } from 'react'

export function StatCounter({ value, suffix = '', duration = 1200 }) {
  const ref = useRef(null)
  // Starts at 0 on both server and client to avoid a hydration mismatch —
  // matchMedia isn't available during SSR, so reduced-motion can only be
  // resolved after mount.
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resolving a client-only media query post-mount, not a render-derived update
      setCount(value)
      return
    }

    let frame
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * value))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}
