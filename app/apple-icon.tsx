import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), 'app/icon.svg'), 'utf8')
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

  return new ImageResponse(
    (
      <img src={dataUri} width={size.width} height={size.height} alt="" />
    ),
    { ...size }
  )
}
