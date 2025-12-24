module.exports = {
  '*.{js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix'],
  '*.{css,md,json,yml,yaml}': ['prettier --write'],
  '*.css': ['stylelint --fix'],
}
