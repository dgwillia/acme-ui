// IS FIGMA BEHIND THE CODE? No AI, no Figma access needed.
//
// sync/figma-snapshot.json is Figma's last agreed token state. It only changes when a sync is done.
// So if /tokens differs from it, a token was changed in code and not yet pushed to Figma.
//
//   On a pull request: a warning only (the rule is merge first, then sync).
//   On main, or run locally: fails, so a red main means "Figma sync needed".
//
// Fix: run the Code → Figma steps in CLAUDE.md.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
execFileSync('node', [root + 'sync/tokens-to-snapshot.mjs'], { stdio: 'ignore' });
const code = JSON.parse(readFileSync(root + 'sync/to-figma.json', 'utf8'));
const figma = JSON.parse(readFileSync(root + 'sync/figma-snapshot.json', 'utf8'));

const rows = s => [...s.primitives, ...s.semantic];
const key = r => JSON.stringify(r);
const inFigma = new Set(rows(figma).map(key));
const inCode = new Set(rows(code).map(key));
const figmaNames = new Set(rows(figma).map(r => r[0]));
const codeNames = new Set(rows(code).map(r => r[0]));

const changed = rows(code).filter(r => !inFigma.has(key(r)) && figmaNames.has(r[0])).map(r => r[0]);
const added = rows(code).filter(r => !figmaNames.has(r[0])).map(r => r[0]);
const removed = rows(figma).filter(r => !codeNames.has(r[0])).map(r => r[0]);

if (!changed.length && !added.length && !removed.length) {
  console.log(`✅ Figma tokens are in sync with the code (${inCode.size} tokens).`);
  process.exit(0);
}

const list = (label, names) => (names.length ? `\n  ${label} (${names.length}): ${names.join(', ')}` : '');
const msg = `Figma is behind the code: run the Code → Figma steps in CLAUDE.md.` +
  list('changed in code', changed) + list('new in code', added) + list('removed from code', removed);
console.log(`❌ ${msg}`);

if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
  console.log(`::warning title=Figma sync needed after merge::${msg.replace(/\n\s*/g, ' ')}`);
  process.exit(0);
}
process.exit(1);
