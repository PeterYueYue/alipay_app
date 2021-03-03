Page({
  data: {
    id: 0,
    latitude: 31.279351,
    longitude: 121.427733,
    addressName:'',
    width: 19,
    height: 31,
    iconPath: '/image/mark_bs.png',
    markers: [],
    callout: {
      content: 'callout',
    },
  },
  onLoad(e) {
    this.setData({
      latitude: e.latitude && e.latitude,
      longitude: e.longitude && e.longitude,
      addressName:e.addressName && e.addressName
    })
    // const markers = [{
    //   id: 34,
    //   latitude: e.latitude&&e.latitude,
    //   longitude: e.longitude&&e.longitude,
    //   width: 19,
    //   height: 31,
    //   iconAppendStr:"",
    //   markerLevel: 2
    // }];
    // console.log(markers)
    // this.setData({
    //   markers: markers,
    // })
  },
  onReady() {
    // 页面加载完成
    // 使用 my.createMapContext 获取 map 上下文
    // this.mapCtx = my.createMapContext('map');
    // const markers = [{
    //   id: 34,
    //   latitude: 30.266786,
    //   longitude: 120.10675,
    //   width: 19,
    //   height: 31,
    //   iconAppendStr:"",
    //   markerLevel: 2
    // }];
    // this.setData({
    //   markers: markers,
    // })
    this.mapCtx = my.createMapContext('map');
    const markers = [{
      id: 34,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      width: 19,
      height: 31,
      iconAppendStr: "",
      iconPath:"/image/mark_bs.png",
      markerLevel: 2,
      label: {
        content: this.data.addressName,
        color: "#000000",
        fontSize: 14,
        borderRadius: 3,
        bgColor: "#ffffff",
        padding: 5,
      }
    }];
    this.setData({
      markers: markers,
    })

  },
  onShow() {
    // 页面显示
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
