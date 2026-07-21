module.exports = {
  "apps/mobile/**/*.{js,jsx,ts,tsx}": ["pnpm --filter mobile lint"],

  "apps/web/**/*.{js,jsx,ts,tsx}": ["pnpm --filter web lint"],

  "packages/**/*.{js,jsx,ts,tsx}": ["pnpm boundaries:check"],

  "*.{json,md,yml,yaml}": ["pnpm exec prettier --write"],
};
