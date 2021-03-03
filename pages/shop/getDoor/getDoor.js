const request = require("/utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    userInfo: {},
  },
  onLoad() { },
  onShow() {
    this.init();
  },
  init() {
    this.getNextVoucherActivityDate();
    let res = my.getStorageSync({
      key: 'userInfo'
    });
    if (res.data === null) {
      return false;
    }
    this.setData({
      userInfo: res.data,
    });
  },
  goMember() {//成为普通会员
    my.navigateTo({
      url: '/pages/member/member/member'
    });
  },
  goFocus() {//关注生活号
    
  },
  goFriend() {//好友助力
    my.navigateTo({
      url: '/pages/vouchers/friendsHelp/friendsHelp'
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
  getNextVoucherActivityDate() { // 获取活动id
    request.get("user/rest/voucher/nextVoucherActivityDate").then(res => {
      if (res.data.code === 0) {
        this.setData({ activityId: res.data.data.activityId });
      }
    })

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
        }
      },
    });
  },
  onPullDownRefresh() {

    my.stopPullDownRefresh()
  }

});
