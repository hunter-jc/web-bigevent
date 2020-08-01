$(function () {
  var layer = layui.layer;
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
