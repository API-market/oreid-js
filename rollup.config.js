import typescript from 'rollup-plugin-typescript2'
import { terser } from "rollup-plugin-terser";
import json from '@rollup/plugin-json'

const pkg = require('./package.json')

export default {
  input: pkg.source,
  output: [
    {
      name: pkg.name,
      sourcemap: true,
      file: pkg.main,
      format: 'umd',
      compact: true
    }
  ],
  plugins: [
    json(),
    typescript({ tsconfig: "./tsconfig.json", allowJs: true }), // generate .js files from .ts files (and types)
    terser() // minify the bundle
  ]
};
