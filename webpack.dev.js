const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');

const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "dist/client");
console.log(distDir)

module.exports = {
  mode: "development",
  watch: true,
  devtool: "eval-source-map",
  entry: {
    app: path.resolve(srcDir, "index.tsx"),
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
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    fallback: {
      "fs": require.resolve("browserify-fs"),
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
    }
  },
  optimization: {
    minimize: false
},
};
