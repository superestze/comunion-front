/**
 * @link https://www.npmjs.com/package/lint-staged
 */
module.exports = {
  '*.{js,ts,d.ts,tsx}': ['eslint --fix'],
  '*.{css,less,styl,scss,sass}': ['stylelint --fix'],
  '*.{json,html}': 'prettier --write'
}
