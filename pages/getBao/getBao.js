var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    people: 36560,
    flag: false,
    flag2: false,
    flag3: false
  },
  onLoad() {
    const _this = this
    request.post("user/rest/userSsb/getActivityList").then((res) => {
      res.data.data.forEach(function(item, index) {
        if (item.activityFlag == 1) {
          _this.setData({
            flag: true
          })
        }
        if (item.activityFlag == 2) {
          _this.setData({
            flag2: true
          })
        }
        if (item.activityFlag == 3) {
          _this.setData({
            flag3: true
          })
        }
      });
    })
    request.post("user/rest/user/getUserCount").then((res) => {
      if(res.data.code === 0){
        this.setData({
          people:res.data.data.userCount
        })
      }
      
    })
  },
  onReady() {
    my.setNavigationBar({
      title: '获取拾尚包',
      backgroundColor: '#108ee9',
    });
  },
  freeGet() {
    my.navigateTo({
      url: '/pages/freeGet/freeGet'
    });
  },
  buyBag() {
    my.navigateTo({
      url: '/pages/buyBag/buyBag'
    });
  }
});
