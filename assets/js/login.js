$(function () {
  // 点击去注册账号的链接
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  var form = layui.form;
  form.verify({
    pwd: [/^\S{6,12}$/, "密码为6-12位不能输入空格"],
    repwd: function (value) {
      if ($(".reg-box [name=password]").val() !== value) {
        return "两次输入的密码不一样";
      }
    },
  });
  var layer = layui.layer;
  // 注册提交事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/api/reguser",
      data: {
        username: $("#form_reg input[name=username]").val(),
        password: $("#form_reg input[name=password]").val(),
      },
      success: function (res) {
        if (res.status != 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        $("#link_login").click();
        $("#form_reg")[0].reset();
      },
    });
  });
  // 登录事件
  $("#form_login").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("用户名或者密码输入错误请从新输入");
        }
        layer.msg(res.message);
        // 保存带有权限的token 用于有权限的登录
        localStorage.setItem("token", res.token);
        location.href = "/index.html";
      },
    });
  });
});
