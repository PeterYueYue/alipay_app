// pages/vouchers/friendsHelp/friendsHelp.js
const request = require("../../../utils/request.js");
var countTime  = null;
Page({
  data: {
    timeObj:{
      h: "00",
      m: "00",
      s: "00"
    },
    fdList:[],
    activInfo:{},
    mainUserId:'',
    isYq:false
  },
  onLoad: function (options) {
    console.log(options,"options")
    if (options.userId && options.activityId){
      this.setData({ mainUserId: options.userId})
      this.setData({ isYq:true})
      this.setData({ activityId: options.activityId })
    }else{
      my.showToast({
        type: 'none',
        content: '获取活动失败！',
        duration: 1500,
      });
    }
    
  },

  onReady: function () {

  },

  onShow: function () {
    this.init()
  },
  init(){
    let userInfo =  my.getStorageSync({
      key: 'userInfo'
    });
    if (userInfo.data) {
      this.setData({ userId: userInfo.data.id })
    }
    
    let data = JSON.stringify({ "userId": this.data.mainUserId ? this.data.mainUserId : userInfo.data.id })
    request.post(`user/rest/voucher/receiveAssistInfo`, data).then(res => {
      clearInterval(countTime)
      if (res.data.code === 0) {
        this.setData({ activInfo: res.data.data })
        this.setData({ fdList: res.data.data.list })
        this.setData({ countTime: res.data.data.leftTime.residueSeconds });
        this.countDown(res.data.data.leftTime.residueSeconds)
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
      this.setData({ timeObj: timeObj })
    }, 1000)
  },
  goFdHp(){
    my.redirectTo({
      url: `/pages/vouchers/friendsHelp/friendsHelp?activityId=${this.data.activityId}`
    });
  },
  helpAction(){
    let that = this;
    if (!this.data.userId){
      this.toLogin()
    }else{
      // 执行助力成功
      let userInfo = my.getStorageSync({
        key: 'userInfo'
      });
      userInfo = userInfo.data;
      let data = JSON.stringify({
        "forUserId":this.data.mainUserId,
        "userId":userInfo.id,
        "activityId":this.data.activityId 
        })
      request.post(`user/rest/voucher/receiveAssistVoucher`,data).then(res => {
        console.log(res);
        if (res.data.code ==0) {
          that.init();
          my.showToast({
            type: 'none',
            content: res.data.message,
            duration: 1500,
          });
        } else {
        }
      })
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
        }
      },
    });
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    this.init()
    my.stopPullDownRefresh();
  },
  onReachBottom: function () {
    
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: "点击助力，帮我拿下上门券吧，谢谢！",
        path: `pages/vouchers/friendsHelp/friendsHelp?activityId=${this.data.activityId}&userId=${this.data.userId}`,
        bgImgUrl: 'http://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/vouchers/shareHelp.png',
      }
    }

  }
})