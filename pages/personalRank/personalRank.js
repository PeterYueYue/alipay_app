var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    tabactive: 1,
    list1a: [],
    list1b: [],
    total: '',
    imgUrl: app.globalData.imgUrl,
  },
  onLoad() {
    my.setNavigationBar({
      title: '环保排行榜',
      backgroundColor: '#108ee9',
    });
  },
  onShow() {

    request.get("user/rest/user/getCompanyRank").then(res => {
      console.log(res)
      if (res.data.code == 0) {
        console.log(res.data.data)
        // res.data.data.totalWeight = res.data.data.totalWeight.toFixed(2)
        res.data.data.forEach((item, i) => {
          // console.log(item)
          item.totalWeight = item.totalWeight.toFixed(2)
        })
        this.setData({
          list1a: res.data.data,
          list1b: res.data.data.slice(3),
        })
      }
    })
    // this.getList2();
  }

});
