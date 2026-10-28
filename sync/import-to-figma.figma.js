// CODE → FIGMA. Runs INSIDE Figma via the Figma MCP `use_figma` tool.
//
// The agent replaces __SNAPSHOT__ with the contents of sync/to-figma.json
// (built by `npm run tokens:to-figma`). The script updates existing variables
// in place — values, aliases, scopes, descriptions and code syntax — so every
// component bound to them in Figma updates too. It only CREATES variables that
// are new in code; it never deletes (removals are reported for a human).

const SNAPSHOT = __SNAPSHOT__;

const hex = h => { const c = h.replace('#', ''); return { r: parseInt(c.slice(0, 2), 16) / 255, g: parseInt(c.slice(2, 4), 16) / 255, b: parseInt(c.slice(4, 6), 16) / 255 }; };
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const prim = cols.find(c => c.name === '_Primitives');
const sem = cols.find(c => c.name === 'Semantic');
const pm = prim.modes[0].modeId;
const L = sem.modes.find(m => m.name === 'Light').modeId;
const D = sem.modes.find(m => m.name === 'Dark').modeId;

let all = await figma.variables.getLocalVariablesAsync();
const find = (coll, name) => all.find(v => v.variableCollectionId === coll.id && v.name === name);
const changed = [], created = [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

for (const [name, value] of SNAPSHOT.primitives) {
  const isColor = typeof value === 'string';
  let v = find(prim, name);
  if (!v) { v = figma.variables.createVariable(name, prim, isColor ? 'COLOR' : 'FLOAT'); v.scopes = []; created.push(name); all.push(v); }
  const next = isColor ? hex(value) : value;
  const cur = v.valuesByMode[pm];
  const curCmp = isColor && cur ? { r: +cur.r.toFixed(3), g: +cur.g.toFixed(3), b: +cur.b.toFixed(3) } : cur;
  const nextCmp = isColor ? { r: +next.r.toFixed(3), g: +next.g.toFixed(3), b: +next.b.toFixed(3) } : next;
  if (!same(curCmp, nextCmp)) { v.setValueForMode(pm, next); changed.push(name); }
  v.setVariableCodeSyntax('WEB', `var(--${name.replace(/\//g, '-')})`);
}

const primByName = n => { const v = find(prim, n); if (!v) throw new Error('Unknown primitive ' + n); return v; };
for (const [name, type, l, d, scopes, desc] of SNAPSHOT.semantic) {
  let v = find(sem, name);
  if (!v) { v = figma.variables.createVariable(name, sem, type); created.push(name); all.push(v); }
  for (const [mode, ref] of [[L, l], [D, d]]) {
    const target = primByName(ref.slice(1, -1));
    const cur = v.valuesByMode[mode];
    if (!(cur?.type === 'VARIABLE_ALIAS' && cur.id === target.id)) {
      v.setValueForMode(mode, figma.variables.createVariableAlias(target));
      changed.push(`${name} (${mode === L ? 'Light' : 'Dark'})`);
    }
  }
  v.scopes = scopes ? scopes.split('|') : [];
  if (desc) v.description = desc;
  v.setVariableCodeSyntax('WEB', `var(--${name.replace(/\//g, '-')})`);
}

const inCode = new Set([...SNAPSHOT.primitives.map(p => p[0]), ...SNAPSHOT.semantic.map(s => s[0])]);
const onlyInFigma = all.filter(v => (v.variableCollectionId === prim.id || v.variableCollectionId === sem.id) && !inCode.has(v.name)).map(v => v.name);

return { changed, created, onlyInFigma, note: onlyInFigma.length ? 'Not deleted — review by hand' : 'In sync' };
