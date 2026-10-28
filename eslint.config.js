import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Agents and people style components only through CSS that uses tokens.
      'no-restricted-syntax': ['error',
        { selector: "JSXAttribute[name.name='style']", message: 'No inline styles. Use a system component or a token-based CSS class. See DESIGN.md.' },
        { selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]', message: 'No raw hex colours. Use a semantic token. See DESIGN.md.' },
      ],
    },
  },
  {
    // Screens and features may only import UI from the design system package.
    files: ['src/demo/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [{ group: ['../components/*/*', '*.css'], message: 'Import components from "../index" (the @acme/ui entry point), not internals.' }] }],
    },
  },
  { ignores: ['dist', 'storybook-static', 'node_modules'] },
);
