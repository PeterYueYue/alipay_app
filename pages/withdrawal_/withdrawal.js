var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    value: '',
    imgUrl: app.globalData.imgUrl,
    checked: 1,
    userInfo: {},
    userInfoMore: {},
    limitFlag: true,
    status: true,
    cardNo: ''
  },
  onReady() {
    my.setNavigationBar({
      title: '提现',
      backgroundColor: '#108ee9',
    });
  },
  onShow() {
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key缓存数据的key
    });
    let userInfoMore = my.getStorageSync({
      key: 'userInfoMore', // 缓存数据的key
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
        userInfoMore: userInfoMore.data,
      })
    };
    let param = {
      userId: this.data.userInfo.id
    }
    request.post("user/rest/user/getUserInfo", param).then(res => {
      if (res.data.code === 0) {
        this.setData({
          cardNo: res.data.data.cardNo
        })
      }

    })
    this.setData({
      value: (this.data.userInfoMore.residueMoney - this.data.userInfoMore.redResidueMoney).toFixed(2),
    });
  },
  onChange(e) {
    if (e.detail.value == 'card'
    ) {
      this.setData({
        checked: 2,
        limitFlag: false,
        value: this.data.userInfoMore.residueMoney
      })
    }
    if (e.detail.value == 'zfb') {
      this.setData({
        checked: 1,
        limitFlag: true,
        value: (this.data.userInfoMore.residueMoney - this.data.userInfoMore.redResidueMoney).toFixed(2),
      })
    }
  },
  change(e) { // 全部提现按钮
    this.setData({
      value: e.detail.value,
    });
  },
  change1() { // 全部提现按钮
    this.setData({
      value: this.data.userInfoMore.residueMoney,
    });
  },
  push() {
    if (this.data.value === "") {
      my.showToast({
        type: 'none',
        content: "请输入提现金额",
        duration: 2000,
      });
      return false;
    }
    if (this.data.checked == 1 && ((this.data.value - 0) < (this.data.userInfoMore.withDrawPrice - 0))) {
      my.showToast({
        type: 'none',
        content: `提现金额不得少于${this.data.userInfoMore.withDrawPrice}元`,
        duration: 2000,
      });
      return false;
    }
    let dot = this.data.value.indexOf(".") + 1;
    if (dot > 0) {
      let count = this.data.value.length - dot;
      if (count >= 3) {
        my.showToast({
          type: 'none',
          content: "最低提现单位0.01元",
          duration: 2000,
        });
        return false;
      }
    }
    // if (this.data.value === "") {
    //   my.showToast({
    //     type: 'none',
    //     content: "请输入提现金额",
    //     duration: 2000,
    //   });
    //   return false;
    // }
    if (this.data.checked == 2) {//兴业银行卡号,如果没有 提现按钮先去添加银行卡号
      if (this.data.cardNo === "") {
        my.showLoading({
          content: "请先添加银行卡",
        });
        const that = this
        setTimeout(() => {
          my.hideLoading({
            page: that
          });
          my.navigateTo({
            url: '/pages/bank/bank'
          });
        }, 1500);
        return false;
      }
    }
    this.setData({
      status: false,
    })
    if (this.data.checked == 1) {//企业用户要此时支付宝授权
      this.login();
    } else {
      this.tixian();
    }

  },
  login() {
    const _this = this;
    my.getAuthCode({
      scopes: ['auth_base', 'auth_user',],
      success: (res) => {
        const param = {
          authCode: res.authCode,
          userId: this.data.userInfo.id,
        }
        request.post("user/rest/user/login", param).then(res => {
          if (res.data.code === 0) {
            // 拿到企业用户绑定的个人手机号的userId使用
            _this.tixian();
          }
        })
      },
    });
  },
  tixian() {
    let _this = this;
    let prarm = {
      withdrawFlag: this.data.checked,
      withdrawMoney: this.data.value,
      userId: this.data.userInfo.id,
    }
    //提现
    request.post("user/rest/withdraw/addWithdraw", prarm).then(res => {
      this.setData({
        status: true,
      })
      if (res.data.code === 0) {
        my.showToast({
          type: 'none',
          content: "操作成功,等待审核中",
          duration: 2000,
        });
        this.setData({
          value: '0.00'
        })
        let data = {
          userId: _this.data.userInfo.id
        }
        request.post("user/rest/user/getUserInfo", data).then(res => {
          if (res.data.code === 0) {
            _this.setData({
              userInfoMore: res.data.data
            })
            my.setStorage({
              key: 'userInfoMore', 
              data: res.data.data, 
            });

          }

        })
      } else {
        my.showToast({
          type: 'none',
          content: res.data.message,
          duration: 2000,
        });
      }
    });
  },
  fanxian() {
    my.navigateTo({
      url: `/pages/webView/webView?url=https://miniapp.shishangbag.vip/xingye/index.html`
    });
  }

})
