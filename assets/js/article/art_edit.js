$(function () {
  // 3. 把插件对应的js代码，添加进去
  var layer = layui.layer;
  initEditor();
  // 3. 把插件对应的js代码，添加进去
  var $image = $("#image");
  // 3. 把插件对应的js代码，添加进去
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };
  // 3. 把插件对应的js代码，添加进去
  $image.cropper(options);

  //   console.log(location);
  var Id = location.search.split("?")[1];
  console.log(Id);
  $.ajax({
    type: "get",
    url: "/my/article/" + Id,
    success: function (res) {
      layui.form.val("form-edit", res.data);
      tinyMCE.activeEditor.setContent(res.data.content);
      initCate(res.data.cate_id);
      // console.log(res);
    },
  });

  // 获取渲染文章分类信息
  function initCate(cate_id) {
    $.ajax({
      method: "get",
      // 获取所有类别信息
      url: "/my/article/cates",
      success: function (res) {
        // 将当前编辑的文章的分类添加到res中
        res.cate_id = cate_id;
        // 调用模板引擎渲染下拉列表
        var str = template("art-edit", res);
        $("[name=cate_id]").html(str);
        // 因为下拉列表第一次不能渲染出来，所以手动再次渲染，调用layui方法
        layui.form.render();
      },
    });
  }
  // 确定发布状态
  var state = "已发布";
  $("#btnSave2").click(function () {
    state = "草稿";
  });
  // 添加文章提交
  $("#form-edit").on("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(this);
    fd.append("state", state);
    // 生成二进制图片文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      // 将 Canvas 画布上的内容，转化为文件对象
      .toBlob(function (blob) {
        // 得到文件对象后，进行后续的操作
        fd.append("cover_img", blob);
        // console.log(...fd);
        // ajax一定要放到回调函数里面
        // 因为生成文件是耗时操作，异步，所以必须保证发送ajax的时候图片已经生成，所以必须写到回调函数中
        editArticle(fd);
      });
  });

  function editArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/edit",
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return layer.msg("修改文章失败！");
        }
        layer.msg("修改文章成功！");
        // 发布文章成功后，跳转到文章列表页面
        location.href = "/article/art_list.html";
        // window. parent.document.getElementById("ck").click();
      },
    });
  }
});
