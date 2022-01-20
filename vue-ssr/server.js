const Vue = require('vue');
const VueServerRenderer = require('vue-server-renderer');
const Koa = require('koa');
const Router = require('@koa/router');
const path = require('path');
const static = require('koa-static');

const fs = require('fs');

let app = new Koa();
let router = new Router();

const serverBundle = fs.readFileSync('./dist/server.bundle.js', 'utf8');
const template = fs.readFileSync('./dist/index-server.html', 'utf8');


let render = VueServerRenderer.createBundleRenderer(serverBundle, {
  template,
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
