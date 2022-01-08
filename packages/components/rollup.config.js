import commonjs from '@rollup/plugin-commonjs'
import jsx from 'acorn-jsx'
import path from 'path'
import css from 'rollup-plugin-css-only'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const extensions = ['.ts', '.tsx', '.js']

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: pkg.name
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, './tsconfig.prod.json'),
      typescript: require('typescript'),
      extensions
    }),
    resolve(extensions),
    commonjs({ extensions, sourceMap: true }),
    css({ output: 'index.css' })
  ],
  acornInjectPlugins: [jsx()]
}
