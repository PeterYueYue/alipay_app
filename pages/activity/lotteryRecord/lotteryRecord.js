var app = getApp();
const request = require("../../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    pageIndex: 1,
    pageSize: 10,
    user: [],
    userInfo: {},
    totalData: {},
    status: 0,
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
    this.getList()
  },
  //查看券的详情
  goDetail(e) {
    console.log(e.target.dataset.data);
    if(e.target.dataset.data.giftCode==3 || e.target.dataset.data.giftCode==5) {
      my.navigateTo({
          url: `/pages/earnings/earnings`
      });
    }
    if(e.target.dataset.data.giftCode==2 || e.target.dataset.data.giftCode==6) {
      my.navigateTo({
          url: `/pages/vouchers/typeList/typeList`
      });
    }
  },
  getList() {
    let prarm = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize, 
      userId: this.data.userInfo.id,
    }
    request.post(`user/rest/lottery/myLotteryResult?pageIndex=${prarm.pageIndex}&pageSize=${prarm.pageSize}&userId=${prarm.userId}`).then(res => {
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
    if (status == 1) {
      my.navigateTo({
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
