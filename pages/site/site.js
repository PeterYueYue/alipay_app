var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    list: [],
    imgUrl: app.globalData.imgUrl,
    latitude: '',
    longitude: '',
    addressName: ''
  },
  onLoad() {
    this.getLocation()
  },
  onShow(){
    this.getLocation()
  },
  toMap(e) {
    let data = e.currentTarget.dataset.fullState
    let item = e.currentTarget.dataset.item
    switch (data) {
      case "4":
        break;
      default:
        // my.navigateTo({
        //   url: `/pages/map/map?latitude=${this.data.latitude}&longitude=${this.data.longitude}&addressName=${item.address + item.areaName + item.brancheName}`
        // });
        if (item.sitFlag == 3||item.sitFlag == 1||item.fullState != 1) {
          my.openLocation({
            longitude: item.longitude,
            latitude: item.latitude,
            name: item.brancheName,
            address: item.provinceName + item.areaName + item.address
          })
        }

        break
    }
  },
  //获取当前地理位置
  getLocation() {
    var _this = this;
    my.getLocation({
      success(res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude

        })
        _this.getList()
      },
      fail() {
        my.alert({ title: '定位失败' });
      },
    })
  },
  //获取站点列表
  getList() {
    const param = { latitude: this.data.latitude, longitude: this.data.longitude };
    request.get("user/rest/branches/getBranchesList", param).then(res => {
      if (res.data.code === 0) {
        this.setData({
          list: res.data.data.result

        })
      }
    });
  }
});
