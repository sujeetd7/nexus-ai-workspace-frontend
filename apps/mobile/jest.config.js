module.exports = {
  preset: '@react-native/jest-preset',
  // pnpm nests packages under node_modules/.pnpm/.../node_modules/...
  // Stock RN transformIgnorePatterns only match node_modules/@react-native/...
  // so setup.js (ESM in 0.85) is skipped and blows up on `import`.
  transformIgnorePatterns: [
    'node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?)/)',
  ],
};
