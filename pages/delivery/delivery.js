var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    user: [],
    info: {},
    pageIndex: 1,
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
    request.get("order/rest/order/getErrOrderList", prarm).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        let status = 0
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
      }
    })
  },
  toDetail(e) {
    let name = e.currentTarget.dataset.name
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    my.navigateTo({
      // url: `/pages/orderDetail/orderDetail?name=${name}&status=${status}&id=${id}&delBtn=1`
      url: `/pages/recoveryOrder/recoveryOrder?orderId=${id}&userId=${this.data.userInfo.id}`
    });
  },
  onReachBottom() {// 页面被拉到底部
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
