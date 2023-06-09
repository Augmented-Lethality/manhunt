const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const srcDir = path.resolve(__dirname, "client/src");
const distDir = path.resolve(__dirname, "dist/client");
console.log(distDir)

module.exports = {
  mode: "production",
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
  },
};
