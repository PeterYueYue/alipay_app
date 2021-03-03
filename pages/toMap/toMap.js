var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    distance: '',//距离
    //地图配置
    // scale: 15,
    imgUrl: app.globalData.imgUrl,
    setting: {
      // 手势
      gestureEnable: 1,
      // 比例尺
      showScale: 0,
      // 指南针
      showCompass: 0,
      //双手下滑
      tiltGesturesEnabled: 1,
      // 交通路况展示
      trafficEnabled: 0,
      // 地图 POI 信息
      showMapText: 1

    },
    // longitude: 120.131441,
    // latitude: 30.279383,
    // markers: [],
    // includePoints: [
    //   {
    //     latitude: 30.279383,
    //     longitude: 120.131441
    //   },
    //   {
    //     latitude: 30.278134,
    //     longitude: 121.132351,
    //   }
    // ],
    includePadding: {
      left: 100, right: 100,
      top: 100, bottom: 100
    },
    orderInfo: [],

    id: ''
  },
  timer: '',
  onLoad(e) {
    console.log(e)
    this.setData({
      id: e.id
    })
  },
  onShow(e) {
    console.log()
    // let id = 'c04aa4215a4144009ebe3920518f0f4e'
    let id = this.data.id
    this.getOrderInfo(id)
    this.timer = setInterval(() => {
      this.getOrderInfo(id)
    }, 30000)
    // request.get(`order/rest/order/getReserveOrderDetail?orderId=c04aa4215a4144009ebe3920518f0f4e`).then(res => {
    //   console.log(res)
    //   if (res.data.code == 0) {
    //     res.data.data.markers = this.getMarkers(res.data.data.latitude, res.data.data.longitude, res.data.data.driveLat, res.data.data.driveLng)
    //     res.data.data.includePoints = this.getIncludePoints(res.data.data.latitude, res.data.data.longitude, res.data.data.driveLat, res.data.data.driveLng)
    //     this.setData({
    //       orderInfo: res.data.data
    //     })
    //     console.log(this.data.orderInfo)
    //   }
    // })
    // let distance = this.getDistance(30.279383, 120.131441, 30.278134, 121.132351);
    // this.setData({
    //   markers: [{
    //     iconPath: "/image/order/me.png",
    //     id: 9,
    //     latitude: 30.279383,
    //     longitude: 120.131441,
    //     width: 30.4,
    //     height: 40,

    //   }, {
    //     iconPath: "/image/order/car.png",
    //     id: 10,
    //     latitude: 30.278134,
    //     longitude: 121.132351,
    //     width: 50,
    //     height: 50,
    //     customCallout: {
    //       "type": 2,
    //       "descList": [{
    //         "desc": "小哥正在赶来",
    //         "descColor": "#1a1a1a"
    //       }, {
    //         "desc": "距离你",
    //         "descColor": "#666666"
    //       }, {
    //         "desc": `${distance}m`,
    //         "descColor": "#3aa5ff"
    //       }],
    //       "isShow": 1
    //     }
    //   }]
    // })
  },
  getOrderInfo(id) {
    request.get(`order/rest/order/getReserveOrderDetail?orderId=${id}`).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        res.data.data.markers = this.getMarkers(res.data.data.latitude, res.data.data.longitude, res.data.data.driveLat, res.data.data.driveLng)
        res.data.data.includePoints = this.getIncludePoints(res.data.data.latitude, res.data.data.longitude, res.data.data.driveLat, res.data.data.driveLng)
        this.setData({
          orderInfo: res.data.data
        })
        console.log(this.data.orderInfo)
      }
    })
  },
  getMarkers(latitude1, longitude1, latitude2, longitude2) {
    let distance = this.getDistance(latitude1, longitude1, latitude2, longitude2);
    return [{
      iconPath: this.data.imgUrl + "order/me.png",
      id: 9,
      latitude: latitude1,
      longitude: longitude1,
      width: 30.4,
      height: 40,

    }, {
      iconPath: this.data.imgUrl + "order/car.png",
      id: 10,
      latitude: latitude2,
      longitude: longitude2,
      width: 50,
      height: 50,
      customCallout: {
        "type": 2,
        "descList": [{
          "desc": "小哥正在赶来",
          "descColor": "#1a1a1a"
        }, {
          "desc": "距离你",
          "descColor": "#666666"
        }, {
          "desc": `${distance}m`,
          "descColor": "#3aa5ff"
        }],
        "isShow": 1
      }
    }]
  },
  getIncludePoints(latitude1, longitude1, latitude2, longitude2) {
    return [
      {
        latitude: latitude1,
        longitude: longitude1
      },
      {
        latitude: latitude2,
        longitude: longitude2,
      }
    ]
  },
  getDistance: function(lat1, lng1, lat2, lng2) {

    lat1 = lat1 || 0;

    lng1 = lng1 || 0;

    lat2 = lat2 || 0;

    lng2 = lng2 || 0;

    var rad1 = lat1 * Math.PI / 180.0;

    var rad2 = lat2 * Math.PI / 180.0;

    var a = rad1 - rad2;

    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;

    var r = 6378137;

    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)

  },
  cancel() {
    let id = this.data.orderInfo.id
    console.log(id)
    my.confirm({
      title: '温馨提示',
      content: '确定取消预约吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          request.get(`order/rest/order/cancelReserveOrder?orderId=${id}`).then((res) => {
            if (res.data.code == 0) {
              my.showToast({
                content: '取消成功',
                duration: 1500,
                success: (res) => {
                  my.navigateBack()
                },
              });
            }
          })
        }
      },
    });

  },
  call() {
    let tel = this.data.orderInfo.driveMobile
    console.log(tel)
    my.makePhoneCall({ number: tel });

  },
  onHide() {
    // 页面隐藏
    clearInterval(this.timer)
  },
  onUnload() {
    // 页面被关闭
    clearInterval(this.timer)
  },
});
