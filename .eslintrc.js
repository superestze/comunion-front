module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
    jest: true,
    // 如果不需要，可以卸载 eslint-plugin-node 和 eslint-plugin-promise 依赖
    // 如果是NodeJs项目建议在 package.json 中开启 engine 的限制
    node: true,
    browser: true,
    mocha: true,
    jasmine: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    // 'jsx-quotes': ['error', 'prefer-double'],
  },
  // overrides: [
  //   {
  //     files: ['config/*.js'],
  //     rules: {
  //       'import/no-commonjs': 'off',
  //     },
  //   },
  // ],
}
