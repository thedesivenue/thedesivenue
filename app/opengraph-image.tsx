import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
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
        <div
          style={{
            display: 'flex',
            color: '#a9812f',
            fontSize: 22,
            letterSpacing: 6,
            borderTop: '1px solid #a9812f',
            borderBottom: '1px solid #a9812f',
            padding: '10px 0',
          }}
        >
          NEW JERSEY&apos;S INDIAN VENUE PLATFORM
        </div>
        <div style={{ display: 'flex', color: '#f4ecd8', fontSize: 80, fontWeight: 700, letterSpacing: -1, marginTop: 32 }}>
          The Desi Venue
        </div>
      </div>
    ),
    { ...size }
  )
}
