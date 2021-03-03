// pages/vouchers/vouchers/vouchers.js
const request = require("../../../utils/request.js");
Page({
  data: {
    userInfo: {},//用户信息
  },
  onLoad: function (options) {
    // if (options.userId && options.activityId){
    //   this.setData({ mainUserId: options.userId})
    //   this.setData({ isYq:true})
    // }
    // this.setData({ activityId: options.activityId })
  },

  onReady: function () {
    
  },

  onShow: function () {
    
  },
  get: function() {
    let userInfo =  my.getStorageSync({
      key: 'userInfo'
    });
    if (!userInfo.data) {
      this.toLogin();
      return false;
    }
    const data = {
      mobile: userInfo.data.userMobile,
    }
    request.post(`user/rest/voucher/sendVoucher`, data).then(res => {
      if(res.data.code == 0) {
        my.showToast({
          type: 'none',
          content: "领取成功",
          duration: 2000,
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