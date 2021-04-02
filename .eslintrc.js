module.exports = {
  env: {
    es6: true,
    // 如果不需要，可以卸载 eslint-plugin-node 和 eslint-plugin-promise 依赖
    // 如果是NodeJs项目建议在 package.json 中开启 engine 的限制
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: [],
  rules: {
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
