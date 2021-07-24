#! /bin/bash
lerna run build --scope @comunion/utils
lerna run build --scope @comunion/esbuild-plugin-svg-to-vue3
lerna run build --scope @comunion/hooks
# lerna run build --scope @comunion/icons
lerna run build:nocheck --scope @comunion/web
