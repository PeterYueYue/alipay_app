var app = getApp();
const request = require("../../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    item: {}
  },
  onLoad: function (options) {
    let item = JSON.parse(options.item)
    this.setData({ item: item })
    this.getList(item.id)
  },
  onReady: function () {

  },
  onShow: function () {

  },
  getList(id) {
    request.get(`user/rest/product/productPageByType?typeId=${id}&pageIndex=${1}&pageSize=100`).then((res) => {
      this.setData({ productList: res.data.page })
      my.setNavigationBar({
        reset: true,
        title: res.data.productType.name,
      });
    })
  },
  goDetails(e) {
     if(e.currentTarget.dataset.item.stock ==0) {
        return false;
      }
    my.navigateTo({
      url: `/pages/shop/productDetail/productDetail?item=${e.currentTarget.dataset.item.id}`,
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