// FIGMA COMPONENT MANIFEST. Runs INSIDE Figma via the Figma MCP `use_figma` tool. Read-only.
//
// Lists every published library component on the "Components" page with its properties
// (name, type, allowed values, default), in a shape the parity check can compare with
// Storybook's component manifest, plus each component's description. Save the returned
// object to sync/figma-components.json.

const page = figma.root.children.find(p => p.name === 'Components');
await figma.setCurrentPageAsync(page);

const clean = name => name.replace(/#[^#]*$/, '');               // "label#15:0" → "label"
const components = {};
for (const node of page.children) {
  if (node.type !== 'COMPONENT' && node.type !== 'COMPONENT_SET') continue;
  if (node.name.startsWith('_') || node.name.startsWith('Icon/') || node.name === 'Spinner') continue; // internal parts
  const properties = {};
  for (const [key, def] of Object.entries(node.componentPropertyDefinitions)) {
    const p = { type: def.type };
    if (def.type === 'VARIANT') p.options = def.variantOptions;
    if (def.type !== 'SLOT' && def.type !== 'INSTANCE_SWAP') p.default = def.defaultValue;
    properties[clean(key)] = p;
  }
  components[node.name] = { properties, description: node.description };
}
return { fileKey: figma.fileKey, components };
