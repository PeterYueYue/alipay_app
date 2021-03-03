const request = require("../../../utils/request.js");
const barcode =  require("../../../utils/index.js");
const qrcode =  require("../../../utils/index.js");
const {timestampToTime} = require("../../../utils/date.js")

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    imgUrlNew: app.globalData.imgUrlNew,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = my.getStorageSync({key:'userInfo'});userInfo=userInfo.data;
    let data = JSON.stringify({
      userId:userInfo.id,
      id:options.id
    })
    request.post("user/open/iot/danoneCodeDetail",data).then(res =>{
      console.log(res,"det")
      let det = res.data.list;
      det.validEnds = timestampToTime( new Date( det.validEnds.replace(/-/g,"/"))) ;
      det.validStart = timestampToTime( new Date( det.validStart.replace(/-/g,"/"))) ;
      this.setData({item:res.data})
      this.setData({det:det})
      // barcode.barcode('barcode', res.data.list.cardCode, 680, 200);
      qrcode.barcode('barcode', res.data.list.cardCode, 480, 180);
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