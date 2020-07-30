// 因项目中接口太多 所要调用ajax函数 来对接口进行拼接
// 在 $.get/post/ajax 发起请求前进行拦截/过滤 并对每次请求需要的参数进行路劲拼接

// 测试
var baseURL = "http://ajax.frontend.itheima.net";
// 生产
// var baseURL = 'www.itheima/'
$.ajaxPrefilter(function (options) {
  options.url = baseURL + options.url;
});
