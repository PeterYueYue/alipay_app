var app = getApp();
const request = require("../../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    showTop: false,
    productDetails: {},
  },

  onLoad: function (options) {
    let item = options.item
    this.getProductDetail(item);
  },
  onReady: function () {
  },
  onShow: function () {
    let res = my.getStorageSync({
      key: 'userInfo'
    });
    let data = {
      userId: res.data.id
    }
    request.post("user/rest/user/getUserInfo", data).then(res => {
      if (res.data.code === 0) {
        my.setStorage({
          key: 'userInfoMore', // 缓存数据的key
          data: res.data.data, // 要缓存的数据
        });
      }
    })
  },
  getProductDetail(id) {
    request.get(`user/rest/product/productDetail?productId=${id}`).then((res) => {
      this.setData({ productDetails: res.data.data })
    })
  },
  onTopBtnTap() {
    this.setData({
      showTop: true,
    });
  },
  onPopupClose() {
    // console.log(1)
    this.setData({
      showTop: false,
    });
  },
  goOrder() {//立即兑换
    // console.log(this.data.productDetails)
    const id = this.data.productDetails.id;
    my.navigateTo({
      url: `/pages/shop/orderSure/orderSure?id=${id}`,
    })
  },
  onHide: function () {

  },
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