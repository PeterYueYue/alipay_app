var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    tabactive: 1,
    list1a: [],
    list1b: [],
    list2a: [],
    list2b: [],
    userInfo: {},
    pageIndex: 1,
    pageSize: 15,
    total: '',
    imgUrl: app.globalData.imgUrl,
  },
  onLoad() {
    my.setNavigationBar({
      title: '环保排行榜',
      backgroundColor: '#108ee9',
    });
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfo: userInfo.data
    })
  },
  onShow() {

    request.get("user/rest/user/getCompanyRank").then(res => {
      if (res.data.code == 0) {
        console.log(res.data.data)
        res.data.data.forEach((item, i) => {
          item.totalWeight = item.totalWeight.toFixed(2)
        })
        this.setData({
          list1a: res.data.data,
          list1b: res.data.data.slice(3),
        })
      }
    })
    this.getList2();
  },
  tabactive(e) {
    this.setData({
      tabactive: e.currentTarget.dataset.index
    })
  },
  getList2() {
    console.log(this.data.userInfo.companyId)
    console.log(this.data.pageIndex)
    console.log(this.data.pageSize)
    let data = {
      companyId: this.data.userInfo.companyId,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    request.get("user/rest/user/getDepartmentWeight", data).then(res => {
      console.log(res)
      res.data.data.content.forEach((item, i) => {
        item.totalWeight = item.totalWeight.toFixed(2)
      })
      if (res.data.code == 0) {
        if (this.data.pageIndex == 1) {
          this.setData({
            list2a: res.data.data.content,
            list2b: res.data.data.content.slice(3),
            total: res.data.data.totalPages
          })
        } else {
          this.setData({
            list2a: [...this.data.list2a, ...res.data.data.content],
            list2b: [...this.data.list2b, ...res.data.data.content],
            total: res.data.data.totalPages
          })
        }
      }
    })
  },
  lower(e) {
    console.log(1)
    if (this.data.total <= this.data.pageIndex) {
      return false
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1

    })
    this.getList2();
  }

});
