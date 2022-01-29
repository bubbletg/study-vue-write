// 把 packages 目录下所有包都打包

// const fs = require('fs');
import fs from 'fs';
import { execa } from 'execa';

// 用于开启子进程打包
// const execa = require('execa')

// 拿到所有目录
const targets = fs.readdirSync('packages').filter((f) => {
  // 过滤掉不是目录的文件
  return fs.statSync(`packages/${f}`).isDirectory();
});

// 对目标文件依次打包，并发打包

function runParallel(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
  return Promise.all(res);
}

async function build(target) {
  // 相当于执行： rollup -c --environment TARGET:reactivity
  // { stdio: 'inherit' } 子进程共享给父进程
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' });
}

runParallel(targets, build);
