module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'cypress'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': 'off',

    // Fix: React imported but not used (React 17+ JSX transform handles this)
    'no-unused-vars': 'off',

    // Fix: Three.js / R3F custom props like intensity, position, object
    'react/no-unknown-property': ['error', { ignore: ['intensity', 'position', 'object', 'args', 'attach', 'castShadow', 'receiveShadow', 'dispose'] }],

    // Fix: prop-types not needed with TypeScript or if you don't use PropTypes
    'react/prop-types': 'off',

    // Fix: 'global' not defined in test files
    'no-undef': 'warn',
  },
}