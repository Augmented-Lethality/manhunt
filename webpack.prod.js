const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "dist/client");

module.exports = {
  mode: "production",
  performance: { hints: false },
  entry: {
    app: path.resolve(srcDir, "index.tsx"),
  },
  output: {
    path: distDir,
    filename: "[name].bundle.js",
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        faceapi: {
          test: /[\\/]node_modules[\\/]face-api\.js[\\/]/,
          name: 'faceapi',
          chunks: 'all',
        },
        reactThree: {
          test: /[\\/]node_modules[\\/]@react-three[\\/]/,
          name: 'react-three',
          chunks: 'all',
        },
        visionBundle: {
          test: /[\\/]node_modules[\\/]@mediapipe[\\/]/,
          name: 'mediapipe',
          chunks: 'all',
        },
        three: {
          test: /[\\/]node_modules[\\/]three[\\/]/,
          name: 'three',
          chunks: 'all',
        }
      },
    },
    usedExports: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(srcDir, "index.html"),
      inject: "body",
    }),
    new Dotenv(),
    //UNCOMMENT TO RUN BUILD ANALIZER ON NPM RUN PROD
    // new BundleAnalyzerPlugin()
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
};
