# Comunion 前端项目重构版本

[英文说明](./README.md)

## 依赖管理

使用[pnpm](https://pnpm.js.org/)而不使用`npm`或`yarn`

### 项目初始化

```bash
pnpm i
```

### 全局添加依赖

```bash
pnpm add [-D] <pkg>
```

### 子项目添加依赖

```bash
pnpm add [-D] <pkg> --filter <@comunion/packageName>
# 例如
pnpm add lodash --filter @comunion/components
```

如果添加的是 workspace 级别的依赖，应该使用

```bash
pnpm add [-D] <@comunion/pkg> --filter <@comunion/packageName>
# 例如
pnpm add @comunion/utils --filter @comunion/components
```

也可以直接进入子项目目录进行添加删除依赖的操作，下同

### 子项目移除依赖

同添加，将命令中的`add [-D]`改为`remove`即可

## 子项目说明

- `components` Comunion UI 组件库
- `component-docs` Comunion UI 组件库在线预览和编辑
- `hooks` 通用 Vue 3 hooks 函数库
- `utils` 通用工具集函数库
- `i18n-tools` 在线 i18n 翻译辅助工具
- `docs` 各种文档
- `web` Comunion 前端项目

## 子项目执行命令

```bash
pnpm run xxx --filter @comunion/xxx
# eg:
pnpm run build --filter @comunion/utils
```

## 项目启动

```bash
pnpm run -r start
```

## 打包部署

```bash
pnpm -r build
pnpm -r publish
```

## VSCode 必备插件

1. EditorConfig for VS Code
2. ESLint
3. language-postcss
4. Prettier
5. stylelint
6. WindiCSS IntelliSense
7. Volar（需禁用 Vetur 插件）

## 项目共享代码片段

- `v3c` 创建 Vue 3 组件代码模板
- `v3p` 创建 Vue 3 页面代码模板

## 代码提交规范

1. eslint 通过
2. stylelint 通过
3. commitlint 通过
4. 合理的注释，函数一定要有详细注释，组件一定要有`name`，非常见的组件 props 要有注释，必要时要有示例
5. 目录使用`camel-case`格式，组件使用`CameCase`格式，图片等资源使用`came-case`格式，`markdown`文件使用`xxx_[lang].md`格式

## 命令行提示

执行该命令可以为你的`shell`提供 npm 脚本的自动提示

```bash
pnpm install-completion
# 如果使用的是zsh，应该使用
pnpm install-completion zsh
```

## RoadMap

[RoadMap](./ROADMAP_zh.md)
