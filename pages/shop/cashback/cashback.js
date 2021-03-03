const request = require("/utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl, 
    imgUrlNew: app.globalData.imgUrlNew, 
    userInfo: {},
    num: 0,//正确回收次数
    checkNum: 0,//已经领取正确回收次数
    list: [{},{},{},{},{},{}],//数据
    new: false,//是否已购买券
    isItQualified: false,//false表示未参与活动
    gray: false,//按钮置灰
  },
  onLoad() {},
  onShow() {
    this.init();
  },
  init() {
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfo: userInfo.data,
    })
    this.getList();
  },
  goRule() {
    my.navigateTo({
      url: `/pages/webView/webView?url=https://miniapp.shishangbag.vip/web_rule/thirty/index.html`
    });
  },
  getList() {//获取领取列表
    const that = this;
    const data = this.data.userInfo.id
    this.setData({gray: false});
    request.get("user/rest/userSsb/rechargeDiscountInfo?userId="+ data).then(res => {
      console.log(res.data.rechargeList);
      this.setData({
        list: res.data.rechargeList,
        isItQualified: res.data.isItQualified,
      })
      res.data.rechargeList.some( item =>{
        if(!item.isRecharge&&item.isRecycle) {
          that.setData({gray: true});
          return true
        } 
      });
    })
  },
  get() {
    const that = this;
    const data = this.data.userInfo.id
    request.get("user/rest/userSsb/receiveDiscount?userId="+ data).then(res => {
      console.log(res);
      if(res.data.code == 0) {//刷新列表
        that.getList();
      }
    })
  },
  buy() {//新人特惠购买拾尚包
    my.navigateTo({
      url: '/pages/member/nomalMemberSure/nomalMemberSure?type=1'
    });
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
