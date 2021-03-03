const request = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    name: '',//姓名
    phone: '',//手机号
    code: '',//验证码
    getCode: false,
    sec: 60,
    msgId: '',
    userInfo: {},
    status: true,//提交成功
    imgUrl: app.globalData.imgUrl,
    timeStart: '',
    timeEnd: '',
    timer: ''
  },
  onLoad(query) {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
    } else {
      my.navigateTo({
        url: '/pages/login/login'
      })
    }
    this.setData({
      timeEnd: new Date().getTime()
    })
    // if (this.data.sec != 60) {
    //   this.setData({
    //     sec: this.data.sec - parseInt((this.data.timeEnd - this.data.timeStart) / 1000)
    //   }) 
    // }
    let time = this.data.sec - parseInt((this.data.timeEnd - this.data.timeStart) / 1000);
    if (time > 0) {
      this.setData({
        sec: time
      })
      this.setData({
        timer: setInterval(() => {
          this.setData({
            sec: this.data.sec - 1
          });
          if (this.data.sec === 0) {
            clearInterval(this.data.timer);
            this.setData({
              getCode: false,
              sec: 60
            });
          }
        }, 1000)
      })
    } else {
      this.setData({
        getCode: false
      })
    }
  },
  change(e) {
    const id = e.target.dataset.id
    switch (id) {
      case "1"://姓名
        this.setData({
          name: e.detail.value
        });
        break;
      case "2"://手机号
        this.setData({
          phone: e.detail.value
        });
        break;
      case "3"://验证码
        this.setData({
          code: e.detail.value
        });
        break;
      default:
        break;
    }
  },
  getCode() {//获取验证码
    let _this = this;
    if (this.data.phone == "") {
      my.showToast({
        type: 'none',
        content: '请输入手机号码',
        duration: 2000,
      });
      return false;
    }
    this.setData({
      getCode: true
    })
    let param = {
      mobile: this.data.phone,
      userId: this.data.userInfo.id,
      flag: 1,
    };
    request.post("user/rest/user/getCodeByMobile", param).then((res) => {
      console.log(res)
      if (res.data.code == 0) {
        // this.setData({
        //   msgId: res.data.data.messageId,
        // })
        my.setStorageSync({
          key: 'msgId', // 缓存数据的key
          data: res.data.data.messageId,
        });
        my.showToast({
          type: 'none',
          content: '已发送验证码，请注意查收',
          duration: 2000,
        })
      } else {
        this.setData({
          getCode: false
        })
      }
    })
    // const time = setInterval(() => {
    //   this.setData({
    //     sec: this.data.sec - 1
    //   });
    //   if (this.data.sec <= 0) {
    //     clearInterval(time);
    //     this.setData({
    //       getCode: false,
    //       sec: 60
    //     });
    //   }
    // }, 1000);
    this.setData({
      timer: setInterval(() => {
        this.setData({
          sec: this.data.sec - 1
        });
        if (this.data.sec === 0) {
          clearInterval(this.data.timer);
          this.setData({
            getCode: false,
            sec: 60
          });
        }
      }, 1000)
    })

  },
  push() {
    if (this.data.name === "") {
      my.showToast({
        type: 'none',
        content: '请输入姓名',
        duration: 2000,
      });
      return false;
    }
    if (this.data.phone === "") {
      my.showToast({
        type: 'none',
        content: '请输入手机号码',
        duration: 2000,
      });
      return false;
    }
    if (this.data.phone[0] != 1 ||this.data.phone.length!=11) {
      my.showToast({
        type: 'none',
        content: '请输入正确手机号码',
        duration: 2000,
      });
      return false;
    }
    if (this.data.code === "") {
      my.showToast({
        type: 'none',
        content: '请输入验证码',
        duration: 2000,
      });
      return false;
    }

    this.setData({
      status: false
    })
    if (my.getStorageSync({ key: 'msgId' }).data) {
      this.setData({
        msgId: my.getStorageSync({ key: 'msgId' }).data
      })
    }

    let prarm = {
      mobile: this.data.phone,
      msgId: this.data.msgId,
      realName: this.data.name,
      code: this.data.code,
      userId: this.data.userInfo.id,
      // remark: '暂无',  
    };

    request.post("user/rest/pushPeople/addPushPeople", prarm).then((res) => {
      this.setData({
        status: true
      })
      if (res.data.code == 0) {
        my.showToast({
          type: 'none',
          content: '申请成功,等待审核中',
          duration: 1500,
          success: () => {
            my.redirectTo({
              url: '/pages/index/index'
            })
          }
        });

      } else {
        // setTimeout(function() {
        //    my.switchTab({
        //     url: `/pages/index/index`
        //   })
        // },1500)
      }

    })

  },
  onHide() {
    // 页面隐藏
    clearInterval(this.data.timer)
    this.setData({
      timeStart: new Date().getTime()
    })
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
