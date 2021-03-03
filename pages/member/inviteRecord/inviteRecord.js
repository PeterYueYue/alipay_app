const request = require("../../../utils/request.js");
var app = getApp();
Page({
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
    pageIndex1: 0,
    pageIndex2: 0,
    list1Length: 0,
    list2Length: 0,
    pageSize: 10,
  },
  onLoad(e) {
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let userInfo = my.getStorageSync({
      key: 'userInfo',
    });
    if (!userInfo.data) {
      return;
    }
    this.setData({
      userInfo: userInfo.data,
    })
    this.getSocreList();
    this.getTanList();
  },
  tab(e) {
    this.setData({
      activeTab: e.currentTarget.dataset.index,
      current: e.currentTarget.dataset.index,
    })
    my.setStorage({
      key: 'activeIndex',
      data: e.currentTarget.dataset.index,
      success: (res) => {
      },
    })
  },
  getSocreList () {// 获取我的团员列表
    request.post("user/rest/groups/getGroupUserInfo?leaderId="+this.data.userInfo.id).then(res => {
      if (res.data.code === 0) {
        this.setData({
          list1: res.data.data,
        })
        console.log(this.data.list1);
      }
    })
  },
  getTanList () {// 获取我的团列表
    request.post("user/rest/groups/getGroupsBasicInfo?userId="+this.data.userInfo.id).then(res => {
      console.log(res.data);
      if (res.data.code === 0 && res.data.data!=null) {
        let list = [];
        list.push(res.data.data);
        this.setData({
          list2: list,
        })
      } 
    })
  },
  lower() {
      let activeTab = this.data.activeTab
      switch (activeTab) {
        case 0:
          if ((this.data.pageIndex1 - 0) >= (this.data.total1 - 0)) {
            return false;
          }
          this.setData({
            pageIndex1: this.data.pageIndex1 + 1
          })
          this.getSocreList()
          break;
        case 1:
          if ((this.data.pageIndex2 - 0) >= (this.data.total2 - 0)) {
            return false;
          }
          this.setData({
            pageIndex2: this.data.pageIndex2 + 1
          })
          this.getTanList()
          break;
      }
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
      title: '拾尚包环保',
      desc: '拾尚包环保',
      bgImgUrl: app.globalData.imgUrlNew + "yy/member/shareImage.png",
      path: 'pages/member/help/help',
    };
  },
});
