#! /bin/bash
yarn --cwd packages/utils build
yarn --cwd packages/esbuild-plugin-svg-to-vue3 build
yarn --cwd packages/hooks build
# lerna run build --scope @comunion/icons
yarn --cwd packages/web build
