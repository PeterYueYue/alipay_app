// pages/vouchers/vouchers/vouchers.js
const request = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    userInfo: {},//用户信息
    imgUrl1: app.globalData.imgUrl1,
    autoDisplay: true,
    addressStatus: true,
    add: {},//选择地址
    once: true,
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    let that = this;
    let userInfo = my.getStorageSync({
      key: 'userInfo',
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
      
    }
    let add = my.getStorageSync({
      key: 'add',
    });
    if (add.data) {
      this.setData({
        addressStatus: true,
        add: add.data
      })
    } else {
      this.setData({
        addressStatus: false,
        add: {}
      })
    }
  },
  
  toAddress() {//选择地址
    my.navigateTo({
      url: `/pages/address/address?status=2`
    });
  },
  freeGet(e) {//领袋子
    var that = this;
    if (!this.data.once) {
      return false;
    }
    this.setData({
      once: false,
    });
    if (!this.data.addressStatus) {
      my.showToast({
        type: 'none',
        content: '请选择收件地址',
        duration: 1500,
      });
      return false;
    }
    let param = {
      userAddressId: this.data.add.id,
      userId : this.data.userInfo.id,
    };
    request.post("user/rest/user/getBag?userAddressId="+this.data.add.id+'&userId='+this.data.userInfo.id).then(res => {
      if (res.data.code == 0) {
        my.showToast({
          type: 'none',
          content: '领取成功',
          duration: 1500,
          success: (res)=>{
            my.reLaunch({
              url: '/pages/index/index?common=index'
            })
          }
        });
      }else{
        this.setData({once:true})
      }
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