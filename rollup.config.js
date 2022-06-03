import babel from 'rollup-plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import pluginJson from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import ignore from "rollup-plugin-ignore"
import builtins from 'rollup-plugin-node-builtins'
import dts from 'rollup-plugin-dts'

const pkg = require('./package.json')

export default [{
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
      plugins: [
        builtins({crypto: false}),
        // ignore(["crypto"]),
        // nodePolyfills(), // should go after commonjs or errors will occur
        nodeResolve({
          browser: true,
        }),
        terser(),
      ],
    },
  ],
  plugins: [
    peerDepsExternal(),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.svg'],
    }),
    pluginJson(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
},
{
    // path to your declaration files root
    input: './dist/dts/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
}
]
