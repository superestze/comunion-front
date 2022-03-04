/**
 * @type import('stylelint').Config
 * @link https://stylelint.io/user-guide/configure
 */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
    'stylelint-no-unsupported-browser-features'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties'
  ],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'function-url-quotes': 'always',
    'font-family-no-missing-generic-family-keyword': null, // iconfont
    'plugin/declaration-block-no-ignored-properties': true,
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page']
      }
    ]
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
}
