const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

module.exports = merge(base, {
  entry: {
    client: path.resolve(__dirname, '../src/client-entry.js'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index-client.html'),
      filename: 'index-client.html',
      minify: false,
    }),
  ],
});
