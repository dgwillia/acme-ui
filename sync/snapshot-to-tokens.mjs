// Figma snapshot  →  DTCG token files in /tokens
//
// The snapshot (sync/figma-snapshot.json) is produced inside Figma by
// sync/export-from-figma.figma.js. This script turns it into the
// source-of-truth token files that Style Dictionary builds from.
//
// Usage: node sync/snapshot-to-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const snap = JSON.parse(readFileSync(root + 'sync/figma-snapshot.json', 'utf8'));

const cssName = name => '--' + name.replace(/\//g, '-');
const toPath = name => name.split('/');
const alias = ref => '{' + ref.slice(1, -1).replace(/\//g, '.') + '}'; // "{color/slate/50}" → "{color.slate.50}"

function hexToColor(hex) {
  const c = hex.replace('#', '');
  const comp = [0, 2, 4].map(i => +(parseInt(c.slice(i, i + 2), 16) / 255).toFixed(4));
  return { colorSpace: 'srgb', components: comp, hex: '#' + c.toLowerCase() };
}

function setDeep(tree, path, leaf) {
  let node = tree;
  for (const key of path.slice(0, -1)) node = node[key] ??= {};
  node[path.at(-1)] = leaf;
}

function figmaExt(name, scopes) {
  return { 'com.figma': { scopes, codeSyntax: { WEB: `var(${cssName(name)})` } } };
}

// ---- Primitives: one file per family (any family Figma has: color, space, radius, border-width, ...)
const families = {};
for (const [name, value] of snap.primitives) {
  const family = name.split('/')[0];
  families[family] ??= {};
  const isColor = typeof value === 'string';
  setDeep(families[family], toPath(name), {
    $type: isColor ? 'color' : 'dimension',
    $value: isColor ? hexToColor(value) : { value, unit: 'px' },
    $extensions: figmaExt(name, []),
  });
}

// ---- Semantic: one file per mode
const light = {}, dark = {};
for (const [name, type, l, d, scopes, description] of snap.semantic) {
  for (const [tree, ref] of [[light, l], [dark, d]]) {
    const leaf = { $type: type === 'COLOR' ? 'color' : 'dimension', $value: alias(ref) };
    if (description) leaf.$description = description;
    leaf.$extensions = figmaExt(name, scopes ? scopes.split('|') : []);
    setDeep(tree, toPath(name), leaf);
  }
}

// ---- Typography: from Figma text styles → one token group per style
const weight = { Regular: 400, Medium: 500, 'Semi Bold': 600, Bold: 700 };
const typography = { font: {} };
for (const [name, family, style, size, lineHeight] of snap.textStyles ?? []) {
  const key = name.toLowerCase().replace(/\//g, '-');          // "Label/Small" → "label-small"
  typography.font[key] = {
    family: { $type: 'fontFamily', $value: [family, 'system-ui', 'sans-serif'] },
    weight: { $type: 'fontWeight', $value: weight[style] ?? 400 },
    size: { $type: 'dimension', $value: { value: size, unit: 'px' } },
    'line-height': { $type: 'dimension', $value: { value: lineHeight, unit: 'px' } },
    $description: `Figma text style ${name}`,
  };
}

const write = (rel, obj) => {
  mkdirSync(root + rel.split('/').slice(0, -1).join('/'), { recursive: true });
  writeFileSync(root + rel, JSON.stringify(obj, null, 2) + '\n');
  return rel;
};

const files = [
  ...Object.entries(families).map(([f, tree]) => write(`tokens/primitives/${f}.tokens.json`, tree)),
  write('tokens/primitives/typography.tokens.json', typography),
  write('tokens/semantic/light.tokens.json', light),
  write('tokens/semantic/dark.tokens.json', dark),
];
console.log(`Wrote ${files.length} token files from Figma file ${snap.fileKey}:\n  ` + files.join('\n  '));
