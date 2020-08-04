$(function () {
  var layer = layui.layer;
  var form = layui.form;
  laypage = layui.laypage;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };
  initTable();

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // res.total res中的为总数据条数
        renderPage(res.total);
      },
    });
  }

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  //    初始化 文章分类的方法
  initCate();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }

  //    筛选的功能
  // - 需要先绑定表单的`submit` 事件
  // - 在事件里面获取到表单中选中的值
  // - 然后把这个值同步到我们 参数对象 `q` 里面
  // - 再次调用 `initTable()` 方法即可
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });

  // 定义 渲染分页的方法  inittable中有传入总条数
  function renderPage(total) {
    //  因为inittable中有传res.total过来
    //执行一个laypage实例
    laypage.render({
      elem: "pageBox", //分页容器的id
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, // 每页显示几条
      curr: q.pagenum, //默认哪条被先选中

      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      //   jump回调  中object.curr可以拿到最新页码值  然后在赋值给q中的pagenum
      // 然后在根据q的最新的pagenum值来调用 inITtable 从新渲染表格的值
      // jump死循环

      // 1 点击页码时会触发jump回调

      //  2   只要调用了renderpage 就会触发jump回调
      // 3 点击一页最多显示多少条也会触发jump
      // 因为上来先 inITtable() inITtable中有 renderpage()方法  renderPage中又有inittable所以会形成死玄幻了
      jump: function (obj, first) {
        // console.log(obj.curr);
        // console.log(first);
        // 如果first值为true那么为第2 种方式触发的 那几不调用ininttable
        // 如果first值为undfinde那么为第1 种方式触发的 那可以调用ininttable
        q.pagenum = obj.curr;
        //  点击一页最多显示几条时  通过jump过去一页最多显示几条修改 q对象值再重新渲染页面
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  // 删除文章
  $("tbody").on("click", ".btn-delete", function () {
    // 获取到文章的 id
    var id = $(this).attr("data-id");
    var len = $(".btn-delete").length;
    console.log(len);
    // 询问用户是否要删除数据
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败！");
          }
          layer.msg("删除文章成功！");

          // 当当前页的数据删完之后, 因为q.pagenum的值还为当前页面的值 所以渲染出来会是空白
          // 解决bug判断当前页面数据是否为空 为空则让其值减一

          // 根据页面上的删除按钮的个数来判断页面是否为空
          // 当点击最后一个删除按钮时 此时会出来一个弹窗 删除按钮个数为1 点击确定后才为0表示删除成功进入此函数
          if (len === 1 && q.pagenum > 1) {
            // 当前页面的删除按钮为1 并且总页数不为大于1 让q.pagenum自减
            q.pagenum--;
          }
          initTable();
        },
      });

      layer.close(index);
    });
  });

  $("tbody").on("click", ".btn-edit", function () {
    var Id = $(this).attr("data-id");
    // console.log(Id);
    location.href = "/article/art_edit.html?" + Id;
  });
});
