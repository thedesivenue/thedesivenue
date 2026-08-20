'use client'

import { useState } from 'react'
import Image from 'next/image'

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
      <div className="relative h-64 overflow-hidden bg-plum-pale sm:h-96">
        <Image src={images[active].url} alt={name} fill sizes="100vw" priority className="object-cover" />
      </div>

      {images.length > 1 && (
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-6 py-3">
          {images.map((img, i) => (
            <button
              key={img.id ?? img.url}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 flex-none overflow-hidden rounded-sm border transition ${
                i === active ? 'border-plum' : 'border-cream-border opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
