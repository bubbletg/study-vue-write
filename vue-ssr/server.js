const { createBundleRenderer } = require('vue-server-renderer');
const Koa = require('koa');
const Router = require('@koa/router');
const path = require('path');
const static = require('koa-static')

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

router.get('/', async (ctx) => {
  ctx.body = await new Promise((resolve, reject) => {
    render.renderToString((err, html) => {
      resolve(html);
    });
  });
});

// 静态服务
app.use(static(path.resolve(__dirname, 'dist')));

app.use(router.routes());
app.listen(3000);
