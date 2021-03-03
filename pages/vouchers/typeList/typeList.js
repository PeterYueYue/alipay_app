const request = require("../../../utils/request.js");
const {timestampToTime} = require("../../../utils/date.js")

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voucherList: [],
    couponList: [],
    cardCodeList: [],
    imgUrlNew: app.globalData.imgUrlNew,
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
    this.getVouchersList();
    this.getCardCodeList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getCardCodeList() {
    let userInfo = my.getStorageSync({ key: 'userInfo' }); userInfo = userInfo.data;
    request.post(`user/open/iot/danoneCodeList`, JSON.stringify({
      userId: userInfo.id,
      status: "",
      pageParam: {
        pageSize: 1,
        pageNumber: 1,
      }
    })).then(res => {

      let list = res.data.list.map(e => {
        e.validEnds = timestampToTime(new Date(e.validEnds.replace(/-/g, "/")));
        e.validStart = timestampToTime(new Date(e.validStart.replace(/-/g, "/")));
        return e;
      })

      this.setData({
        cardCodeList: list,
        caerCodeTotal: res.data.total
      })
    })

  },
  // 获取卡券列表
  getVouchersList() {
    // @ApiParam("状态 0 未使用 1 已使用 2 过期") 
    let userId = my.getStorageSync({ key: 'userInfo' });
    userId = userId.data.id;
    request.post(`user/rest/voucher/myVouchers?pageIndex=1&pageSize=2&state=0&userId=${userId}`).then(res => {
      this.setData({
        voucherList: res.data.data.voucherList,
        couponList: res.data.data.couponList,
      })


    })
  },
  goVouList(e) {
    my.navigateTo({
      url: '/pages/vouchers/myVouchers/myVouchers?type=' + e.currentTarget.dataset.data
    });

  },
  goCardCodeList(e) {
    my.navigateTo({
      url: '/pages/vouchers/vouList/vouList?type=' + e.currentTarget.dataset.data
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