// pages/vouchers/getVouchers/getVouchers.js
const request = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:[],
    isMask:false,
    message:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activityId = options.activityId;
    var id = options.id;
    var userId = options.userId;
    this.setData({
      activityId: activityId,
      id:id,
      fromUserId: userId
    })
    console.log(options)
    request.get(`user/rest/voucher/getVoucherInfo?voucherId=${id}`).then(res => {
      console.log(res);
      this.setData({details:res.data.data})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getVouchers(){
    let userInfo =  my.getStorageSync({
      key: 'userInfo'
    });
    if (!userInfo.data) {
      return false;
    }
    let userId = userInfo.data.id;
    if (!userId){
      this.toLogin();
    }else{
      let data = JSON.stringify({
        "voucherId":this.data.id,
        "fromUserId": this.data.fromUserId,
        "userId": userId
      })
      request.post(`user/rest/voucher/receivePresentVoucher`,data).then(res => {
        this.setData({message:res.data})
        this.setData({ isMask: true })
      })
    }
  },
  goIndex(){
    my.reLaunch({
      url: '/pages/index/index'
    });
  },
  toLogin() {
    my.showModal({
      title: '温馨提示',
      content: '您还未登录，确定去登录吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.navigateTo({
            url: '/pages/login/login'
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