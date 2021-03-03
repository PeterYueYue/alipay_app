const request = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    userInfo: {},
    list: [],
    rankList: [],
    noList: false
  },
  onLoad() {
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfo: userInfo.data
    })
    const param = "gameId=1&userId=" + this.data.userInfo.id
    request.get("user/rest/game1912/rank?" + param).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        if (res.data.data.length == 0) {
          this.setData({
            noList: true
          })
        } else {
          this.setData({
            noList: false
          })
        }
        let list = [...res.data.data]
        list.splice(0, 3)
        this.setData({
          rankList: res.data.data,
          list
        })
      }
    });

  },
  onShow() { },
  tap() {
    my.showSharePanel()
  },
  onShareAppMessage() {
    return {
      title: '拾尚包',
      desc: '免费上门，专注回收，助力环保',
      path: 'pages/carnival/carnival',
      // imageUrl: '/image/share/huanbao.png',
      // bgImgUrl: '/image/share/huanbao.png',
    }
  },
  onShareAppMessage(e) {
    return {
      title: '拾尚包',
      desc: '免费上门，专注回收，助力环保',
      path: 'pages/index/index',
      imageUrl: this.data.imgUrl + 'carnival/share22.png',
      bgImgUrl: this.data.imgUrl + 'carnival/share22.png'
    }
  }
});
