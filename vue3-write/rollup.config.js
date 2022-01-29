import path from 'path';
import json from '@rollup/plugin-json';
import resolvePro from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';

// 找到 packages
const packagesDir = path.resolve(__dirname, 'packages');

// 打包的具体目录,具体包
const packageDir = path.resolve(packagesDir, process.env.TARGET);

const resolve = (p) => path.resolve(packageDir, p);

const pkg = require(resolve('package.json'));

const name = path.basename(packageDir);

// 针对打包类型，先做一个映射表，根据 package.json 中 formats 格式化来打包的内容
const outputConfig = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-budler.js`),
    format: 'es',
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife', // 立即执行函数
  },
};

const options = pkg.buildOptions;

// 创建打包配置
function createConfig(format, output) { 
  output.name = options.name;
  output.sourcemap = true;

  // 生成 rollup 配置
  return {
    input: resolve(`src/index.ts`),
    output,
    plugins: [
      json(),
      ts({ // ts 插件
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
      resolvePro(), // 解析第三方模块
    ],
  };
}

// 拿到所有打包配置，导出
export default options.formats.map((format) => createConfig(format, outputConfig[format]));
