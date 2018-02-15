const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './src/main.jsx',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, './build'),
    filename: 'index.js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',

  },
  devServer: {
    inline: true,
    hot: true,
    port: 8080,
    watchContentBase: true,
    watchOptions: {
      poll: true,
    },
    historyApiFallback: {
      // rewrites: [
      //     { from: /^\/tacos/, to: '/index.html' },
      // ],
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.styl$/,
        use: [{
          loader: 'style-loader', // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'stylus-loader', // translates styl into CSS

        }],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Home',
      inject: true,
      template: './index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
module.exports = config;
