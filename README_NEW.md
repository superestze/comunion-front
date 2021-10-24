# Comunion 前端项目
这是 Comunion 的 v5 版本的前端代码，项目使用 `lerna` 进行多包管理，主要是用 `Vue3` 和相关技术栈进行开发。

## 代码结构
```
packages
|- components # 通用组件管理
|- docs # 文档目录，基于 vitepress
|- esbuild-plugin-svg-to-vue3 # svg 生成 vue3 组件的插件
|- generator # 代码生成辅助工具
|- hooks # 通用 vue hooks
|- i8n-tools # 翻译辅助工具
|- icons # 图标管理
|- utils # 通用工具库管理
|- web # 前端页面
```
[更多细节请参照](./startup.md)

## 如何运行项目
1. 拉取代码
```sh
git clone git@github.com:comunion-io/v5-front.git
```

2. 安装依赖
```sh
yarn setup
```

3. 运行web项目
```sh
yarn dev
```

4. 运行其它项目（可选）
```sh
# 文档
yarn doc
```

5. 打包
```sh
yarn build
```

## 如何贡献代码
### 对于团队开发成员
1. clone 代码
2. git checkout -b feat/xxx 根据代码修改内容切换一个新分支
3. 修改代码并提交 git add -am 'feat: xxx'
4. git push 推送代码
5. [创建新的 PR](https://github.com/comunion-io/v5-front/pulls)并通知代码管理员

### 对于非开发成员
1. fork 仓库
2. git checkout -b fix/xxx 根据代码修改内容切换一个新分支
3. 修改代码并提交 git add -am 'fix: xxx'
4. git push 推送代码
5. 从你的代码库提交一个 PR


### Git workflow
1. `develop` 作为主要开发分支，所有的开发内容都往该分支推送，该分支不允许直接推送，分支受保护，该分支的代码自动部署到 `https://d.comunion.io/`
2. `release` 作为预发版分支，当需要发布测试版本时从 `develop` 合并到 `release` 分支并打上 tag 一起推送，该分支代码将自动部署到 `https://test.comunion.io/`
3. `main` 分支作为稳定分支，当需要发布线上版本时从 `release` 分支合并到该分支
4. `feat/xxx` 作为功能分支，所有的新功能都有一个对应的分支，合并完成后会删除远程该分支
5. `fix/xxx` 测试环境用于修改 bug 的分支，合并后会删除该远程分支
6. `hotfix/xxx` 线上 bug 修复分支，该分支需要同时合并到 `release` 和 `develop` 分支，在 `release` 分支上测试无误后合并到 `main` 分支
