// see https://github.com/webpack/webpack/issues/6460
// wanted to get the mode
module.exports = (env, argv) => {
  let sourceMap = 'source-map'

  if (argv.mode === 'development') {
    sourceMap = 'inline-source-map'
  }

  return {
    output: {
      library: 'eos-auth',
      libraryTarget: 'umd'
    },
    target: 'web',
    devtool: sourceMap,
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /.(js)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }
}
