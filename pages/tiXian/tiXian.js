var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    pageIndex: 1,
    user: [],
    info: {},
    userInfo: {},
    total: 1,
    status: 0
  },
  onLoad() { },
  onShow() {
    let data = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfo: data.data
    })
    this.getList()
  },
  getList() {
    let prarm = {
      pageIndex: this.data.pageIndex,
      pageSize: 10,
      userId: this.data.userInfo.id
    }
    request.get("user/rest/withdraw/getWithdrawList", prarm).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        let status = 0
        if (res.data.data) {
          let list = []
          if (this.data.pageIndex == 1) {
            list = res.data.data.content
            if (res.data.data.content.length == 0) {
              status = 1
            }
          } else {
            list = [...this.data.user, ...res.data.data.content]
          }
          this.setData({
            user: list,
            total: res.data.data.totalPages,
            status
          })
        } else {
          this.setData({
            user: [],
            total: 1,
            status: 1
          })
        }
      }
    })
  },
  lower(e) {// 页面被拉到底部
    console.log(e)
    if ((this.data.pageIndex - 0) >= (this.data.total - 0)) {
      return false;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.getList()
  },
  onPullDownRefresh() {
    this.setData({
      pageIndex: 1,
      total: 1,
      status: 0
    })
    this.getList()
    my.stopPullDownRefresh();
  },
});
