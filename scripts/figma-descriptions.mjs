// FIGMA DESCRIPTIONS, GENERATED FROM CODE.
//
// Code leads for components, so each Figma component's description is built from the code:
// the component's JSDoc, its props (allowed values, defaults, JSDoc) and its Storybook page.
// Written once, in code. Never edit a description in Figma by hand: edit the JSDoc instead.
//
// Used by scripts/parity.mjs (to check Figma's descriptions are current) and by
// `npm run figma:descriptions`, which writes sync/figma-descriptions.json for
// sync/apply-descriptions.figma.js to paste into Figma.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url).pathname;

const unquote = v => (v == null ? undefined : String(v).replace(/^['"]|['"]$/g, ''));
const plain = s => (s ?? '').replace(/`/g, '').trim();
const indent = s => s.split('\n').map(l => '    ' + l.trim()).join('\n');

export function describe(comp, cfg) {
  const name = comp.name;
  const lines = [`import { ${name} } from '@acme/ui'`, '', plain(comp.description), '', 'Props'];
  for (const [prop, def] of Object.entries(comp.reactDocgen?.props ?? {})) {
    if (cfg.codeOnlyProps[prop]) continue;
    const t = def.tsType;
    const values = t?.name === 'union' ? t.elements.map(e => unquote(e.value)).join(' | ') : t?.name === 'boolean' ? 'true | false' : null;
    const dflt = unquote(def.defaultValue?.value);
    const label = prop === 'children' ? `children → "${cfg.children[name]}"` : prop;
    let head = `• ${label}${def.required ? '' : '?'}`;
    if (values) head += `: ${values}`;
    if (dflt !== undefined) head += ` (default ${dflt})`;
    lines.push(head);
    if (def.description) lines.push(indent(plain(def.description)));
  }
  const storyFile = root + comp.path.replace(/^\.\//, '');
  const title = existsSync(storyFile) ? readFileSync(storyFile, 'utf8').match(/title:\s*'([^']+)'/)?.[1] : null;
  if (title) lines.push('', `Storybook: ${title}`);
  lines.push('', 'Generated from code. Edit the JSDoc in the component, not this text.');
  return lines.join('\n');
}

export function describeAll(manifest, cfg) {
  const out = {};
  for (const comp of Object.values(manifest.components)) {
    if (cfg.codeOnlyComponents[comp.name]) continue;
    out[comp.name] = describe(comp, cfg);
  }
  return out;
}

// CLI: npm run figma:descriptions [-- path/to/components.json]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifestPath = process.argv[2] ?? root + 'storybook-static/manifests/components.json';
  if (!existsSync(manifestPath)) { console.error('Run `npm run build-storybook` first.'); process.exit(2); }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const cfg = JSON.parse(readFileSync(root + 'sync/parity.config.json', 'utf8'));
  const out = describeAll(manifest, cfg);
  writeFileSync(root + 'sync/figma-descriptions.json', JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote descriptions for ${Object.keys(out).join(', ')} to sync/figma-descriptions.json`);
}
