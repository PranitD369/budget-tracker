// Generates public/icons/icon-192.png and icon-512.png
// Run once with: node scripts/generate-icons.js
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const crcTable = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
  crcTable[i] = c
}
function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.allocUnsafe(4)
  len.writeUInt32BE(data.length)
  const c = Buffer.allocUnsafe(4)
  c.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, c])
}

function createPNG(size, drawFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 6  // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.allocUnsafe(1 + size * 4)
    row[0] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = drawFn(x, y, size)
      row[1 + x * 4] = r
      row[2 + x * 4] = g
      row[3 + x * 4] = b
      row[4 + x * 4] = a
    }
    rows.push(row)
  }
  const raw = Buffer.concat(rows)
  const idat = deflateSync(raw)

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// Draws a rounded-rect indigo background with a white $ sign
function drawIcon(x, y, size) {
  const cx = size / 2, cy = size / 2
  const radius = size * 0.22
  const dx = Math.abs(x - cx), dy = Math.abs(y - cy)
  const half = size / 2 - size * 0.05

  // Rounded rectangle mask
  const inRect = dx <= half - radius && dy <= half ||
                 dy <= half - radius && dx <= half ||
                 Math.hypot(dx - (half - radius), dy - (half - radius)) <= radius

  if (!inRect) return [0, 0, 0, 0]  // transparent outside

  // $ symbol (simple vertical bar + two horizontal strokes)
  const rel = (v, total) => v / total
  const nx = rel(x, size), ny = rel(y, size)
  const dollar =
    (nx > 0.44 && nx < 0.56) ||  // vertical bar
    (ny > 0.28 && ny < 0.36 && nx > 0.34 && nx < 0.62) ||  // top stroke
    (ny > 0.62 && ny < 0.70 && nx > 0.38 && nx < 0.66) ||  // bottom stroke
    (ny > 0.17 && ny < 0.25 && nx > 0.46 && nx < 0.54) ||  // top stem
    (ny > 0.75 && ny < 0.83 && nx > 0.46 && nx < 0.54)     // bottom stem

  return dollar ? [255, 255, 255, 255] : [99, 102, 241, 255]  // white on indigo
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', createPNG(192, drawIcon))
writeFileSync('public/icons/icon-512.png', createPNG(512, drawIcon))
writeFileSync('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#6366f1"/>
  <text x="50" y="68" font-size="56" text-anchor="middle" fill="white" font-family="system-ui">$</text>
</svg>`)
console.log('✓ public/icons/icon-192.png')
console.log('✓ public/icons/icon-512.png')
console.log('✓ public/favicon.svg')
