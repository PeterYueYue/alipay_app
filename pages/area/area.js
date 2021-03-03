const request = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    id: 0,
    latitude: 31.23,
    longitude: 121.48,
    width: 19,
    height: 31,
    scale:10,
    callout: {
      content: 'callout',
    },
    polygon: [],
    animationData: {},
    weightType:0
  },
  onLoad(query) {
  },
  onReady() {
    
  },
  onShow() {
    this.getList(0)
  },
  getDatalist(e){
    let weightType = e.currentTarget.dataset.data
    if (weightType == this.data.weightType){
      return
    }
    if (weightType == 1){
      this.setData({scale:7})
    }else{
      this.setData({ scale: 9 })
    }
    this.setData({ weightType: weightType})
    var animation = my.createAnimation({
      duration: 200,
      timeFunction: 'ease',
    })
    this.animation = animation
    this.animation.left(weightType == 1 ? '310rpx' : '0rpx').step()
    this.setData({
      animationData: animation.export()
    })
    
    this.getList(weightType)
  },
  getList(weightType){
    request.get("user/rest/serviceArea/getServiceArea?weightType=" + weightType).then(res => {
      if (res.data.code === 0) {
        const list = [];
        res.data.data.forEach(function (item, i) {
          item.fillColor = '#CC79D35C';
          item.width = 1;
          item.points = item.points;
          list.push(item);
        });
        this.setData({
          latitude: 31.23,
          longitude: 121.48,
          polygon: list,
        });
      }
    })
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
