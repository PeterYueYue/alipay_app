
const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    userInfo: {},//用户信息
    imgUrl1: app.globalData.imgUrl1,
    imgUrlNew: app.globalData.imgUrlNew,
    autoDisplay: true,
    addressStatus: true,
    add: {},//选择地址
    once: true,
    encodeData: '',//加密过后的数据
    quancode: '',//兑换券
    show: true,
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow: function () {
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
    }
    let add = my.getStorageSync({
      key: 'add', // 缓存数据的key
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
    if(app.globalData.encodeData == "") {
      my.alert({
        content: "未收到传参数据，请复制兑换码进入兑换中心激活"
      });
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
      deliveryAddress: this.data.add.address,
      province: this.data.add.cityName + this.data.add.areaName,
      deliveryMobile: this.data.add.userMobile,
      deliveryName: this.data.add.userName,
      pushId: this.data.pushId,
      sendFlag: e.currentTarget.dataset.status,
      userId: this.data.userInfo.id,
      userMobile: this.data.add.userMobile,
      userName: this.data.add.userName,
    };
    request.post("user/rest/userSsb/getScanBag", param).then(res => {
      that.setData({
        once: true,
      });
      if (res.data.code == 0) {
        my.showToast({
          type: 'none',
          content: '领取成功',
          duration: 1500,
          success: (res) => {
            my.navigateTo({
              url: '/pages/vouchers/success/success?param=' + that.data.quancode,
            })
          }
        });
      }
    });
  },
  onGetAuthorize(e) {
    let _this = this;
    _this.setData({
      autoDisplay: false,
    });
    my.getPhoneNumber({
      success: (res) => {
        const encryptedData = res.response;
        const param = {
          response: JSON.parse(encryptedData).response,
          sign: JSON.parse(encryptedData).sign,
          encodeData: app.globalData.encodeData,
          // encodeData: 'tk61NjOULF3Ijfje6GAwl8wc//+tgM6VkcuRMeaQgkX/b2WOLYg+3jkID8Z0i9DLkF/o7cEvEgV6zZdeFqALlPiH0G4O681tMW7cnSNFh5YNgZXIFCA+7dbd09xWqQQfDsif4FUkykXjhtSUSroA5TNiBw7qlIms0eu4nflYdY1xvCNcsTMPEueMNfWiJhQP8Ot1wSjVcEUWDILYy0JNiDxiKKUykURu'
        }
        request.post("user/rest/user/getUserPhone", param).then(res => {
          console.log(res.data.data.code)//获取到授权的券码
          if (res.data.code === 0) {
            //更新用户信息
            my.setStorageSync({
              key: 'userInfo',
              data: res.data.data.userInfo,
            });
            _this.setData({
              userInfo: res.data.data.userInfo,
              show: false,
            })
            if (res.data.data.code) {
              _this.setData({
                quancode: res.data.data.code,
              })
            }
            //更新用户手机号
            my.getAuthCode({
              scopes: ['auth_base'],
              success: (res) => {
                const data = {
                  authCode: res.authCode,
                  userId: _this.data.userInfo.id,
                  userMobile: _this.data.userInfo.userMobile,
                }
                request.post("user/rest/user/login", data).then(res => {
                  if (res.data.code === 0) {
                    _this.setData({
                      userInfo: res.data.data.userInfo,
                    });
                    my.setStorage({
                      key: 'userInfo',
                      data: res.data.data.userInfo,
                      success: (res) => {
                      },
                    });
                  }
                })
              },
            });
          }
          _this.setData({
            autoDisplay: true,
          })
        })
      },
      fail: (res) => {

      },
    });
  },
  // alipays://platformapi/startapp?appId=2019090967097603&page=pages/home/home
  // get(e) {
  //   let _this = this;
  //   if (!_this.data.addressStatus) {
  //     my.showToast({
  //       type: 'none',
  //       content: '请选择邮寄地址',
  //       duration: 1500
  //     });
  //   }
  //   let param = {
  //     deliveryAddress: this.data.add.address,
  //     province: this.data.add.cityName + this.data.add.areaName,
  //     deliveryMobile: _this.data.add.userMobile,
  //     deliveryName: _this.data.add.userName,
  //     pushId: _this.data.pushId,
  //     sendFlag: e.currentTarget.dataset.status,
  //     userId: _this.data.userInfo.id,
  //     userMobile: _this.data.add.userMobile,
  //     userName: _this.data.add.userName,
  //     sourceId: this.data.sourceId
  //   };
  //   request.post("user/rest/userSsb/getScanBag", param).then(res => {
  //     if (res.data.code == 0) {
  //       my.showToast({
  //         type: 'none',
  //         content: '领取成功',
  //         duration: 1500,
  //         success: function () {
  //           my.redirectTo({
  //             url: '/pages/index/index?common=bao'
  //           })
  //         }
  //       });
  //     }
  //   });
  // },
  toLogin() {
    my.confirm({
      title: '温馨提示',
      content: '您还未登录，确定去登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.navigateTo({
            url: '/pages/login/login'
          });
        }
      },
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