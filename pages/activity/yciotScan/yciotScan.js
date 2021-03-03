const request = require("../../../utils/request.js");
const md5 = require("../../../utils/md5.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issuccess: false,
    userInfo: {},
    templateParams: '',//卡包传送数据
    templateId: '',//卡包模板id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let userInfo = my.getStorageSync({ key: "userInfo" }); userInfo = userInfo.data;
    this.setData({ userInfo: userInfo });
    let obi = getApp().globalData.obi;
    if (obi) {
      let data = JSON.stringify({
        userId: userInfo.id,
        obi: getApp().globalData.obi,
        source: 'isv',
      })
      request.post("user/open/iot/danoneScan", data).then(res => {
        if (res.data.code == 0) {
          this.setData({
            templateParams: res.data.data.tplParams,
            templateId: res.data.data.isvTplId
          })
          getApp().globalData.obi='';
        }
      })
    }
  },
  openVoucherDetail() {
    let that = this;
    if (!this.data.userInfo) {
      this.toLogin();
      return;
    }
    if(!that.data.templateId) {
       my.showToast({
        type: 'none',
        content: '暂无卡信息',
        duration: 1500,
        success: () => {
        },
      });
      return;
    }
    my.call('addCoupon', {
      userId: that.data.userInfo.alipayUserId,
      templateId: that.data.templateId,
      bizType: 'svPage',
      templateParams: that.data.templateParams,
    }, function (result) {
      // console.log(result);
      // console.log(JSON.stringify(result));
      if (result.success) {
        my.openVoucherDetail({ passId: result.passId });
      }
    });

  },
  goMember() {
    my.navigateTo({
      url: `/pages/member/member/member`
    });
  },
  goVouList() {
    my.navigateTo({
      url: '/pages/vouchers/typeList/typeList',
    })
  },
  //领取优惠券
  getCoupons() {
    let that = this;
    if (!this.data.userInfo.id) {
      this.toLogin();
      return;
    }
    if (!getApp().globalData.obi) {
      my.showToast({
        type: 'none',
        content: '获取设备码失败',
        duration: 1500,
        success: () => {
          my.navigateBack();
        },
      });
      return;
    }
    let userInfo = my.getStorageSync({ key: "userInfo" }); userInfo = userInfo.data;
    let data = JSON.stringify({
      userId: userInfo.id,
      obi: getApp().globalData.obi
    })
    request.post("user/open/iot/danoneScan", data).then(res => {
      if (res.data.code == 0) {
        this.setData({ issuccess: true })
        getApp().globalData.obi = '';
      }
    })
  },
  toLogin(e) {
    my.confirm({
      title: '温馨提示',
      content: '您还未登录，确定去登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.navigateTo({
            url: '/pages/login/login?targetPath=' + e
          });
        }
      },
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})