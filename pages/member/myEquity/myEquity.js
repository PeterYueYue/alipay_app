const request = require("../../../utils/request.js");
var app = getApp();
const picUrl = app.globalData.imgUrlNew + 'yy/equity/'
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    userInfo: {},
    userInfoMore: {},
    banner: [
      { src: app.globalData.imgUrlNew + 'yy/equity/1.png', name: '上门券' },
      { src: app.globalData.imgUrlNew + 'yy/equity/2.png', name: '拾尚包' },
      { src: app.globalData.imgUrlNew + 'yy/equity/3.png', name: '券礼包' },
      { src: app.globalData.imgUrlNew + 'yy/equity/5.png', name: '抽奖机会' },
      // { src: app.globalData.imgUrlNew + 'yy/equity/4.png', name: '九折商城券' },
      // { src: app.globalData.imgUrlNew + 'yy/equity/6.png', name: '大家电返利' },
      // { src: app.globalData.imgUrlNew + 'yy/equity/7.png', name: '捐赠运费补助' },
      // { src: app.globalData.imgUrlNew + 'yy/equity/8.png', name: '周边赠送' },
    ],
    current: 2,//轮播图下标
    intro: {
      title: "LV1 环保市民可拥有此权益",
      desc: "正确回收完成后赠送券礼包",
      detail: [
        "1. Lv1 环保市民专有权益，成为拾尚回收会员后可获得3张免费上门券。 ",
        "2. 上门券在预约回收时自动使用，使用后拾尚回收将承担本次物流运费。"
      ]
    }
  },
  onLoad(e) {
    if (e.current) {
      let current = parseInt(e.current)
      this.checkLevel(current);
      this.setData({
        current: current
      })
    }
  },
  onReady() {
  },
  onShow() {// 页面显示
    let userInfo = my.getStorageSync({ key: 'userInfo', }); userInfo = userInfo.data;
    let userInfoMore = my.getStorageSync({ key: 'userInfoMore', }); userInfoMore = userInfoMore.data;
    if (!userInfo) {
      this.toLogin();
      return false;
    }
    this.setData({
      userInfo: userInfo,
      userInfoMore: userInfoMore,
    })
  },
  onChange: function (e) {
    this.setData({
      current: e.detail.current,
    });
    this.checkLevel(e.detail.current);
  },
  go(e) {
    let value = e.target.dataset.name;
    switch (value) {
      case '抽奖':
        my.navigateTo({
          url: '/pages/activity/lottery/lottery'
        });
        break;
      case '查看券列表':
        my.navigateTo({
          url: '/pages/vouchers/typeList/typeList'
        });
        break;
        case '领取':
        my.navigateTo({
          url: `/pages/member/dnActivity/dnActivity`
        });
        break;
      default:
        break;
    }

  },
  checkLevel(e) {
    let that = this;
    switch (e) {
      case 0://上门券
        that.setData({
          intro: {
            title: "LV1 环保市民可拥有此权益",
            desc: "正确回收完成后赠送券礼包",
            detail: [
              "1.Lv1 环保市民专有权益，成为拾尚回收会员后可获得3张免费上门券。",
              "2.上门券在预约回收时自动使用，使用后拾尚回收将承担本次物流运费。",
            ]
          }
        })
        break;
      case 1://拾尚包
        that.setData({
          intro: {
            btn: '领取',
            title: "LV1 环保市民可拥有此权益",
            desc: "赠送拾尚包一个",
            detail: [
              "1.Lv1 环保市民专有权益，完成答题任务成为拾尚回收会员后可获得1个拾尚包。",
              "2.拾尚包为共享循环使用产品，每次回收时工作人员提供换袋服务。",
            ]
          }
        })
        break;
      case 2://券礼包
        that.setData({
          intro: {
            title: "LV1 环保市民可拥有此权益",
            desc: "正确回收完成后赠送券礼包",
            detail: [
              "1.券礼包包含1张上门券、1张衣物回馈券、1张软塑包装回馈券、1张复合纸包装回馈券、1张9.5折商城券。",
              "2.每次正确回收后即可获得券礼包。",
              "3.上门券在预约回收时自动使用，使用后拾尚回收将承担本次物流运费。",
              "4.衣物回馈券在预约回收时需手动勾选使用，使用后本次投递衣物按10拾尚币/kg结算。",
              "5.软塑包装回馈券在预约时需手动勾选使用，使用后本次投递软塑包装回馈10拾尚币。",
              "6.复合纸包装回馈券在预约时需手动勾选使用，使用后本次投递复合纸包装回馈10拾尚币。",
              "7.9.5折商城券可在福利中心兑换商品时使用，全场商品享9.5折优惠。",
            ]
          }
        })
        break;
      case 3://抽奖机会
        that.setData({
          intro: {
            btn: '抽奖',
            title: "LV2 环保志愿者可拥有此权益",
            desc: "每次回收完成享有抽奖机会",
            detail: [
              "1.Lv2至Lv6专有权益，各个等级享有不同数量的抽奖机会。",
              "2.Lv2回收完成享1次抽奖机会、Lv3回收完成享2次抽奖机会、Lv4回收完成享3次抽奖机会、Lv5回收完成享4次抽奖机会、Lv6回收完成享5次抽奖机会。",
              "3.抽奖机会不可累计，请在回收完成后立即使用。",
            ]
          }
        })
        break;
      // case 4://商城券
      //   that.setData({
      //     intro: {
      //       title: "LV2 环保志愿者可拥有此权益",
      //       desc: "升级送9折商城优惠券",
      //       detail: [
      //         "1. Lv2至Lv6专有权益，各个等级享有不同数量的9折商城优惠券。",
      //         "2. Lv2赠送3张9折商城优惠券、Lv3赠送4张9折商城优惠券、Lv4赠送5张9折商城优惠券、Lv5赠送6张9折商城优惠券、Lv6赠送7张9折商城优惠券。",
      //         "3. 9折商城券可在福利中心兑换商品时使用，全场商品享9折优惠。",
      //       ]
      //     }
      //   })
      //   break;

      // case 5://大家电返利
      //   that.setData({
      //     intro: {
      //       title: "LV3 环保达人可拥有此权益",
      //       desc: "大家电回收完成后可领取返利",
      //       detail: [
      //         "1. Lv3至Lv6专有权益，大家电回收完成后可领取返利。",
      //         "2. 返现不可累计，请在大家电回收完成后立即领取。"
      //       ]
      //     }
      //   })
      //   break;
      // case 6://运费补助
      //   that.setData({
      //     intro: {
      //       title: "LV4 环保明星可拥有此权益",
      //       desc: "捐赠审核完成后可领取运费补助",
      //       detail: [
      //         "1. Lv4至Lv6专有权益，捐赠审核完成后可领取运费补助。",
      //         "2. 运费补助不可累计，请在捐赠审核完后后立即领取。"
      //       ]
      //     }
      //   })
      //   break;
      // case 7://周边
      //   that.setData({
      //     intro: {
      //       title: "LV5 环保大使可拥有此权益",
      //       desc: "领取限量周边",
      //       detail: [
      //         "1. Lv5至Lv6专有权益，升级完后后可领取限量周边一份。"
      //       ]
      //     }
      //   })
      //   break;
      default:
        break;
    }

  },
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
        } else {
          my.redirectTo({
            url: '/pages/index/index'
          });
        }
      },
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
