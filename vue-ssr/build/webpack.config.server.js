const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 需要打包的是服务端，打包的是给node 用的
module.exports = merge(base, {
  mode: 'development',
  entry: {
    server: path.resolve(__dirname, '../src/server-entry.js'),
  },
  target: 'node', // 打包的目标是给node来使用的。
  output: { // 使用 module.exports 导出
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index-server.html'),
      filename: 'index-server.html',
      excludeChunks: ['server'], //不默认引入
    }),
  ],
});
