const path = require("path");
const pkg = require('./package.json')
const webpack = require('webpack')

module.exports = [
    {
        entry: path.join(__dirname, pkg.source),
        mode: 'none',
        output: {
            path: path.join(__dirname, "dist"),
            filename: "oreid-browser.js",
            library: {
                name: 'oreidJs',
                type: 'umd',
            },
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        target: "web",
        node: {
            __dirname: false,
        },
        devtool: false,
        plugins: [new webpack.SourceMapDevToolPlugin({})],
    }
];