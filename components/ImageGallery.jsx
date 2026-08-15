'use client'

import { useState } from 'react'

export function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="bg-motif flex h-64 items-center justify-center overflow-hidden sm:h-80">
        <span className="font-display text-4xl text-plum/20">✦</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex h-64 items-center justify-center overflow-hidden bg-plum-pale sm:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active].url} alt={name} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-6 py-3">
          {images.map((img, i) => (
            <button
              key={img.id ?? img.url}
              onClick={() => setActive(i)}
              className={`h-16 w-24 flex-none overflow-hidden rounded-sm border transition ${
                i === active ? 'border-plum' : 'border-cream-border opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
