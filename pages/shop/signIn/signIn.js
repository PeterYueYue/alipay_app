// pages/shop/signIn/signIn.js
var app = getApp();
const request = require("../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    showTop: false,
    animationData: {},
    signInData: {},
    hotProduct: [],
    show_door: false,
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
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    userInfo = userInfo.data;
    if (!userInfo) {
      return false;
    }
    this.setData({
      userInfo: userInfo,
    },()=>{
      this.getSignInData();
      this.getHotProduct();
    });
  },
  onShow: function () {
  },
  getHotProduct() {
    request.get('user/rest/product/hotProducts?qty=20').then((res) => {
      this.setData({ hotProduct: res.data.data })
    })

  },
  getSignInData() {
    request.get('user/rest/signIn/signInfo', {userId:this.data.userInfo.id}).then((res) => {
      this.setData({ signInData: res.data })
    })
  },
  submit() {
    let that = this;
    request.get('user/rest/signIn/submit', { userId: this.data.userInfo.id }).then((res) => {
      setTimeout(() => {
        that.getSignInData()
      }, 1000)
      that.setData({ point: res.data.point })
    })
  },
  goDetails(e) {
    if (e.currentTarget.dataset.item.stock == 0) {
      return false;
    }
    my.navigateTo({
      url: `/pages/shop/productDetail/productDetail?item=${e.currentTarget.dataset.item.id}`,
    })
  },
  onTopBtnTap() {
    var that = this;
    this.submit();
    var animation = my.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(-1000).step()
    that.setData({
      animationData: animation.export(),
      showTop: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),

      })
    }, 200)
  },
  onPopupClose() {
    var that = this;
    var animation = my.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(-1000).step()
    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      that.setData({
        showTop: false
      })
    }, 200)

  },
  goRule() {
    my.navigateTo({
      url: `/pages/webView/webView?url=https://miniapp.shishangbag.vip/web_rule/singin/index.html`
    });
  },
  appointment() { //预约
    let that = this;
    if (!this.data.userInfo) {
      this.toLogin('/pages/appointment/appointment')
      return false
    }
    //判断是否有上门券
    const data = {
      userId: this.data.userInfo.id,
    }
    if (this.data.userInfo.userFlag !== 1) {
      my.navigateTo({
        url: '/pages/appointment/appointment'
      });
    } else {
      request.get(`order/rest/resserveOrder/getShangmenVoucherNum?`, data).then((res) => {
        if (res.data.data > 0) {
          my.navigateTo({
            url: '/pages/appointment/appointment'
          });
        } else {
          this.setData({
            show_door: true,
          });
        }
      })
    }
  },
  getdoor() {//查看上门券获取方式
    my.navigateTo({
      url: `/pages/shop/getDoor/getDoor`
    });
    this.setData({
      show_door: false,
    })
  },
  closemask_() {//关闭上门券不足提示
    this.setData({
      show_door: false,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
            url: '/pages/login/login?targetPath='+e
          });
        }
      },
    });
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