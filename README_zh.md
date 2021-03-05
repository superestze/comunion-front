# Comunion 前端项目重构版本

[英文说明](./README.md)

## 依赖管理

使用[pnpm](https://pnpm.js.org/)而不使用`npm`或`yarn`

## 子项目说明

- `components` Comunion UI 组件库
- `component-docs` Comunion UI 组件库在线预览和编辑
- `hooks` 通用 Vue 3 hooks 函数库
- `utils` 通用工具集函数库
- `i18n-tools` 在线 i18n 翻译辅助工具
- `docs` 各种文档
- `main` Comunion 前端项目

## 项目共享代码片段

- `v3c` 创建 Vue 3 组件代码模板
- `v3p` 创建 Vue 3 页面代码模板

## 命令行提示

执行该命令可以为你的`shell`提供 npm 脚本的自动提示

```bash
npm completion >> ~/.bashrc
npm completion >> ~/.zshrc
```
