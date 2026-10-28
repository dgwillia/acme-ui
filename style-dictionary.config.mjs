// Tokens → code. Builds src/styles/tokens.css from the DTCG files in /tokens.
//
// - Primitives and Light semantic tokens go on :root
// - Dark semantic tokens go on [data-theme="dark"]
// - Semantic tokens reference primitives with var(), so the chain stays visible
//
// Run: npm run tokens:build   (CI runs this on every pull request)
import StyleDictionary from 'style-dictionary';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

// The stable DTCG spec (2025.10) writes colours and dimensions as objects.
// These transforms turn them into CSS values.
StyleDictionary.registerTransform({
  name: 'acme/dtcg-color',
  type: 'value',
  filter: t => t.$type === 'color' && typeof t.$value === 'object',
  transform: t => t.$value.hex,
});
StyleDictionary.registerTransform({
  name: 'acme/dtcg-dimension',
  type: 'value',
  filter: t => t.$type === 'dimension' && typeof t.$value === 'object',
  transform: t => `${t.$value.value}${t.$value.unit}`,
});

const transforms = ['name/kebab', 'acme/dtcg-color', 'acme/dtcg-dimension'];
const header = '/* GENERATED FILE — do not edit. Source: /tokens (synced from Figma). Run `npm run tokens:build`. */\n';

async function build(mode, selector, semanticOnly) {
  const sd = new StyleDictionary({
    usesDtcg: true,
    log: { verbosity: 'silent' },
    source: ['tokens/primitives/*.tokens.json', `tokens/semantic/${mode}.tokens.json`],
    platforms: {
      css: {
        transforms,
        buildPath: '.sd-tmp/',
        files: [{
          destination: `${mode}.css`,
          format: 'css/variables',
          filter: semanticOnly ? t => t.filePath.includes('/semantic/') : undefined,
          options: { selector, outputReferences: true, showFileHeader: false },
        }],
      },
    },
  });
  await sd.buildAllPlatforms();
  return readFileSync(`.sd-tmp/${mode}.css`, 'utf8');
}

const light = await build('light', ':root', false);
const dark = await build('dark', '[data-theme="dark"]', true);
mkdirSync('src/styles', { recursive: true });
writeFileSync('src/styles/tokens.css', header + light + '\n' + dark);
console.log('Built src/styles/tokens.css');
