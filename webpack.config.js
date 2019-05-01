const TerserPlugin = require('terser-webpack-plugin');

// see https://github.com/webpack/webpack/issues/6460
// wanted to get the mode
module.exports = (env, argv) => {
  let sourceMap = 'source-map';
  let opt = {};

  if (argv.mode === 'development') {
    sourceMap = 'inline-source-map';
  } else {
    opt = {
      optimization: {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              cache: true,
              parallel: true,
              output: {
                comments: false,
                semicolons: false,
              },
            },
          }),
        ],
      },
    };
  }

  return {
    output: {
      library: 'eos-auth',
      libraryTarget: 'umd',
    },
    target: 'node',
    devtool: sourceMap,
    ...opt,
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /.(js)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true,
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  };
};
