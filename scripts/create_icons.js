import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// CRC32 table & function
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPNG(width, height, pixelFn) {
  const bytesPerPixel = 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),
    Buffer.from('IHDR'),
    ihdr,
    Buffer.alloc(4)
  ]);
  ihdrChunk.writeUInt32BE(crc32(Buffer.concat([Buffer.from('IHDR'), ihdr])), 17);

  // IDAT Chunk
  const idatChunk = Buffer.alloc(4 + 4 + deflated.length + 4);
  idatChunk.writeUInt32BE(deflated.length, 0);
  idatChunk.write('IDAT', 4);
  deflated.copy(idatChunk, 8);
  idatChunk.writeUInt32BE(crc32(Buffer.concat([Buffer.from('IDAT'), deflated])), 8 + deflated.length);

  // IEND Chunk
  const iendChunk = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Pixel generator for ClipTap AI app icon
function renderAppIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxR = w * 0.46;

  // Background gradient: Deep zinc to obsidian
  const gradY = y / h;
  let r = Math.round(10 + 12 * gradY);
  let g = Math.round(10 + 12 * gradY);
  let b = Math.round(14 + 20 * gradY);
  let a = 255;

  // Central glowing disc
  if (dist < maxR * 0.8) {
    const glow = 1 - dist / (maxR * 0.8);
    r = Math.min(255, r + Math.round(glow * 40));
    g = Math.min(255, g + Math.round(glow * 30));
    b = Math.min(255, b + Math.round(glow * 10));
  }

  // Draw 4-point golden sparkle in center
  const sx = Math.abs(dx);
  const sy = Math.abs(dy);
  const scale = (isMaskable ? 0.28 : 0.35) * w;

  // Diamond/star sparkle formula
  if (sx + sy < scale) {
    const intensity = 1 - (sx + sy) / scale;
    r = 251; // Amber-400 (#fbbf24)
    g = 191;
    b = 36;
    if (sx + sy < scale * 0.4) {
      r = 255; // Core white glow
      g = 255;
      b = 255;
    }
  }

  // Accent ring / border
  if (!isMaskable && dist > maxR * 0.95 && dist < maxR) {
    r = 245;
    g = 158;
    b = 11;
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA and Apple Touch icons...');

// 1. Apple Touch Icon (180x180)
const appleIcon = createPNG(180, 180, (x, y, w, h) => renderAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// 2. PWA 192x192
const pwa192 = createPNG(192, 192, (x, y, w, h) => renderAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

// 3. PWA 512x512
const pwa512 = createPNG(512, 512, (x, y, w, h) => renderAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

// 4. PWA Maskable 512x512
const pwaMaskable = createPNG(512, 512, (x, y, w, h) => renderAppIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);

// 5. SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)" stroke="url(#grad)" stroke-width="12" />
  <path d="M256 96 L288 224 L416 256 L288 288 L256 416 L224 288 L96 256 L224 224 Z" fill="#fbbf24" filter="drop-shadow(0 0 16px rgba(251, 191, 36, 0.6))" />
  <circle cx="256" cy="256" r="28" fill="#ffffff" />
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

console.log('Icons generated successfully in public/');
