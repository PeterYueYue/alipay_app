var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    pageIndex: 1,
    pageSize: 10,
    user: [],
    total: '',
    userInfo: {},
    totalData: {},
    status: 0
  },
  onLoad() {},
  onShow() {
    let data = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    if (data.data) {
      this.setData({
        userInfo: data.data
      })
    }
    this.getData()
    this.getList()
    let param = {
      pageIndex: 1,
      pageSize: 10,
      userId: this.data.userInfo.id
    }
  },
  getData() {
    let data = { userId: this.data.userInfo.id }
    request.post("user/rest/user/getUserInfo", data).then(res => {
      if (res.data.code === 0) {
        // res.data.data.totalMoney1 = res.data.data.totalMoney.toString().split(".")[0]
        // res.data.data.totalMoney2 = res.data.data.totalMoney.toString().split(".")[1] ? res.data.data.totalMoney.toString().split(".")[1] : "00"
        res.data.data.totalErrWeight1 = res.data.data.totalErrWeight.toString().split(".")[0]
        res.data.data.totalErrWeight2 = res.data.data.totalErrWeight.toString().split(".")[1] ? res.data.data.totalErrWeight.toString().split(".")[1] : "00"
        res.data.data.totalWeight1 = res.data.data.totalWeight.split(".")[0]
        res.data.data.totalWeight2 = res.data.data.totalWeight.split(".")[1] ? res.data.data.totalWeight.split(".")[1] : "00"
        this.setData({
          totalData: res.data.data
        })
      }
    })
  },
  getList() {
    let prarm = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
      userId: this.data.userInfo.id
    }
    // request.get("order/rest/order/getUserEarningsList", prarm).then(res => {
    request.get("user/rest/user/getEnarDetailList", prarm).then(res => {
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
    });
  },
  toDetail(e) {
    let name = e.currentTarget.dataset.name
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    console.log(id)
    if (status == 1) {
      my.navigateTo({
        // url: `../orderDetail/orderDetail?name=${name}&status=${status}&id=${id}&delBtn=1`
        url: `/pages/recoveryOrder/recoveryOrder?orderId=${id}&userId=${this.data.userInfo.id}`
      });
    }

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
      total: '',
      status: 0
    })
    this.getData()
    this.getList()
    my.stopPullDownRefresh();
  },
});
