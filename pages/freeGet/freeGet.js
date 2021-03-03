const request = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl, //图片访问地址
    num: 1,//数量
    total: 50,//总额
    add: {},//选择上门后的数据
    addressStatus: false,//是否选择了上门地址的状态
    userInfo: {},
    pushId: '',//地推人员Id
    sourceId: '',//绿色小程序传过来id
    userId: '',//邀请好友传过来的用户ID
    FollwersId: '',//邀请好友传过来的任务ID
    countdown: '',//倒计时
    endDate: '',
    flag: false,
    once: true,
  },
  timeout: '',
  onLoad(query) {
    if (app.globalData.pushId !== "") {
      this.setData({
        pushId: app.globalData.pushId,
      })
    }
    if (query && query.userId) {
      this.setData({
        userId: query.userId,
        FollwersId: query.FollwersId
      })
      // my.setNavigationBar({
      //   title: '参与红包活动'
      // })
    } 
  },
  onReady() {
    // 页面加载完成
    // this.finishTask()
    // 172800000
  },
  onShow() {
    let add = my.getStorageSync({
      key: 'add', // 缓存数据的key
    });
    // console.log(add)
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    // console.log(userInfo)
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
    } else {
      if (app.globalData.sourceId !== "") {
        return false;
      }
      my.showToast({  
        type: 'none',
        content: '您还未登录,请先授权登录', 
        duration: 2000,
        success: (res) => {
          my.navigateTo({
            url: '/pages/login/login'
          })
        },
      });
    }
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
    const param = {
      userId: userInfo.data.id
    }
    request.get("user/rest/userSsb/getBagTiming/" + userInfo.data.id).then(res => {
      if (res.data.code == 0) {
        // console.log(res.data.data)
        let time = new Date(res.data.data.replace(/\-/g, "/"));
        // time = new Date("2019-11-27 13:45:30")
        let endDate = time.getTime() + 172800000;//设置截止时间
        this.setData({
          endDate
        })
        this.countTime()
      }
    })

  },
  countTime() {
    var that = this;
    var date = new Date();
    var now = date.getTime();
    var end = that.data.endDate;
    var leftTime = end - now; //时间差
    // console.log(leftTime)                              
    var d, h, m, s, ms;
    if (leftTime >= 0) {
      h = Math.floor(leftTime / 1000 / 60 / 60);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      ms = Math.floor(leftTime % 1000);
      ms = ms < 100 ? "0" + ms : ms
      s = s < 10 ? "0" + s : s
      m = m < 10 ? "0" + m : m
      h = h < 10 ? "0" + h : h
      that.setData({
        countdown: `${h}:${m}:${s}:${ms}`,
        flag: true
      })
      this.timeout = setTimeout(that.countTime.bind(that), 50);
    } else {
      this.setData({
        flag: false
      })
    }

    // console.log(that.data.countdown)
    //递归每秒调用countTime方法，显示动态时间效果

  },

  toAddress() {//选择地址
    my.navigateTo({
      url: `/pages/address/address?status=2`
    });
  },
  freeGet(e) {//免费邮寄
    //地推人员id要修改
    var that = this;
    if (!this.data.once) {
      return false;
    }
    this.setData({
      once: false,
    });
    if (this.data.addressStatus) {
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
        sourceId: this.data.sourceId
      };
      request.post("user/rest/userSsb/getScanBag", param).then(res => {
        that.setData({
          once: true,
        });
        if (res.data.code == 0) {
          app.globalData.sourceId = '';
          my.showToast({
            type: 'none',
            content: '领取成功,您现在有可绑定的袋子了',
            duration: 1500
          });
          my.setStorage({
            key: 'activeIndex',
            data: 2,
            success: (res) => {
            },
          });
          setTimeout(function () {
            // my.switchTab({
            //   // url: `/pages/order/order`
            //   url: `/pages/bao/bao`
            // })
            my.redirectTo({
              url: '/pages/bao/bao'
            })

          }, 1500)
          // 领取成功完成任务
          if (this.data.userId) {
            this.finishTask();
          }
        }
      });
    } else {
      my.showToast({
        type: 'none',
        content: '请选择邮寄地址',
        duration: 1500
      });
    }

  },
  banka() {
    my.navigateTo({
      url: `/pages/webView/webView?url=https://miniapp.shishangbag.vip/xingye/index.html`
    });
    // my.navigateTo({
    //   url: `/pages/webView/webView?url=https://e.cib.com.cn/app/mobile/public/sendDebit/sendDebit.do?chnlNo=05`
    // });

  },
  // 个人授权
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
              key: 'userInfo', // 缓存数据的key
              data: res.data.data.userInfo, // 要缓存的数据
              success: (res) => {
              },
            });
            _this.setData({
              userInfo: res.data.data.userInfo,
            });
          }
        })
        _this.get(e);
      }
    });
  },
  // onGetAuthorize(e) {
  //   const _this = this;
  //   my.getPhoneNumber({
  //     success: (res) => {
  //       const encryptedData = res.response;
  //       const param = {
  //         userId: _this.data.userInfo.id,
  //         response: JSON.parse(encryptedData).response,
  //         sign: JSON.parse(encryptedData).sign,
  //       }
  //       request.post("user/rest/user/getUserPhone", param).then(res => {
  //         if (res.data.code === 0) {
  //           // 更新用户手机号
  //           my.getAuthCode({
  //             scopes: ['auth_base'],
  //             success: (res) => {
  //               request.post("user/rest/user/login", { "authCode": res.authCode }).then(res => {
  //                 if (res.data.code === 0) {
  //                   _this.setData({
  //                     userInfo: res.data.data.userInfo,
  //                   });
  //                   my.setStorage({
  //                     key: 'userInfo', // 缓存数据的key
  //                     data: res.data.data.userInfo, // 要缓存的数据
  //                     success: (res) => {
  //                     },
  //                   });

  //                 }
  //               })
  //             },
  //           });
  //           _this.get();
  //         }
  //       })
  //     },
  //     fail: (res) => {

  //     },
  //   });
  // },
  get (e) {
    let _this = this;
      if (_this.data.addressStatus) {
      let param = {
        deliveryAddress: this.data.add.address,
        province: this.data.add.cityName + this.data.add.areaName,
        deliveryMobile: _this.data.add.userMobile,
        deliveryName: _this.data.add.userName,
        pushId: _this.data.pushId,
        sendFlag: e.currentTarget.dataset.status,
        userId: _this.data.userInfo.id,
        userMobile: _this.data.add.userMobile,
        userName: _this.data.add.userName,
        sourceId: this.data.sourceId
      };
      request.post("user/rest/userSsb/getScanBag", param).then(res => {
        if (res.data.code == 0) {
          app.globalData.sourceId = '';
          my.showToast({
            type: 'none',
            content: '领取成功,您现在有可绑定的袋子了',
            duration: 1500
          });
          my.setStorage({
            key: 'activeIndex',
            data: 2,
            success: (res) => {
            },
          });
          setTimeout(function () {
            // my.switchTab({
            //   // url: `/pages/order/order`
            //   url: `/pages/bao/bao`
            // })
            my.redirectTo({
              url: '/pages/bao/bao'
            })
          }, 1500)
          // 领取成功完成任务
          if (this.data.userId) {
            this.finishTask();
          }
        }
      });
    } else {
      my.showToast({
        type: 'none',
        content: '请选择邮寄地址',
        duration: 1500
      });
    }
  },

  finishTask() {
    const param = {
      FollwersId: this.data.FollwersId,
      id: this.data.userId
    }
    // 邀请分享完成任务(双拾二活动专用)
    my.request({
      url: `${request.localhost}user/rest/game1912/task/save?userId=${param.id}&taskId=${param.FollwersId}`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': my.getStorageSync('token'),
      },
      success: function (res) {
        this.setData({
          userId: ''
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }

    });

  },
  onHide() {
    clearTimeout(this.timeout)
  },
  onUnload() {
    // 页面隐藏
    console.log(this.timeout)
    console.log(11)
    clearTimeout(this.timeout)
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
