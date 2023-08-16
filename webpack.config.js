const path = require('path');
const webpack = require('webpack');
const { default: merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');

const baseConfig = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./lib/signalfx_browser.js",
  output: {
    filename: "signalfx.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "auto",
    library: {
      name: "signalfx.streamer",
      type: "umd"
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^ws$/, (resource) => {
      const pathToWsReplacement = path.resolve(__dirname, 'lib', 'browser', 'ws.js');
      resource.request = path.relative(resource.context, pathToWsReplacement);
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './lib/signalfx.d.ts',
          to: path.resolve(__dirname, 'build', 'signalfx.min.d.ts'),
        },
      ],
    }),
  ],
};

module.exports = (_, argv) => ([
  baseConfig,
  merge(baseConfig, {
    mode: 'production',
    devtool: false,
    output: {
      filename: "signalfx.min.js",
    },
  })
]);
