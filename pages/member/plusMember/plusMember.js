const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    num: 1,//数量
    total: 50,//总额
    add: {}, //地址数据
    addressStatus: false,//是否选择了上门地址的状态
    userInfo: {},
    userInfoMore: {},
    status: true,
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
  },
  onLoad(options) {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    let add = my.getStorageSync({
      key: 'add', // 缓存数据的key
    });
    if (add.data) {
      this.setData({
        addressStatus: true,
        add: add.data,
      })
    } else {
      this.setData({
        addressStatus: false,
        add: {},
      })
    }
    let userInfoMore = my.getStorageSync({
      key: 'userInfoMore', // 缓存数据的key
    });
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfoMore: userInfoMore.data,
      userInfo: userInfo.data,
      total: userInfoMore.data.bagPrice * this.data.num,
    })

  },
  buy() {
    let param = {
      bagNum: this.data.num,
      userId: this.data.userInfo.id,
      deliveryAddress: this.data.add.provinceName + this.data.add.cityName + this.data.add.areaName + this.data.add.address,
      deliveryMobile: this.data.add.userMobile,
      deliveryName: this.data.add.userName,
      purchaseItems: 'vip', 
    }
    this.setData({
      status: false,
    })
    request.post("order/rest/order/tradeCreate", param).then(res => {
      this.setData({
        status: true,
      })
      if (res.data.code == 0) {
        my.tradePay({
          tradeNO: res.data.data.tradeNo,
          success: function(res) {
            if (res.resultCode == 9000) {
              my.setStorage({
                key: 'activeIndex',
                data: 2,
                success: (res) => {
                },
              })
              my.showToast({
                type: 'none',
                content: "购买成功，可立即绑定拾尚包",
                duration: 1500,
                success: (res) => {
                },
              });
              setTimeout(function() {
                my.redirectTo({
                  url: `/pages/member/success/success`
                })
              }, 1500)
            } else if (res.resultCode == 6001) {
              my.showToast({
                type: 'none',
                content: "用户中途取消",
                duration: 2000,
              });
            }
          },
          fail: function(res) {
            // my.alert(res.resultCode);
          },
        });
      }
    });
  },
  toAddress() {
    my.navigateTo({
      url: `/pages/address/address?status=2`
    });
  },
  change() {
  },
  // 未开通普通会员用户
  onGetAuthorize(e) {
    const _this = this;
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
        const authCode = res.authCode;
        const data = {
          authCode: res.authCode,
          userId: _this.data.userInfo.id,
          userMobile: _this.data.userInfo.userMobile,  
        }
        request.post("user/rest/user/login", data).then(res => {
          if (res.data.code === 0) {
            my.setStorageSync({
              key: 'userInfo',
              data: res.data.data.userInfo,
            });
            _this.setData({
              userInfo: res.data.data.userInfo,
            });
            my.showToast({
              type: "none",
              content: "授权成功",
              duration: 1500,
            });
            _this.buy();
          }
        })
      }
    });
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
