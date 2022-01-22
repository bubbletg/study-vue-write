const { createBundleRenderer } = require('vue-server-renderer');
const Koa = require('koa');
const Router = require('@koa/router');
const path = require('path');
const static = require('koa-static');

const fs = require('fs');

let app = new Koa();
let router = new Router();

const template = fs.readFileSync('./public/index-server.html', 'utf8');
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

let render = createBundleRenderer(serverBundle, {
  template,
  clientManifest,
});

// 访问不到时，访问首页
// 最新 不能直接使用 '*' ,使用 '(.*)'
router.get('(.*)', async (ctx) => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString({ url: ctx.url }, (err, html) => {
      resolve(html);
      if (err) {
        reject(err);
      }
    });
  });
});

app.use(static(path.resolve(__dirname, 'dist')));
app.use(router.routes());
// 静态服务
app.listen(10086);
