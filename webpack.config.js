module.exports = {
  output: {
    library: 'eos-auth',
    libraryTarget: 'umd'
  },
  target: 'web',
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
