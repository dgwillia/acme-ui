// FIGMA → CODE (step 1 of 2). Runs INSIDE Figma via the Figma MCP `use_figma` tool.
//
// Reads the `_Primitives` and `Semantic` variable collections and returns a
// compact snapshot plus a checksum. The agent saves `compact` to
// sync/figma-snapshot.json, runs `node sync/checksum.mjs` to prove the copy is
// exact, then `npm run tokens:from-figma` to regenerate /tokens.
//
// Also reports any variable whose WEB code syntax breaks the naming rule
// (var(--name-with-dashes)), so drift between Figma and CSS names is caught.

const toHex = ({ r, g, b }) =>
  '#' + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, '0')).join('');

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const prim = cols.find(c => c.name === '_Primitives');
const sem = cols.find(c => c.name === 'Semantic');
if (!prim || !sem) throw new Error('Expected _Primitives and Semantic collections');

const all = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(all.map(v => [v.id, v]));
const pm = prim.modes[0].modeId;
const L = sem.modes.find(m => m.name === 'Light').modeId;
const D = sem.modes.find(m => m.name === 'Dark').modeId;

const val = (v, raw) =>
  raw?.type === 'VARIABLE_ALIAS' ? '{' + byId[raw.id].name + '}'
  : v.resolvedType === 'COLOR' ? toHex(raw)
  : raw;
const rule = name => 'var(--' + name.replace(/\//g, '-') + ')';

const exceptions = [], primitives = [], semantic = [];
for (const v of all) {
  if (v.codeSyntax.WEB !== rule(v.name)) exceptions.push([v.name, v.codeSyntax.WEB]);
  if (v.variableCollectionId === prim.id) primitives.push([v.name, val(v, v.valuesByMode[pm])]);
  if (v.variableCollectionId === sem.id) {
    semantic.push([v.name, v.resolvedType, val(v, v.valuesByMode[L]), val(v, v.valuesByMode[D]),
      v.scopes.join('|'), v.description || '']);
  }
}

// Text styles: [name, family, style, fontSize, lineHeightPx]
const textStyles = (await figma.getLocalTextStylesAsync()).map(t =>
  [t.name, t.fontName.family, t.fontName.style, t.fontSize, t.lineHeight.unit === 'PIXELS' ? t.lineHeight.value : null]);

const compact = { fileKey: figma.fileKey, primitives, semantic, textStyles };
const s = JSON.stringify(compact);
let h = 5381;
for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;

return { compact, checksum: h, length: s.length, codeSyntaxExceptions: exceptions };
