const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const srcDir = path.resolve(__dirname, "client/src");
const distDir = path.resolve(__dirname, "client/dist");

module.exports = {
  mode: "development",
  watch: true,
  devtool: "eval-source-map",
  entry: {
    app: path.resolve(srcDir, "index.jsx"),
  },
  output: {
    path: distDir,
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(srcDir, "index.html"),
      inject: "body",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};
