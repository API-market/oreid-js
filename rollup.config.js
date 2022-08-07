import typescript from 'rollup-plugin-typescript2'
import { terser } from "rollup-plugin-terser";

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
    typescript({ tsconfig: "./tsconfig.json", allowJs: true }), // generate .js files from .ts files (and types)
    terser() // minify the bundle
  ]
};
