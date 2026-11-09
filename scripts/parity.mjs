// COMPONENT PARITY CHECK. No AI: a plain comparison of two lists.
//
//   Code:  Storybook's component manifest (storybook-static/manifests/components.json,
//          written by `npm run build-storybook`): every prop, its allowed values and default.
//   Figma: sync/figma-components.json (exported by sync/export-components.figma.js via use_figma).
//
// Code leads for components, so every difference is reported as Figma being wrong,
// unless sync/parity.config.json lists it as an expected gap (also in GAPS.md).
//
// Usage: npm run parity [-- path/to/components.json]   Exit code 1 if anything is red.
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const codePath = process.argv[2] ?? root + 'storybook-static/manifests/components.json';
if (!existsSync(codePath)) {
  console.error(`No code manifest at ${codePath}. Run \`npm run build-storybook\` first.`);
  process.exit(2);
}
const code = JSON.parse(readFileSync(codePath, 'utf8')).components;
const figma = JSON.parse(readFileSync(root + 'sync/figma-components.json', 'utf8')).components;
const cfg = JSON.parse(readFileSync(root + 'sync/parity.config.json', 'utf8'));

const unquote = v => (v == null ? undefined : String(v).replace(/^['"]|['"]$/g, ''));
const literals = t => (t?.name === 'union' && t.elements?.every(e => /^['"]/.test(e.value)) ? t.elements.map(e => unquote(e.value)) : null);
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const cap = s => s[0].toUpperCase() + s.slice(1);

const rows = [];
const ok = (c, what) => rows.push({ ok: true, c, what });
const bad = (c, what) => rows.push({ ok: false, c, what });
const note = (c, what) => rows.push({ ok: null, c, what });

const codeNames = new Set(Object.values(code).map(c => c.name));
for (const name of Object.keys(figma)) if (!codeNames.has(name)) bad(name, 'in Figma but not in code');

for (const comp of Object.values(code)) {
  const name = comp.name;
  if (cfg.codeOnlyComponents[name]) { note(name, `code only (expected): ${cfg.codeOnlyComponents[name]}`); continue; }
  const f = figma[name];
  if (!f) { bad(name, 'in code but missing from Figma'); continue; }
  const fp = { ...f.properties };
  const used = new Set();

  for (const [prop, def] of Object.entries(comp.reactDocgen?.props ?? {})) {
    const codeDefault = unquote(def.defaultValue?.value);
    const options = literals(def.tsType);
    const isBool = def.tsType?.name === 'boolean';
    const isNode = def.tsType?.name === 'ReactNode';

    if (cfg.codeOnlyProps[prop]) { note(name, `${prop}: code only (expected)`); continue; }

    if (prop === 'children') {
      const target = cfg.children[name];
      const p = target && fp[target];
      if (!p) { bad(name, `children: no "${target ?? '?'}" property in Figma`); continue; }
      used.add(target);
      ok(name, `children → Figma ${p.type.toLowerCase()} "${target}"`);
      continue;
    }

    if (isNode) {                                   // e.g. leadingIcon → INSTANCE_SWAP + has<Name> boolean
      const swap = fp[prop], toggle = fp['has' + cap(prop)];
      if (swap?.type === 'INSTANCE_SWAP' && toggle?.type === 'BOOLEAN') {
        used.add(prop); used.add('has' + cap(prop));
        ok(name, `${prop} → Figma instance swap + has${cap(prop)}`);
      } else bad(name, `${prop}: Figma needs an instance swap "${prop}" and a boolean "has${cap(prop)}"`);
      continue;
    }

    const p = fp[prop];
    if (!p) { bad(name, `${prop}: missing in Figma`); continue; }
    used.add(prop);

    if (options) {
      if (p.type !== 'VARIANT') { bad(name, `${prop}: should be a Figma variant, is ${p.type}`); continue; }
      if (!same(options, p.options)) { bad(name, `${prop}: values differ. Code [${options}] Figma [${p.options}]`); continue; }
      if (codeDefault !== undefined && codeDefault !== p.default) { bad(name, `${prop}: default differs. Code "${codeDefault}", Figma "${p.default}"`); continue; }
      ok(name, `${prop}: ${options.join(' | ')} (default ${codeDefault ?? 'none'})`);
    } else if (isBool) {
      const figmaOk = p.type === 'BOOLEAN' || (p.type === 'VARIANT' && same(p.options, ['false', 'true']));
      if (!figmaOk) { bad(name, `${prop}: should be a Figma boolean or a false/true variant, is ${p.type}`); continue; }
      if ((codeDefault ?? 'false') !== String(p.default)) { bad(name, `${prop}: default differs. Code "${codeDefault ?? 'false'}", Figma "${p.default}"`); continue; }
      ok(name, `${prop}: boolean (default ${codeDefault ?? 'false'})`);
    } else {
      note(name, `${prop}: type ${def.tsType?.name ?? '?'} not compared`);
    }
  }
  for (const k of Object.keys(fp)) if (!used.has(k)) bad(name, `${k}: in Figma but not a code prop`);
}

const icon = r => (r.ok === true ? '✅' : r.ok === false ? '❌' : '➖');
let current = '';
for (const r of rows) {
  if (r.c !== current) { console.log(`\n${r.c}`); current = r.c; }
  console.log(`  ${icon(r)} ${r.what}`);
}
const failed = rows.filter(r => r.ok === false).length;
const passed = rows.filter(r => r.ok === true).length;
console.log(`\n${passed} match, ${failed} mismatch${failed === 1 ? '' : 'es'}, ${rows.filter(r => r.ok === null).length} expected differences (see GAPS.md).`);
process.exit(failed ? 1 : 0);
