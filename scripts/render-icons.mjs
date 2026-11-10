#!/usr/bin/env node
// WSZ-004a (D-19): the site icon is public/icon.svg; the manifest PNGs and favicon.ico derive from it. Renders
// public/icons/icon-192.png and icon-512.png with next/og (part of next, no other dependency) and writes
// src/app/favicon.ico (served at /favicon.ico) holding three PNG images: public/favicon-16x16.png,
// public/favicon-32x32.png and a 48 px render, in an ICO container written with Node built-ins.
// Run after changing public/icon.svg: node scripts/render-icons.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { repoRoot, rel } from './lib/build-output.mjs';

const require = createRequire(join(repoRoot, 'package.json'));
const { ImageResponse } = require('next/og');
const { createElement } = require('react');

const svg = readFileSync(join(repoRoot, 'public', 'icon.svg'));
const src = `data:image/svg+xml;base64,${svg.toString('base64')}`;

async function render(size) {
  const response = new ImageResponse(createElement('img', { src, width: size, height: size }), { width: size, height: size });
  return Buffer.from(await response.arrayBuffer());
}

/** Width and height from a PNG's IHDR chunk. */
function pngSize(png) {
  if (png.readUInt32BE(0) !== 0x89504e47 || png.toString('latin1', 12, 16) !== 'IHDR') throw new Error('not a PNG');
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

/** An ICO file holding the given PNG images (PNG-compressed entries, Windows Vista and later, every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1: icon
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach((png, i) => {
    const { width, height } = pngSize(png);
    if (width > 256 || height > 256) throw new Error(`ICO images are at most 256 px, got ${width}×${height}`);
    const entry = 6 + 16 * i;
    header.writeUInt8(width === 256 ? 0 : width, entry);
    header.writeUInt8(height === 256 ? 0 : height, entry + 1);
    header.writeUInt8(0, entry + 2); // no palette
    header.writeUInt8(0, entry + 3); // reserved
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...pngs]);
}

mkdirSync(join(repoRoot, 'public', 'icons'), { recursive: true });
for (const size of [192, 512]) {
  const file = join(repoRoot, 'public', 'icons', `icon-${size}.png`);
  writeFileSync(file, await render(size));
  console.log(`${rel(file)}: ${size}×${size}`);
}
const pngs = [
  readFileSync(join(repoRoot, 'public', 'favicon-16x16.png')),
  readFileSync(join(repoRoot, 'public', 'favicon-32x32.png')),
  await render(48),
];
const favicon = join(repoRoot, 'src', 'app', 'favicon.ico');
writeFileSync(favicon, ico(pngs));
console.log(`${rel(favicon)}: ${pngs.map((p) => `${pngSize(p).width} px`).join(', ')}`);
