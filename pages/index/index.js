var app = getApp();
const request = require("../../utils/request.js");

Page({
  indexRef(ref) {
    this.index = ref;
  },
  baoRef(ref) {
    this.bao = ref;
  },
  orderRef(ref) {
    this.order = ref;
  },
  homeRef(ref) {
    this.home = ref;
  },
  selfRef(ref) {
    this.self = ref;
  },
  shopRef(ref) {
    this.shop = ref;
  },
  data: {
    // 首页
    type: 'index',
    maskFlag: true,
    media: [],
    pageIndex: 1, //媒体报道分页的当前页
    pageSize: 10, //每页条数
    total: "", //总页数
    background: [{
      'picUrl': app.globalData.imgUrl + 'banner.png'
    }, {
      'picUrl': app.globalData.imgUrl + 'banner.png'
    }],
    isIphoneX: false,
    type: "index",
    imgUrl1: app.globalData.imgUrl1,
    imgUrlNew: app.globalData.imgUrlNew,
    bagPopWindow: false,
    trueDeliverPopWindow: false,
  },
  //组件传方法
  onLoad(query) {
    // 初始 首页数据
    if (query.common) {
      this.onSwitchTab(query.common);
    }
    this.setData({ isIphoneX: app.data.isIphoneX })
  },
  onReady() {
  },
  onShow() {
    my.setNavigationBar({
      title: '拾尚回收',
      backgroundColor: '#108ee9',
    });
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    if (userInfo.data !== null) {
      userInfo = userInfo.data;
    }
    if (!userInfo && this.data.type !== 'index' && this.data.type !== 'home') {
      this.toLogin();
    } else if (userInfo) {
      this.initAuth(userInfo)
      // this.initWindow(userInfo)
    }
    switch (this.data.type) {
      case "index":
        if (this.index) {
          this.index.init();
        }
        break;
      case "bao":
        if (userInfo.userFlag == 1) {
          if (this.shop) {
            this.shop.init();
          }
        } else {
          if (this.bao) {
            this.bao.init();
          }
        }
        break;
      case "order":
        if (this.order) {
          this.order.init();
        }
        break;
      case "home":
        if (userInfo.userFlag == 1) {
          if (this.self) {
            this.self.init();
          }
        } else {
          if (this.home) {
            this.home.init();
          }
        }
        break;
      default:
        break;
    }
  },
  scan() {
    if (!this.data.userInfo.id) {
      this.toLogin()
      return false;
    }
    const that = this;
    my.scan({
      type: 'qr',
      success: (res) => {
        // IOT扫码
        // console.log(res.code);
        if (res.code.indexOf('encData=') != -1) {
          app.globalData.iotEncData = res.code.split('encData=')[1];
          my.navigateTo({
            url: '/pages/iot/login/login'
          });
          return
        }else if (res.code.indexOf('code=') !== -1) {//绑袋子
          let data = {
            userId: this.data.userInfo.id,
            bagCode: res.code.split('code=')[1],
          }
          request.post('user/rest/userSsb/userScanBag', data).then((res) => {
            if (res.data.code == 0) {
              my.showToast({
                type: 'none',
                content: "绑定成功",
                duration: 1500,
                success: (res) => {
                  my.navigateTo({
                    url: '/pages/bao/bao'
                  });
                },
              });
            }
          })
        } else if (res.code.indexOf('obi=') != -1) { // 脉动
          getApp().globalData.obi = res.code.split('obi=')[1];
          my.navigateTo({
            url: '/pages/activity/yciotScan/yciotScan'
          });
          return
        } else if (res.code.indexOf('danone') != -1) {  //脉动核销券
          request.post('user/open/iot/danoneCardCodeScan', JSON.stringify({
            userId: this.data.userInfo.id,
            cardCode: res.code
          })).then(res => {
            my.alert({
              title: res.data.message,
            });
          })
          return
        }

      }
    })
  },
  initAuth(userInfo) {
    this.setData({
      userInfo: userInfo,
      logins: true
    });
  },
  changePage(e) {
    let type = e.currentTarget.dataset.data;
    if (type != "index") {
      if (this.index) {
        this.index.xiezai();
      }
    }
    this.setData({ type: type });
    my.pageScrollTo({
      scrollTop: 0
    })
  },

  // 首页方法
  closemask() {
    this.setData({
      maskFlag: false
    })
  },
  onclearStorage() {
    my.clearStorage()
    this.setData({
      userInfoMore: {},
      userInfo: {
        userFlag: 1
      },
      logins: false
    })
    my.navigateTo({
      url: '/pages/login/login'
    });
  },
  // 切换TabBar
  onSwitchTab(e) {
    switch (e) {
      case "index":
        this.setData({ type: "index" })
        break;
      case "bao":
        this.setData({ type: "bao" })
        break;
      case "order":
        this.setData({ type: "order" })
        break;
      case "home":
        this.setData({ type: "home" })
        break;
    }
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
            url: '/pages/login/login?targetPath' + e
          });
        } else {
        }
      },
    });
  },
  //获取轮播图列表
  getAdvertList() {
    request.get("user/rest/banner/getAdvertList").then(res => {
      if (res.data.code === 0) {
        //区分微信和支付宝链接
        res.data.data = res.data.data.filter(item => item.bannerType == 1)
        this.setData({
          background: res.data.data,
        })
      }
    });
  },
  //获取媒体报道列表
  getMediaList() {
    let data = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    request.get("user/rest/banner/getMediaList", data).then(res => {
      if (res.data.code === 0) {
        //区分微信和支付宝链接
        res.data.data.content = res.data.data.content.filter(item => item.mediaType == 1)
        //注释代码
        // res.data.data.content.map((item, index) => {
        // if (item.introduction.length > 30) {
        //   item.introduction = item.introduction.slice(0, 27) + "..."
        // }
        // })
        if (this.data.pageIndex == 1) {
          let media = res.data.data.content
          this.setData({
            media,
            total: res.data.data.totalPages
          })
        } else {
          let list = this.data.media;
          let media = [...list, ...res.data.data.content]
          this.setData({
            media,
            total: res.data.data.totalPages
          })
        }
        // let list = this.data.media;
        // let media = [...list, ...res.data.data.content]
        // this.setData({
        //   media,
        //   total: res.data.data.totalPages
        // })
      }
    });
  },
  onHide() {
    if (this.index) {
      this.index.xiezai();
    }
  },
  onUnload() {
    if (this.index) {
      this.index.xiezai();
    }
  },
  // 下拉刷新集合
  onPullDownRefresh() {
    switch (this.data.type) {
      case "order":
        if (this.order) {
          this.order.onPullDownRefresh();
        }
        break;
      case "home":
        if (this.home) {
          this.home.onPullDownRefresh();
        }
        break;
      default:
        break;
    }
    my.stopPullDownRefresh();
  },
  // 初始化弹窗数据
  initWindow(userInfo) {
    let closeData = my.getStorageSync({
      key: 'closeData',
    })
    closeData = closeData.data;
    let newDate = {
      bagPopWindow: true,
      trueDeliverPopWindow: true,
    }
    if (!closeData) {
      my.setStorageSync({
        key: 'closeData',
        data: newDate,
      });
      closeData = newDate
    }
    this.setData({ closeData: closeData })
    if (userInfo.id) {
      request.post('user/rest/user/homePagePopWindow?userId=' + userInfo.id).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data
          if (closeData.bagPopWindow && data.bagPopWindow) {
            this.setData({ bagPopWindow: data.bagPopWindow })
          } else if (data.trueDeliverPopWindow) {
            this.setData({ trueDeliverPopWindow: data.trueDeliverPopWindow })
          }
        }
      })
    }
  },
  // 关闭按钮
  closebagPopWindow() {
    let closeData = my.getStorageSync({
      key: 'closeData'
    });
    closeData = closeData.data;
    this.setData({ bagPopWindow: false });
    closeData.bagPopWindow = false;
    my.setStorageSync({
      key: 'closeData',
      data: closeData,
    });
    this.initWindow(this.data.userInfo)
  },
  // 关闭按钮
  closetrueDeliverPopWindow() {
    this.setData({ trueDeliverPopWindow: false })
    request.post('user/rest/user/restTrueDeliverPopWindow?userId=' + this.data.userInfo.id).then((res) => {
      console.log(res, "--------")
    })

  },
  // 发放上门券
  shareSendticket() {
    this.closetrueDeliverPopWindow()
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    userInfo = userInfo.data;
    if (userInfo.id) {
      request.post('user/rest/user/sendDoorVoucherNoLimit?userId=' + userInfo.id + '&num=1').then((res) => { })
    }
  },
  goSetAdd(e) {
    my.navigateTo({
      url: '/pages/freePost/freePost',
    })
  },
  // 分享
  onShareAppMessage(e) {
    console.log(e);
    if (e.target.id == "share") {
      this.shareSendticket();
    }
    return {
      title: '拾尚回收',
      imageUrl: app.globalData.imgUrlNew + "yy/freePost/061505.png",
      path: `pages/index/index`,
    };

  },
});
