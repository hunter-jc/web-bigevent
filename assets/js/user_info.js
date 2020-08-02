$(function () {
  // 定义规则
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称应该输入1~6位之间";
      }
    },
  });

  initUserInfo();

  function initUserInfo() {
    $.ajax({
      type: "get",
      url: "/my/userinfo",
      success: function (res) {
        // console.log( res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 展示用户信息 layui的取值赋值方法
        form.val("formUserInfo", res.data);
      },
    });
  }

  $("#btnReset").on("click", function (e) {
    // 取消重置默认效果
    e.preventDefault();
    // 重置之后表单内容再恢复到之前的数据
    initUserInfo();
  });

  // 发送ajax请求进行提交用户修改
  $(".layui-form").on("submit", function (e) {
    // 阻止表单默认提交行为
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        } else {
          layer.msg(res.message);
          // 利用window.parent调用 父页面的方法 此方法必须是全局的
          window.parent.getUserInfo();
          $(".layui-form")[0].reset();
        }
      },
    });
  });
});
// __________________________________________________________________________________________________________--
// ___________________________________________________________________________________________________________________
// second
// var form = layui.form;
// var layer = layui.layer;
// // 判断用户输入的用户名
// form.verify({
//   nickname: function (value) {
//     if (value.length > 6) {
//       return "昵称应该输入1~6位之间";
//     }
//   },
// });

// // 获取用户信息并渲染到保单中 用到 formfilter      在表单中添加 lay-filter="formUserInfo"

// initUserInfo();
//   function initUserInfo() {
//     $.ajax({
//       type: "get",
//       url: "/my/userinfo",
//       success: function (res) {
//         // console.log( res);
//         if (res.status !== 0) {
//           return layer.msg(res.message);
//         }
//         // 展示用户信息 layui的取值赋值方法   表单设置lay-filter="formUserInfo"
//         form.val("formUserInfo", res.data);
//       },
//     });
// }

// // 点击重置恢复到 之前数据
// $("#btnReset").on("click", function (e) {
//   // 取消重置默认效果
//   e.preventDefault();

//   // 重置之后表单内容再恢复到之前的数据
//   initUserInfo();
// });

// // 发送ajax请求进行提交用户修改
// $(".layui-form").on("submit", function (e) {
//   // 阻止表单默认提交行为
//   e.preventDefault();
//   $.ajax({
//     type: "post",
//     url: "/my/userinfo",
//     data: $(this).serialize(),
//     success: function (res) {
//       if (res.status !== 0) {
//         return layer.msg(res.message);
//       } else {
//         layer.msg(res.message);
//         // 利用window.parent调用 父页面的方法 此方法必须是全局的
//         window.parent.getUserInfo();
//         // 将用户信息头像等渲染到页面
//         $(".layui-form")[0].reset();
//       }
//     },
//   });
// });
// });
