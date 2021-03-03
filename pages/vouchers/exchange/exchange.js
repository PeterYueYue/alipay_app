// pages/vouchers/vouchers/vouchers.js
const request = require("../../../utils/request.js");
Page({
  data: {
    userInfo: {},//用户信息
    code: '',
    click: true,
  },
  onLoad: function (options) {
  },

  onReady: function () {
  },

  onShow: function () {
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
    }
  },
  change(e) {
    this.setData({
      code: e.detail.value,
    })
  },
  ex() {
    this.setData({
      click: false,
    })
    if(this.data.code == '') {
      my.showToast({
        type: 'none',
        content: "请输入券码",
        duration: 2000,
      });
      return
    }
    const data = {
      code: this.data.code,
      userId: this.data.userInfo.id,
    }
    // http://localhost:17201/rest/voucher/exchangeActivityCode?activityCode=4sgeavsn5ufa&userId=1fa4cc4407c645d380e523aa4dc5caa0
    request.post(`user/rest/voucher/exchangeActivityCode?activityCode=` + this.data.code + '&userId=' + this.data.userInfo.id).then(res => {
      this.setData({
        click: true,
      })
      if (res.data.code == 0) {
        my.showToast({
          type: 'none',
          content: "兑换成功",
          duration: 2000,
          success: function () {
            my.redirectTo({
              url: '/pages/index/index?common=index'
            })
          }
        });
      }
    })
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
        }
      },
    });
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function (res) {
  }
})