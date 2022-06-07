import commonjs from '@rollup/plugin-commonjs'
import pluginJson from '@rollup/plugin-json'
import babel from 'rollup-plugin-babel'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import typescript from 'rollup-plugin-typescript2'

// import { nodeResolve } from '@rollup/plugin-node-resolve';

const pkg = require('./package.json')

export default {
  input: pkg.source,
  output: [
    {
      name: pkg.name,
      sourcemap: true,
      file: pkg.main,
      format: 'umd',
    }
  ],
  plugins: [
    // nodeResolve({ browser: true }),
    peerDepsExternal(),
    nodePolyfills({ crypto: false }),
    pluginJson(),
    babel({
      exclude: "node_modules/**", extensions: ['.js', '.svg'],
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ]
};
