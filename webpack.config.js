const path = require('path');

module.exports = (_, argv) => ({
  mode: "production",
  devtool: "inline-source-map",
  entry: "./lib/signalfx_browser.js",
  externals: [
    "ws"
  ],
  output: {
    filename: "signalfx.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "auto",
    library: "signalfx",
    libraryTarget: "umd",
  },
});
