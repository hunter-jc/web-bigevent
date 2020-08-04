$(function () {
  // 获取文章分类列表数据
  // template.defaults.imports.dateFormat = function (date) {
  //   var y = date.getFullYear();
  //   var m = date.getMonth() + 1;
  //   var d = date.getDate();
  //   return y + "-" + m + "-" + d;
  // };
  // template.defaults.imports.getTi = function () {
  //   return new Date();
  // };

  initArtCateList();

  // 为添加类别按钮绑定点击事件   弹出层
  var index = null;
  $("#btnAddCate").on("click", function () {
    index = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  // 因为  script中的 form为动态生成 所以要通过代理的形式，为 form-add 表单绑定 submit 事件
  var index = null;
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layui.layer.msg(res.message);
        } else {
          initArtCateList();
          layui.layer.msg("恭喜你,新增成功");
          layui.layer.close(index);
        }
      },
    });
  });

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        var htmlStr = template("tlp-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  // 编辑修改文章  此处用到隐藏域
  //    先根据id获取数据并渲染到表单中
  var indexEdit = null;
  $("tbody").on("click", ".btn-edit", function () {
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });

    var id = $(this).attr("data-id");
    $.ajax({
      type: "get",
      url: "/my/article/cates/" + id,
      success: function (res) {
        //   快速将获取的数据渲染到表单中  lay-flitle 给form表单 属性
        layui.form.val("form-edit", res.data);
      },
    });
  });

  //   跟新文章数据
  $("body").on("submit", "#form-edit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          return layui.layer.msg(res.message);
        } else {
          layui.layer.msg(res.message);
          layui.layer.close(indexEdit);
          initArtCateList();
        }
      },
    });
  });

  // 删除文章类

  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    // 提示用户是否要删除
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除分类失败！");
          }
          layui.layer.msg("删除分类成功！");
          layui.layer.close(index);
          initArtCateList();
        },
      });
    });
  });
//   $("#kkk").on("click", function () {
//     // var Math = new Math();
//     // Math.round(Math.random() * 100)

//     $.ajax({
//       type: "post",
//       url: "/my/article/addcates",
//       data: {
//         name: "忠艾一生" + Math.round(Math.random() * 100),
//         alias: "你随便删",
//       },
//       success: function (res) {
//         if (res.status != 0) {
//           return layui.layer.msg(res.message);
//         } else {
//           initArtCateList();
//           layui.layer.msg("恭喜你,新增成功");
//           layui.layer.close(index);
//         }
//       },
//     });
//   });
});
