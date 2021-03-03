const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    name:"", //姓名
    card:"", //银行卡号
    phone: '',//手机号
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
  },
  onLoad(e) {
    if(e.name&&e.card){
      this.setData({
        name:e.name,
        card:e.card
      })
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let userInfo = my.getStorageSync({
      key: 'userInfo',
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
    }
  },
  goSuccess() {
     my.redirectTo({
      url: '/pages/index/index?common=index'
    })
  },
  // 个人授权
  onGetAuthorize(e) {
    const _this = this;
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
        const authCode = res.authCode;
        const data = {
          authCode: res.authCode,
          userId: _this.data.userInfo.id,
          userMobile: _this.data.userInfo.userMobile,
        }
        request.post("user/rest/user/login", data).then(res => {
          if (res.data.code === 0) {
            my.setStorageSync({
              key: 'userInfo',
              data: res.data.data.userInfo,
            });
            _this.setData({
              userInfo: res.data.data.userInfo,
            });
            my.showToast({
              type: "none",
              content: "开通成功",
              duration: 2000,
              success: () => {
                my.navigateBack();
              }
            });
          }
        })
      }
    });
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
