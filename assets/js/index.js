var layer = layui.layer;
$(function () {
  getUserInfo();
  $("#btnLayout").on("click", function () {
    layer.confirm("是否确认退出", { icon: 3, title: "提示" }, function (index) {
      //do something

      layer.close(index);
      localStorage.removeItem("token");
      location.href = "/login.html";
    });
  });
});
// 此获取用户信息的方法是 全局的方便后面基本资料 的子页面调用父页面的方法
function getUserInfo() {
  $.ajax({
    type: "get",
    url: "/my/userinfo",
    // 提取到base里
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status != 0) {
        return layui.layer.msg("身份认证失败");
      }
      //   console.log(res);
      renderAvatar(res.data);
    },
    // 无论成功失败都要调用complete   用来判断用户是否登录没登录给他强制返回 写在base里每个都判断
  });
}

function renderAvatar(user) {
  var name = user.nickname || user.username;
  $("#welcome").html("欢迎 &nbsp &nbsp" + name);
  if (user.user_pic != null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    $(".text-avatar").show().html(name[0].toUpperCase());
  }
}



  //  second


// // 判断是否退出 在用户先登录的情况下
// var layer = layui.layer;
// // 1 获取用户登录的信息通过token
// getUserInfo();
// $("#btnLayout").on("click", function () {
//   layer.confirm("是否确认退出", { icon: 3, title: "提示" }, function (index) {
//     //do something

//     layer.close(index);
//     localStorage.removeItem("token");
//     location.href = "/login.html";
//   });
// });
// function getUserInfo() {
//   $.ajax({
//     type: "get",
//     url: "/my/userinfo",
//     // Authorization:Bearer   写在baseapi中
//     success: function (res) {
//       if (res.status != 0) {
//         return layui.layer.msg("身份认证失败");
//       }
//       // 如果认证成功 将数据渲染到页面
//       renderAvatar(res.data);
//     },
//   });
// }

// function renderAvatar(res) {
//   var name = res.nickname || res.username;
//   $("#welcome").html("欢迎 &nbsp &nbsp" + name);
//   if (res.user_pic != null) {
//     $(".layui-nav-img").attr("src", user.user_pic).show();
//     $(".text-avatar").hide();
//   } else {
//     $(".layui-nav-img").hide();
//     $(".text-avatar").show().html(name[0].toUpperCase());
//   }
// }
