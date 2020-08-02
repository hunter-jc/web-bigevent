$(function () {
  var layer = layui.layer;
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 为上传按钮绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });
  // 上传图片功能
  $("#file").on("change", function (e) {
    var files = e.target.files[0];
    // console.log(files);
    // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(files);
    // 3. 重新初始化裁剪区域
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", imgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 上传头像
  $("#btnUPload").on("click", function () {
    // 用框架的方法 获取上传的图片文件
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");

    // 将图片上传到数据库
    $.ajax({
      type: "post",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status != 0) {
          return layer.msg(res.message);
        } else {
          layer.msg("res.message");
          window.parent.getUserInfo();
        }
      },
    });
  });
});
