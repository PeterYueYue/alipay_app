var app = getApp();
const request = require("../../../utils/request.js");
var countTime = null
var countTime2 = null
Component({
  mixins: [],
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    userInfo: {
      userFlag: 1,
    },
    couponbox: app.globalData.imgUrlNew + 'yy/newIndex/member.png',
    background: [{
      'picUrl': app.globalData.imgUrl + 'banner.png'
    }, {
      'picUrl': app.globalData.imgUrl + 'banner.png'
    }],
    media: [],
    maskFlag: false,
    interval: 1000,
    pageIndex: 1, //媒体报道分页的当前页
    pageSize: 10, //每页条数
    total: "", //总页数
    orderState: true, //预约状态
    countTime: {}, //整点登录时间
    timeObj: { //显示的倒计时
      h: "00",
      m: "00",
      s: "00"
    },
    activityId: "",  //整点活动ID
    isActivity: false,  //活动是否开始
    totalGroupNo: 0,
    media: null,
    show_door: false,
    noticeList: [],//公告
    popWindowsObj: {},//弹窗
    popWindowsBool: false,//弹窗状态
    check: false,//兑换通道关闭通知
    isHasVou: false,
    isShowVouList: false,
    annualBill: false,//年度账单
  },
  props: {},
  onInit() {
    this.getAdvertList();
    this.getMediaList();
  },
  didMount() {
    this.init();
  },
  methods: {
    init() {
      this.checkBill();
      this.getNextVoucherActivityDate();//整点登录
      this.getTotalGroupNo();//环保团
      // 获取用户信息
      let userInfo = my.getStorageSync({ key: 'userInfo' });
      if (userInfo.data === null) {
        this.setData({
          userInfo: {
            userFlag: 1
          },
        })
        return false;
      }
      this.setData({
        userInfo: userInfo.data,
      });
      let data = {
        userId: userInfo.data.id
      }
      request.post("user/rest/user/getUserInfo", data).then(res => {
        if (res.data.code === 0) {
          my.setStorage({
            key: 'userInfoMore',
            data: res.data.data,
          });
          this.setData({
            userInfoMore: res.data.data,
          });
          if (res.data.data.userAddress) {
            my.setStorage({
              key: 'add', // 缓存数据的key
              data: res.data.data.userAddress,
            });
          }
        }
      })
      this.getSignInData();//获取签到信息
      this.noticeList();//获取公告信息
      this.popWindows();//获取首页弹窗
      this.getReserveIdByUserIdForVoucher(userInfo.data);// 补发优惠券
    },
    checkBill() {
      let annualBill = my.getStorageSync({ key: 'annualBill' }); annualBill = annualBill.data;
      if (annualBill === null) {
        this.setData({
          annualBill: true,
        })
      }
    },
    closebill() {
      this.setData({
        annualBill: false,
      })
      my.setStorage({
        key: 'annualBill',
        data: false,
      })
    },
    gobill() {
      if (!this.data.userInfo.id) {
        let path = this.data.userInfo.userFlag == 1 ? '/pages/annualBill/billOne/billOne' : '/pages/annualBill/bill/bill';
        this.toLogin(path);
        return false;
      }
      if (this.data.userInfo.userFlag == 1) {
        my.setStorage({
          key: 'annualBill',
          data: false,
        })
        my.navigateTo({
          url: '/pages/annualBill/billOne/billOne'
        })
      } else {
        my.setStorage({
          key: 'annualBill',
          data: false,
        })
        my.navigateTo({
          url: '/pages/annualBill/bill/bill'
        })
      }
    },
    useVou() {
      this.setData({ isHasVou: false })
      this.setData({ isShowVouList: true })
    },
    closeVou() {
      this.setData({ isShowVouList: false })
      this.setData({ isHasVou: false })

    },
    // 获取弹出层的预约订单号
    getReserveIdByUserIdForVoucher(userInfo) {
      request.post("order/rest/resserveOrder/getReserveIdByUserIdForVoucher", JSON.stringify({ id: userInfo.id })).then(res => {
        if (res.data.code === 0) {
          this.setData({ orderId: res.data.data.orderId })
          if (res.data.data.orderId) {
            this.setData({ isHasVou: true })
          }
        }
      })

    },
    noticeList() {
      request.get("user/rest/notice/carousel").then(res => {
        this.setData({ noticeList: res.data.data })
      });
    },
    popWindows() {
      request.get("user/rest/notice/popWindows").then(res => {
        if (res.data.data) {
          let obj = my.getStorageSync({
            key: 'popWindowsObj'
          });
          obj = obj.data;
          if (obj && obj.pic == res.data.data.pic || res.data.data.state == 0) {
            return false;
          }
          this.setData({
            popWindowsObj: res.data.data,
            popWindowsBool: true,
          })
          my.setStorage({
            key: 'popWindowsObj',
            data: res.data.data,
          });
        }
      });
    },
    closePop() {//关闭弹窗公告
      this.setData({ popWindowsBool: false });
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
    getTotalGroupNo() {//获取环保团人数
      request.post("user/rest/groups/getTotalGroupNo").then(res => {
        this.setData({
          totalGroupNo: res.data,
        })
      });
    },
    closemask_a() {
      this.setData({
        check: false,
      })
      my.setStorage({
        key: 'changeType',
        data: true,
      });
    },
    getVou() {//领券插件
      my.navigateTo({ url: 'plugin://myPlugin/index?pid=2019102468552682&appId=2019090266827440', })
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
        }
      });
    },
    //轮播图
    gobanner(e) {
      var _this = this;
      const id = e.target.dataset.id;
      const flag = e.target.dataset.flag;
      const url = e.target.dataset.url;
      switch (flag) {
        case 1:
          my.navigateTo({
            url: `/pages/webView/webView?id=${id}&url=${url}`
          });
          break;
        case 2:
          my.navigateTo({
            url: '/pages/bannerDetail/bannerDetail?id=' + id
          });
          break;
        case 4:
          if (e.target.dataset.url == "pages/personalRank/personalRank") {
            my.navigateTo({
              url: '/pages/personalRank/personalRank'
            });
          } else if (e.target.dataset.url == "pages/activity/survey/survey") {
            my.navigateTo({
              url: '/pages/activity/survey/survey'
            });
          } else if (e.target.dataset.url == "pages/vouchers/login/login") {
            _this.getLocationlvse();
          } else if (e.target.dataset.url == "pages/activity/wholeFamily/wholeFamily") {
            my.navigateTo({
              url: '/pages/activity/wholeFamily/wholeFamily'
            });
          } else {
            _this.getLocation();
          }
          break;
        case 3:
          my.ap.navigateToAlipayPage({
            path: url
          })
          break;
      }
    },
    getLocationlvse() {
      var _this = this;
      my.getLocation({
        success(res) {
          // 判断是否黄浦区用户参与 
          my.request({
            url: 'https://restapi.amap.com/v3/geocode/regeo?location=' + res.longitude + ',' + res.latitude + '&key=adb6b96a1e4855bb109049e15c291aa0&radius=1000&extensions=all',
            method: 'GET',
            success: function (res) {
              console.log(res.data.regeocode.addressComponent.district);
              if (res.data.regeocode.addressComponent.district == "黄浦区") {
                my.navigateTo({
                  url: '/pages/vouchers/login/login'
                });
              } else {
                my.showToast({
                  type: 'none',
                  content: "该活动仅限黄浦区用户参加",
                  duration: 1500,
                });
              }
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              // console.log(res);
            }
          })
        },
        fail() {
          my.alert({ title: '定位失败' });
        },
      })
    },
    //获取当前地理位置
    // getLocation() {
    //   var _this = this;
    //   my.getLocation({
    //     success(res) {
    //       // 判断是否上海用户参与 
    //       request.post(`user/rest/game1912/checkAddress?longitude=${res.longitude}&latitude=${res.latitude}`).then(res => {
    //         if (res.data.code === 0) {
    //           my.getStorage({
    //             key: 'userInfo',
    //             success: function (res) {
    //               if (res.data == null) {
    //                 _this.toLogin();
    //               } else {
    //                 my.navigateTo({
    //                   url: '../carnival/carnival'
    //                 });
    //               }
    //             },
    //             fail: function (res) {
    //               my.alert({ content: res.errorMessage });
    //             }
    //           });
    //         }
    //       });
    //     },
    //     fail() {
    //       my.alert({ title: '定位失败' });
    //     },
    //   })
    // },
    appointment() { //预约
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/appointment/appointment')
        return false
      }
      my.navigateTo({
        url: '/pages/appointment/appointment'
      });
    },
    onClick() {//签到中心
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/shop/signIn/signIn')
        return false
      }
      my.navigateTo({
        url: `/pages/shop/signIn/signIn`
      });
    },
    goMember() { //成为会员
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/member/member/member')
        return false
      }
      my.navigateTo({
        url: '/pages/member/member/member'
      });
    },
    lookCoupon() {//查看卡券
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/vouchers/typeList/typeList')
        return false
      }
      my.navigateTo({
        url: '/pages/vouchers/typeList/typeList'
      });
    },
    donate() {//爱心捐赠
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/activity/donate/donate')
        return false
      }
      my.navigateTo({
        url: `/pages/activity/donate/donate`
      });
    },
    getSignInData() {
      request.get('user/rest/signIn/signInfo', { userId: this.data.userInfo.id }).then((res) => {
        this.setData({ signInData: res.data })
      })
    },
    tiXian() { //兑换
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/index/index?common=bao')
        return false
      }
      this.props.onSwitchTab('bao');
    },
    gotiXian() {//企业兑换
      if (!this.data.userInfo.id) {
        this.toLogin(`/pages/withdrawal/withdrawal`)
        return false
      }
      my.navigateTo({//兑换拾尚币
        url: `/pages/withdrawal/withdrawal`
      });
    },

    goZddlu() { //进入整点登录
      if (!this.data.userInfo.id) {
        this.toLogin(`/pages/vouchers/timelogin/timelogin?id=${this.data.activityId}`)
        return false
      }
      my.navigateTo({
        url: `/pages/vouchers/timelogin/timelogin?id=${this.data.activityId}`
      });
    },
    goRank() { //进入环保推广排行榜
      my.navigateTo({
        url: `/pages/member/memberRank/memberRank`
      });
    },
    goMdActivity() {
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/member/mdActivity/mdActivity')
        return false
      }
      my.navigateTo({
        url: `/pages/member/mdActivity/mdActivity`
      });
    },
    godnlog() {//脉动活动
      if (!this.data.userInfo.id) {
        this.toLogin('/pages/member/dnLog/dnLog')
        return false
      }
      my.navigateTo({
        url: "/pages/member/dnLog/dnLog"
      });
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
              url: '/pages/login/login?targetPath=' + e
            });
          }
        },
      });
    },
    goSenlin() {
      my.ap.navigateToAlipayPage({
        appCode: 'antForest',
        appParams: {
          autoShowProps: 1 //可选参数，等1时，默认打开开启森林背包
        },
        success: (res) => {
        },
        fail: (res) => {
        }
      });
    },
    rule() {//回收规则
      my.navigateTo({
        url: `/pages/webView/webView?url=${'https://miniapp.shishangbag.vip/recycle_rule/index.html'}`
      });
    },
    step() {//操作流程
      my.navigateTo({
        url: `/pages/webView/webView?url=${'https://miniapp.shishangbag.vip/operation_step/index.html'}`
      });
    },
    site() { //环保体验站
      my.navigateTo({
        url: '/pages/site/site'
      });
    },
    sort() { //分类查询
      my.navigateTo({
        url: '/pages/sort/sort'
      });
    },
    area() { //服务区域
      my.navigateTo({
        url: '/pages/area/area'
      });
    },
    rank() { //机构排行
      my.navigateTo({
        url: '/pages/rank/rank'
      });
    },
    closemask() {
      this.setData({
        maskFlag: false
      })
    },
    information(e) { //媒体报道
      let mediaFlag = e.currentTarget.dataset.mediaFlag
      let id = e.currentTarget.dataset.id
      let url = e.currentTarget.dataset.url
      if (mediaFlag == 2) {
        // 内容
        my.navigateTo({
          url: `/pages/information/information?id=${id}`
        });
      } else if (mediaFlag == 1) {
        // H5
        my.navigateTo({
          url: `/pages/mediaLink/mediaLink?id=${id}&url=${url}`
        });
      } else {
        // 生活号
        my.ap.navigateToAlipayPage({
          path: url
        })
      }
    },
    // carnival() {
    //   var _this = this;
    //   my.getLocation({
    //     success(res) {
    //       // 判断是否上海用户参与 
    //       request.post(`user/rest/game1912/checkAddress?longitude=${res.longitude}&latitude=${res.latitude}`).then(res => {
    //         if (res.data.code === 0) {
    //           my.getStorage({
    //             key: 'userInfo',
    //             success: function (res) {
    //               if (res.data == null) {
    //                 _this.toLogin();
    //               } else {
    //                 my.navigateTo({
    //                   url: '../carnival/carnival'
    //                 });
    //                 _this.setData({
    //                   maskFlag: false
    //                 })
    //               }
    //             },
    //             fail: function (res) {
    //               my.alert({ content: res.errorMessage });
    //             }
    //           });
    //         } else {
    //           _this.setData({
    //             maskFlag: false
    //           })
    //         }
    //       });
    //     },
    //     fail() {
    //       my.alert({ title: '定位失败' });
    //     },
    //   })
    // },
    xiezai() {
      clearInterval(countTime)
      this.countTime = null;
      clearInterval(countTime2)
      this.countTime2 = null;
    },
    // 获取整点登录时间
    getNextVoucherActivityDate() {
      clearInterval(countTime)
      clearInterval(countTime2)
      request.get("user/rest/voucher/nextVoucherActivityDate").then(res => {
        if (res.data.code === 0) {
          this.setData({ countTime: res.data.data.residueSeconds });
          this.setData({ activityId: res.data.data.activityId });
          this.countDown(res.data.data.residueSeconds)
        }
      })

    },
    // 整点登录倒计时
    countDown(residueSeconds) {
      countTime = setInterval(() => {
        var time = residueSeconds--;
        this.setData({ residueSeconds: time })
        if (time <= 0) {
          this.setData({ isActivity: true })
          clearInterval(countTime)
          return
        }
        var min = Math.floor(time % 3600);
        var time1 = Math.floor(time / 3600) + "时" + Math.floor(min / 60) + "分" + time % 60 + "秒";
        let timeObj = {
          h: Math.floor(time / 3600) < 10 ? '0' + Math.floor(time / 3600) : Math.floor(time / 3600),
          m: Math.floor(min / 60) < 10 ? '0' + Math.floor(min / 60) : Math.floor(min / 60),
          s: time % 60 < 10 ? '0' + time % 60 : time % 60
        }
        this.setData({ timeObj: timeObj });
      }, 1000)

      countTime2 = setInterval(() => {
        this.getNextVoucherActivityDate()
      }, 30000)
    },
  },

  didUnmount() {
    clearInterval(countTime);
    clearInterval(countTime2);
    this.setData = () => {
      return;
    };
  },
  onPullDownRefresh() {
    // 页面被下拉
    this.setData({
      pageIndex: 1,
      total: '',
      media: []
    })
    this.getAdvertList();
    this.getMediaList();
    my.stopPullDownRefresh();
  },
  onReachBottom() {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    if ((this.data.total - 0) >= this.data.pageIndex) {
      this.getMediaList()
    }
  },
  onShareAppMessage() {
  },
});