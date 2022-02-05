// 把 packages 目录下所有包都打包

// const fs = require('fs');
import fs from 'fs';
import { execa } from 'execa';

// 用于开启子进程打包
// const execa = require('execa')

const target = `compiler-dom`

build(target)
async function build(target) {
  // 相当于执行： rollup -c --environment TARGET:reactivity
  // { stdio: 'inherit' } 子进程共享给父进程
  await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' });
}


