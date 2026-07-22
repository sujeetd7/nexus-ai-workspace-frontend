module.exports = {
  preset: '@react-native/jest-preset',
  // pnpm nests packages under node_modules/.pnpm/.../node_modules/...
  // Stock RN transformIgnorePatterns only match node_modules/@react-native/...
  // so setup.js (ESM in 0.85) is skipped and blows up on `import`.
  // Also transform workspace @nexus packages, zod, Redux ESM deps (immer),
  // and React Navigation.
  transformIgnorePatterns: [
    'node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?|@react-navigation|@nexus|@tamagui|zod|@reduxjs|immer|redux|react-redux|redux-saga|reselect)/)',
  ],
};
