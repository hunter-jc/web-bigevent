// 因项目中接口太多 所要调用ajax函数 来对接口进行拼接
// 在 $.get/post/ajax 发起请求前进行拦截/过滤 并对每次请求需要的参数进行路劲拼接

// 测试
var baseURL = "http://ajax.frontend.itheima.net";
// 生产
// var baseURL = 'www.itheima/'
$.ajaxPrefilter(function (options) {
  options.url = baseURL + options.url;
  // 判断url中是否有/my开头的 有的话给它设置请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  // complete 无论是否执行成功 都会执行这个函数
  options.complete = function (res) {
    console.log(res);
    var data = res.responseJSON;
    console.log(data);
    if (data.status == 1 && data.message == "身份认证失败！") {
      // 删除token
      localStorage.removeItem("token");
      // 页面跳转
      location.href = "/login.html";
    }
  };
});
