const request = require("../../../utils/request.js");
var app = getApp();
Page({
  canvasRef(ref) {
    this.canvas = ref;
  },
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrl1: app.globalData.imgUrl1,
    imgUrlNew: app.globalData.imgUrlNew,
    activeTab: 0,
    share_mask: false,//分享蒙版
    userInfo: {},//
    canIUse: my.canIUse('button.open-type.getUserInfo'),
    visible: false,
    list1: [],//数据及页码
    list2: [],//数据及页码
    pageIndex1: 1,
    pageIndex2: 1,
    list1Length: 0,
    list2Length: 0,
    pageSize: 10,
    total1: "", //积分总数
    total2: "", //减碳总数
  },
  onLoad(e) {
    if(e.share_mask) {
      this.setData({ 
        share_mask: true,
      })
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.getSocreList();
    this.getTanList();
    let userInfo = my.getStorageSync({
      key: 'userInfo',
    });
    if (!userInfo.data) {
      return;
    }
    this.setData({
      userInfo: userInfo.data,
    })
  },
  goMethod () {
    my.navigateTo({
      url: `/pages/webView/webView?url=https://miniapp.shishangbag.vip/web_rule/index.html`
    });
  },
  tab(e) {
    this.setData({
      activeTab: e.currentTarget.dataset.index,
      current: e.currentTarget.dataset.index,
    })
    console.log(this.data.activeTab)
  },
  onChange(e) {
      // console.log(e.detail.current)
    this.setData({
      activeTab: e.detail.current
    })
    console.log(this.data.activeTab)
  },
  // 获取积分排行榜
  getSocreList () {
    request.post("user/rest/groups/pointRank?pageSize="+this.data.pageSize+"&pageIndex="+ this.data.pageIndex1).then(res => {
      if (res.data.code === 0) {
          let list = []
          if (this.data.pageIndex1 == 0) {
            list = res.data.data.content
          } else {
            let data = this.data.list1
            list = [...data, ...res.data.data.content]
          }
          this.setData({
            list1: list,
            total1: res.data.data.totalPages,
          })
      }
    })
  },
  // 获取减碳排行榜
  getTanList () {
    request.post("user/rest/groups/carbonReducingRank?pageSize="+this.data.pageSize+"&pageIndex="+ this.data.pageIndex2).then(res => {
      if (res.data.code === 0) {
          let list = []
          if (this.data.pageIndex2 == 0) {
            list = res.data.data.content
          } else {
            let data = this.data.list2
            list = [...data, ...res.data.data.content]
          }
          this.setData({
            list2: list,
            total2: res.data.data.totalPages,
          })
      }
    })
  },
  lower() {
      let activeTab = parseInt(this.data.activeTab);
      switch (activeTab) {
        case 0:
          if ((this.data.pageIndex1 - 0) >= (this.data.total1 - 0)) {
            return false;
          }
          this.setData({
            pageIndex1: this.data.pageIndex1 + 1
          })
          this.getSocreList();
          break;
        case 1:
          console.log(123)
          if ((this.data.pageIndex2 - 0) >= (this.data.total2 - 0)) {
            return false;
          }
          this.setData({
            pageIndex2: this.data.pageIndex2 + 1
          })
          this.getTanList();
          break;
      }
    },
  onInfo(){
    let userInfo = my.getStorageSync({
      key: 'userInfo',
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
    }
  },
  
  share () {//打开分享蒙版
    if(!this.data.userInfo.id) {
      this.toLogin();
      return;
    }
    this.setData({
      share_mask: true,
    })
  },
  close: function() {
    this.setData({ 
      visible: false,
      share_mask: false,
    })
  },
  guan() {
    this.setData({ 
      share_mask: false,
    })
  },
  shareQ() {//分享到朋友圈
    this.setData({ 
      visible: true,
      share_mask: false,
    });
    this.canvas.draw();
  },
  shareF() {//分享给朋友

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
            url: '/pages/login/login?targetPath='+e
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
      title: '拾尚回收',
      desc: '加入我的环保团队，为保护地球出一份力！',
      bgImgUrl: app.globalData.imgUrlNew + "yy/member/shareImage.png",
      path: 'pages/member/memberHelp/memberHelp?id='+ this.data.userInfo.id,
    };
  },
});
