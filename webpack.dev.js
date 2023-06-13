const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const srcDir = path.resolve(__dirname, "client/src");
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
      "crypto": require.resolve("crypto-browserify"),
      "fs": require.resolve("browserify-fs"),
      "buffer": require.resolve("buffer"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util"),
      "path": require.resolve("path-browserify")
    }
  },
};
