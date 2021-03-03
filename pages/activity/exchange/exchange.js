const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    userInfo: {},
  },
  onShow() {// 页面显示
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    if (!userInfo.data) {
      this.toLogin();
      return false;
    }
    this.setData({
      userInfo: userInfo.data,
    })

  },
  get () {
    my.navigateTo({
      url: '/pages/withdrawal/withdrawal'
    });
  },
  toLogin() {
    my.confirm({
      title: '温馨提示',
      content: '您还未登录，确定去登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.navigateTo({
            url: '/pages/login/login'
          });
        } else {
          my.redirectTo({
            url: '/pages/index/index'
          });
        }
      },
    });
  },
  onLoad(e) {
  },
  onReady() {
    // 页面加载完成
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
