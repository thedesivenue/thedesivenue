import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const svg = await readFile(join(process.cwd(), 'app/icon.svg'), 'utf8')
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2a1245',
        }}
      >
        <img src={dataUri} width={90} height={90} alt="" style={{ borderRadius: 12 }} />

        <div style={{ display: 'flex', color: '#f4ecd8', fontSize: 76, fontWeight: 700, letterSpacing: -1, marginTop: 26 }}>
          The Desi Venue
        </div>
        <div
          style={{
            display: 'flex',
            color: '#a9812f',
            fontSize: 22,
            letterSpacing: 6,
            marginTop: 22,
          }}
        >
          NEW JERSEY&apos;S INDIAN VENUE PLATFORM
        </div>
      </div>
    ),
    { ...size }
  )
}
