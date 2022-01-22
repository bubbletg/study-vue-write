import createApp from './app';

// 代码运行在客户端浏览器上的时候，每一个人都说是一个vue 实例，当运行在服务端的时候，也要每个人都有一个实例，而不是所有人都用一个实例。

// 该方法在访问服务器时候被调用，返回一个vue 实例

export default (context) => {
  return new Promise((resolve, reject) => {
    // context 就是包涵着后端的上下文
    // 是服务端调用renderToString 是第一个参数传递的信息

    const { app, router, store } = createApp();

    // 设置服务器端 router 的位置
    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      // 匹配路由
      Promise.all(
        matchedComponents.map((component) => {
          if (component.asyncData) {
            return component.asyncData(store);
          }
        })
      ).then(() => {
        context.state = store.state
        resolve(app);
      });
    }, reject);
  });
};
