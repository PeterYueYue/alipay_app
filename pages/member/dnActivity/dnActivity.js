const request = require("../../../utils/request.js");
var app = getApp();
var time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [
      {
        url: "https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/dnActivity/banner1.png",
        title: "拾尚包普通款",
        subTitle: "每人限领取1个，产品规格：80*70*25(cm)",
        tips: ''
      },
      // {
      //   url: "https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/dnActivity/banner2.png",
      //   title: "拾尚包 X 达能联名款",
      //   subTitle: "限定款发完即止，仅限上海地区，每人限领取1个",
      //   tips: '回收换袋服务仅提供普通款拾尚包，如需收藏限定款，请勿交投使用。'
      // },
    ],
    current: 0,
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    add: {}, //地址数据
    addressStatus: false,//是否选择了上门地址的状态
    animationData: {},
    isShowBox: false,
    invitationId: "",
    bagCount: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({ invitationId: options.id })
    }

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
    let add = my.getStorageSync({ key: 'add' }); add = add.data;
    if (add) {
      this.setData({
        addressStatus: true,
        add: add,
      })
    } else {
      this.setData({
        addressStatus: false,
        add: {},
      })
    }
    let userInfoMore = my.getStorageSync({ key: 'userInfoMore' }); userInfoMore = userInfoMore.data;
    let userInfo = my.getStorageSync({ key: 'userInfo' }); userInfo = userInfo.data;
    this.setData({
      userInfoMore: userInfoMore,
      userInfo: userInfo,
      total: userInfoMore.bagPrice * this.data.num,
    })
    time = setInterval(() => {
      this.getBagCount();
    }, 10000)
  },
  getBagCount() {
    let data = { type: "newBag" }
    request.post("user/rest/user/typeRemainingNumber", data).then(res => {
      this.setData({ bagCount: res.data.data.number })
    })
  },
  onChange(e) {
    this.setData({ current: e.detail.current })
  },
  buy(e) {
    let that = this;
    if (!this.data.add.id) {
      my.showToast({
        type: "none",
        content: "请填写地址",
      });
      return;
    }
    // member.registered 参数 userId，addressId
    let param = {
      userId: this.data.userInfo.id,
      addressId: this.data.add.id,
      sendFlag: e.currentTarget.dataset.status,
      oatly:  app.globalData.tianmao,
    }
    if (this.data.add.cityName != '上海市' && e.currentTarget.dataset.status == 2) {
      my.showToast({
        type: "none",
        content: "当前区域暂未开通服务",
        duration: 1500,
      });
      return;
    }
    this.setData({
      status: true,
    })
    request.post("user/rest/user/member.registered?userId=" + param.userId+"&oatly="+ param.oatly + "&addressId=" + param.addressId + "&sendFlag=" + param.sendFlag + "&inviteesId=" + this.data.invitationId).then(res => {
      this.setData({
        status: false,
      })
      if (res.data.code == 0) {
        my.showToast({
          type: "none",
          content: "注册成功,您已是普通会员 ",
          duration: 1500,
          success: function () {
            that.updateInfoMore();
            // my.navigateTo({
            //   url: `/pages/member/success/success`
            // });
          }
        });
      }
    });
  },
  updateInfoMore() {
    let data = { userId: this.data.userInfo.id, }
    request.post("user/rest/user/getUserInfo", data).then(res => {
      if (res.data.code === 0) {
        my.setStorageSync({
          key: 'userInfoMore',
          data: res.data.data,
        });
        my.navigateTo({
          url: `/pages/member/success/success`
        });
      }
    })
  },
  toAddress() {
    my.navigateTo({
      url: `/pages/address/address?status=2`
    });
  },
  // 动画效果
  initAnimation(e) {
    let animation = my.createAnimation({
      duration: "200",
      timingFunction: "ease"
    });
    this.animation = animation;
    if (e.target.id == "shade") {
      animation.height("0rpx").step();
      this.setData({ isShowBox: false }, () => {
        this.setData({
          animationData: animation.export(),
        })
      })
    } else if (e.target.id == 'btnTap') {
      animation.height("428rpx").step();
      this.setData({ isShowBox: true }, () => {
        this.setData({
          animationData: animation.export(),
        })
      })
    }

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(time);
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