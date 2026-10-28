// DTCG token files in /tokens  →  snapshot for pushing back to Figma
//
// The reverse direction: when a token is changed in code (and merged),
// this builds sync/to-figma.json, which the agent passes to
// sync/import-to-figma.figma.js to update Figma variables.
//
// Usage: node sync/tokens-to-snapshot.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const read = rel => JSON.parse(readFileSync(root + rel, 'utf8'));

function walk(tree, path = [], out = []) {
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push([[...path, k].join('/'), v]);
    else if (v && typeof v === 'object') walk(v, [...path, k], out);
  }
  return out;
}
const ref = s => '{' + s.slice(1, -1).replace(/\./g, '/') + '}';

const primitives = [];
for (const fam of ['color', 'space', 'radius']) {
  for (const [name, t] of walk(read(`tokens/primitives/${fam}.tokens.json`))) {
    primitives.push([name, t.$type === 'color' ? t.$value.hex : t.$value.value]);
  }
}
const light = Object.fromEntries(walk(read('tokens/semantic/light.tokens.json')));
const dark = Object.fromEntries(walk(read('tokens/semantic/dark.tokens.json')));
const semantic = Object.entries(light).map(([name, t]) => [
  name, t.$type === 'color' ? 'COLOR' : 'FLOAT', ref(t.$value), ref(dark[name].$value),
  (t.$extensions?.['com.figma']?.scopes ?? []).join('|'), t.$description ?? '',
]);

writeFileSync(root + 'sync/to-figma.json', JSON.stringify({ primitives, semantic }) + '\n');
console.log(`Wrote sync/to-figma.json: ${primitives.length} primitives, ${semantic.length} semantic tokens`);
