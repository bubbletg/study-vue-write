import createApp from './app';

// 代码运行在客户端浏览器上的时候，每一个人都说是一个vue 实例，当运行在服务端的时候，也要每个人都有一个实例，而不是所有人都用一个实例。

// 该方法在访问服务器时候被调用，返回一个vue 实例
export default () => {
  const { app } = createApp();
  return app;
};
