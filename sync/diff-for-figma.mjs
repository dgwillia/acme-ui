// Builds a minimal payload for import-to-figma: only the tokens that differ between
// the code (sync/to-figma.json) and Figma's last known state (sync/figma-snapshot.json).
// Also prints the checksum Figma should report after the import, so the round trip
// can be verified exactly.
//
// Usage: npm run tokens:to-figma && node sync/diff-for-figma.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { checksum } from './checksum.mjs';

const root = new URL('..', import.meta.url).pathname;
const code = JSON.parse(readFileSync(root + 'sync/to-figma.json', 'utf8'));
const figma = JSON.parse(readFileSync(root + 'sync/figma-snapshot.json', 'utf8'));

const key = r => JSON.stringify(r);
const figmaRows = new Set([...figma.primitives, ...figma.semantic].map(key));
const primitives = code.primitives.filter(r => !figmaRows.has(key(r)));
const semantic = code.semantic.filter(r => !figmaRows.has(key(r)));

writeFileSync(root + 'sync/to-figma.diff.json', JSON.stringify({ partial: true, primitives, semantic }) + '\n');

// What Figma should look like afterwards (same order Figma exports in)
const expected = {
  fileKey: figma.fileKey,
  primitives: figma.primitives.map(r => code.primitives.find(c => c[0] === r[0]) ?? r),
  semantic: figma.semantic.map(r => code.semantic.find(c => c[0] === r[0]) ?? r),
  textStyles: figma.textStyles,
};
writeFileSync(root + 'sync/expected-figma-snapshot.json', JSON.stringify(expected) + '\n');
console.log(`Changed: ${primitives.length} primitives, ${semantic.length} semantic →`, [...primitives, ...semantic].map(r => r[0]));
console.log('Figma should report after import:', checksum(expected));
