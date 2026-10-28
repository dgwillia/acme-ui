// Verifies a Figma snapshot arrived intact: computes the same djb2 checksum
// the Figma-side export script computes over JSON.stringify(snapshot).
// Usage: node sync/checksum.mjs [path]   (default: sync/figma-snapshot.json)
import { readFileSync } from 'node:fs';

export function checksum(obj) {
  const s = JSON.stringify(obj);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return { checksum: h, length: s.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2] ?? new URL('./figma-snapshot.json', import.meta.url).pathname;
  console.log(checksum(JSON.parse(readFileSync(path, 'utf8'))));
}
