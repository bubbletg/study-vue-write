const Vue = require('vue');
const VueServerRenderer = require('vue-server-renderer');
const Koa = require('koa');
const Router = require('@koa/router');

const fs = require('fs');

let app = new Koa();
let router = new Router();

let vm = new Vue({
  data() {
    return {
      name: 'bubbleTg',
    };
  },
  template: '<div class="tg"> {{ name }}</div>',
});

const template = fs.readFileSync('./template.html', 'utf8');
let render = VueServerRenderer.createRenderer({ template });

router.get('/', async (ctx) => {
  ctx.body = await render.renderToString(vm);
});

app.use(router.routes());
app.listen(3000);
