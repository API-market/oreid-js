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

  const createConfig = (inTarget, inFilename) => {
    return {
      output: {
        library: 'eos-auth',
        libraryTarget: 'umd',
        filename: inFilename,
      },
      target: inTarget,
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

  const web = createConfig('web', 'browser.js');
  const node = createConfig('node', 'server.js');

  return [web, node];
};
