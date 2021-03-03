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
  buy(e) {
    // member.registered 参数 userId，addressId
    if (!this.data.add.id) {
      my.showToast({
        type: "none",
        content: "请填写地址",
      });
      return;
    }
    let param = {
      userId: this.data.userInfo.id,
      addressId: this.data.add.id,
      sendFlag: e.currentTarget.dataset.status,
      oatly:  app.globalData.tianmao,
    }
    // this.setData({
    //   status: false,
    // })
    request.post("user/rest/user/member.registered?userId=" + param.userId + "&addressId=" + param.addressId+"&sendFlag="+param.sendFlag+"&oatly="+ param.oatly).then(res => {
      // this.setData({
      //   status: true,
      // })
      if (res.data.code == 0) {
        my.showToast({
            type: "none",
            content: "注册成功,您已是普通会员",
            duration: 1500,
            success: function () {
              my.navigateTo({
                url: `/pages/member/success/success`
              });
            }
          });
      }
    });
  },
 
  toAddress() {
    my.navigateTo({
      url: `/pages/address/address?status=2`
    });
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
            _this.buy(e);
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
