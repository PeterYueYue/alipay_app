const request = require("../../../utils/request")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    iotSitList:[]
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
    let that = this;
    my.getLocation({
      type: 'wgs84',
      success (res) {
        that.getIotSitList(res);
      },
      fail(res){
        my.navigateBack()
      }
     })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getIotSitList(res){

    request.post("user/open/iot/iotAddressList",JSON.stringify({
      longitude:res.longitude,
      latitude:res.latitude
    })).then(res => {
      this.setData({iotSitList:res.data.data})
      console.log(res,"sitlist")
    })

  },
  toMap(e) {
    let item = e.currentTarget.dataset.item
    my.openLocation({
      longitude: item.longitude -0,
      latitude: item.latitude -0,
      name: item.branchName,
      address: item.address
    })
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