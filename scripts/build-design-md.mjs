// Regenerates the token section of DESIGN.md from /tokens, leaving the
// hand-written rationale alone. CI fails if DESIGN.md is out of date.
//
// Usage: npm run design-md:build
import { readFileSync, writeFileSync } from 'node:fs';

const read = p => JSON.parse(readFileSync(p, 'utf8'));
const prims = {};
for (const f of ['color', 'space', 'radius']) {
  (function walk(t, path) {
    for (const [k, v] of Object.entries(t)) {
      if (k.startsWith('$')) continue;
      if (v && '$value' in v) prims[[...path, k].join('.')] = v.$type === 'color' ? v.$value.hex : `${v.$value.value}px`;
      else if (v && typeof v === 'object') walk(v, [...path, k]);
    }
  })(read(`tokens/primitives/${f}.tokens.json`), []);
}

function semantic(mode) {
  const out = [];
  (function walk(t, path) {
    for (const [k, v] of Object.entries(t)) {
      if (k.startsWith('$')) continue;
      if (v && '$value' in v) {
        const ref = v.$value.slice(1, -1);
        out.push({ name: [...path, k].join('.'), css: v.$extensions['com.figma'].codeSyntax.WEB, value: prims[ref], ref, desc: v.$description ?? '' });
      } else if (v && typeof v === 'object') walk(v, [...path, k]);
    }
  })(read(`tokens/semantic/${mode}.tokens.json`), []);
  return out;
}

const light = semantic('light');
const dark = Object.fromEntries(semantic('dark').map(t => [t.name, t]));
const typo = read('tokens/primitives/typography.tokens.json').font;

// YAML front matter (machine-readable tokens, per the DESIGN.md format)
const yaml = [
  'colors:',
  ...light.filter(t => t.name.startsWith('color.')).map(t => `  ${t.name.slice(6).replace(/\./g, '-')}: { light: "${t.value}", dark: "${dark[t.name].value}" }`),
  'spacing:',
  ...light.filter(t => t.name.startsWith('space.')).map(t => `  ${t.name.slice(6)}: ${t.value}`),
  'radius:',
  ...light.filter(t => t.name.startsWith('radius.')).map(t => `  ${t.name.slice(7)}: ${t.value}`),
  'typography:',
  ...Object.entries(typo).map(([k, v]) => `  ${k}: { family: "${v.family.$value[0]}", weight: ${v.weight.$value}, size: ${v.size.$value.value}px, line-height: ${v['line-height'].$value.value}px }`),
].join('\n');

// Readable table for people and agents
const table = [
  '| Token (CSS) | Light | Dark | Use for |',
  '|---|---|---|---|',
  ...light.map(t => `| \`${t.css}\` | ${t.value} | ${dark[t.name].value} | ${t.desc} |`),
].join('\n');

const START = '<!-- tokens:start — generated from /tokens by scripts/build-design-md.mjs. Do not edit by hand. -->';
const END = '<!-- tokens:end -->';
const md = readFileSync('DESIGN.md', 'utf8');
const front = `---\n${START}\n${yaml}\n${END}\n---`;
let next = md.replace(/^---[\s\S]*?\n---/, front);
next = next.replace(/<!-- table:start -->[\s\S]*<!-- table:end -->/, `<!-- table:start -->\n${table}\n<!-- table:end -->`);
writeFileSync('DESIGN.md', next);
console.log(`DESIGN.md updated: ${light.length} semantic tokens, ${Object.keys(typo).length} text styles`);
