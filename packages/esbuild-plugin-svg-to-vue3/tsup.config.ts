import type { Options } from 'tsup'

export const tsup: Options = {
  clean: true,
  dts: true,
  format: ['cjs'],
  outDir: 'dist',
  target: 'es2020',
  legacyOutput: true,
  entryPoints: ['src']
}
