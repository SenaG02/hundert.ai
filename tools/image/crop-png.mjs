#!/usr/bin/env node
/**
 * crop-png.mjs - recorte real em pixels de um PNG 8-bit nao-interlaced.
 *
 * Dependency-free (node:fs, node:zlib), no mesmo espirito dos scripts/ do
 * harness: decodifica os filtros de linha do PNG, corta o retangulo pedido
 * do buffer de pixels, e reescreve um PNG valido do zero - IHDR, IDAT
 * (deflate nivel 9), IEND, com CRC32 real por chunk (varios leitores
 * rejeitam ou avisam em chunk com CRC incorreto).
 *
 * Usado para remover grafismo embutido de uma foto (nome, fundo, moldura)
 * quando so a peca pronta esta disponivel e um retrato limpo nao. Ver
 * assets/founders/README.md para o caso de uso e o comando exato aplicado.
 *
 *   node tools/image/crop-png.mjs entrada.png saida.png x y largura altura
 */
import fs from 'node:fs';
import zlib from 'node:zlib';

function decodePng(buf) {
  let p = 8, ihdr = null, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') ihdr = { width: data.readUInt32BE(0), height: data.readUInt32BE(4), bitDepth: data[8], colorType: data[9] };
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (ihdr.bitDepth !== 8) throw new Error('so 8-bit suportado');
  const CH = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const { width: W, height: H } = ihdr, bpp = CH, stride = W * bpp;
  const out = Buffer.alloc(H * stride);
  let prev = Buffer.alloc(stride);
  for (let y = 0, off = 0; y < H; y++) {
    const filter = raw[off++];
    const line = raw.subarray(off, off + stride); off += stride;
    const cur = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0, x = line[i];
      let v;
      switch (filter) {
        case 0: v = x; break;
        case 1: v = x + a; break;
        case 2: v = x + b; break;
        case 3: v = x + ((a + b) >> 1); break;
        case 4: { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
                  v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); break; }
        default: throw new Error('filtro invalido');
      }
      cur[i] = v & 0xff;
    }
    cur.copy(out, y * stride); prev = cur;
  }
  // normaliza para RGBA
  const rgba = new Uint8Array(W * H * 4);
  for (let i = 0, n = W * H; i < n; i++) {
    const s = i * CH, d = i * 4;
    if (CH === 4) { rgba[d]=out[s]; rgba[d+1]=out[s+1]; rgba[d+2]=out[s+2]; rgba[d+3]=out[s+3]; }
    else if (CH === 3) { rgba[d]=out[s]; rgba[d+1]=out[s+1]; rgba[d+2]=out[s+2]; rgba[d+3]=255; }
    else if (CH === 1) { rgba[d]=rgba[d+1]=rgba[d+2]=out[s]; rgba[d+3]=255; }
  }
  return { width: W, height: H, rgba };
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGBA, sem interlace
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filtro None
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

const [, , srcPath, outPath, xs, ys, ws, hs] = process.argv;
const { width: W, height: H, rgba } = decodePng(fs.readFileSync(srcPath));
const x = parseInt(xs, 10), y = parseInt(ys, 10), w = parseInt(ws, 10), h = parseInt(hs, 10);
if (x < 0 || y < 0 || x + w > W || y + h > H) throw new Error(`corte fora dos limites: fonte ${W}x${H}, pedido ${x},${y} ${w}x${h}`);
const out = new Uint8Array(w * h * 4);
for (let row = 0; row < h; row++) {
  const srcOff = ((y + row) * W + x) * 4;
  const dstOff = row * w * 4;
  out.set(rgba.subarray(srcOff, srcOff + w * 4), dstOff);
}
fs.writeFileSync(outPath, encodePng(w, h, out));
console.log(`recortado: ${W}x${H} -> ${w}x${h} a partir de (${x},${y}), proporcao ${(w/h).toFixed(3)}`);
