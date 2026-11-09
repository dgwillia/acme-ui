// APPLY GENERATED DESCRIPTIONS. Runs INSIDE Figma via the Figma MCP `use_figma` tool.
// Replace __DESCRIPTIONS__ with the contents of sync/figma-descriptions.json
// (built by `npm run figma:descriptions`). Only touches descriptions, nothing else.

const DESCRIPTIONS = __DESCRIPTIONS__;
const page = figma.root.children.find(p => p.name === 'Components');
await figma.setCurrentPageAsync(page);
const updated = [], missing = [];
for (const [name, text] of Object.entries(DESCRIPTIONS)) {
  const node = page.children.find(n => (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === name);
  if (!node) { missing.push(name); continue; }
  if (node.description !== text) { node.description = text; updated.push(name); }
}
return { updated, missing };
