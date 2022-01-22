const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

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
    // // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity,
    // }),
    new VueSSRClientPlugin(),
  ],
});
