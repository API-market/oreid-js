import babel from 'rollup-plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
// import nodePolyfills from 'rollup-plugin-polyfill-node'
import pluginJson from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

export default {
  input: './src/index.ts',
  output: [
    {
      name: pkg.name,
      sourcemap: true,
      file: pkg.main,
      format: 'umd',
    },
    // minified browser build
    {
      name: pkg.name,
      sourcemap: false,
      file: 'dist.browser/index.min.js',
      format: 'esm',
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve({
      browser: true,
    }),
    peerDepsExternal(),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.svg'],
    }),
    pluginJson(),
    commonjs(),
    // nodePolyfills(), // should go after commonjs or errors will occur
    typescript(),
  ],
}
