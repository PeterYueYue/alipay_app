var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrls: '',
    totalAmount: "", //回收总收益
    list: {},
    imgUrl: app.globalData.imgUrl,
    name: '', //title "回收"，"预约"
    status: '', //状态值对应的状态
    type: '', //状态值
    delBtn: 1,//状态值 0显示 1不显示
    activeIndex: 1,
    items: [],
    money: 0,
    recycleDetailVo: [],
    totalWeighed: '',
    // errImgs:["../../image/order/3.png","../../image/order/3.png","../../image/order/3.png","../../image/order/3.png","../../image/order/3.png"],
    errImgs: [],
    weight1: 7,
    weight2: 6,
    weight3: 1,
    userInfo: {}
  },
  del(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    my.confirm({
      title: '温馨提示',
      content: '确定删除吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          if (name == "预约") {
            request.get(`order/rest/order/deleteReserveOrder?orderId=${id}`).then((res) => {
              if (res.data.code == 0) {
                my.navigateBack()
              }
            })
          } else {
            request.get(`order/rest/order/deleteRecycleOrder?orderId=${id}`).then((res) => {
              if (res.data.code == 0) {
                my.navigateBack()
              }
            })
          }
        }
      },
    });
  },
  //取消预约
  cancel(e) {
    let id = e.currentTarget.dataset.id
    my.confirm({
      title: '温馨提示',
      content: '确定取消预约吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          request.get(`order/rest/order/cancelReserveOrder?orderId=${id}`).then((res) => {
            if (res.data.code == 0) {
              my.navigateBack();
            }
          })
        }
      },
    });

  },
  onLoad(e) {
    this.status(e)
    this.setData({
      name: e.name,
      type: e.status,
      delBtn: e.delBtn
    })
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    console.log(userInfo)
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data
      })
    }
    console.log(this.data.userInfo.id)
  },
  status(e) {
    console.log(e)
    let imgUrl = app.globalData.imgUrl
    const _this = this
    switch (e.name) {
      case "回收":
        my.setNavigationBar({
          title: "订单回收"
        })
        request.get(`order/rest/order/getRecycleOrderDetail?orderId=${e.id}&userId=${this.data.userInfo.id}`).then((res) => {
          console.log(res)
          if (res.data.code == 0) {
            this.setData({
              list: res.data.data
            })
            switch (e.status) {
              case "1":
                let items = [{ title: "" }]
                items[0].title = "创建时间：" + res.data.data.createDate
                let activeIndex = items.length;
                 let totalWeighed = res.data.data.totalWeighed
                this.setData({
                  status: "待分拣",
                  items,
                  activeIndex,
                  imgUrls: imgUrl + "/order/15.png",
                  totalWeighed
                })
                break;
              case "2":
                items = [{ title: "" }, { title: "" }]
                items[0].title = "分拣时间：" + res.data.data.sortDate
                items[1].title = "创建时间：" + res.data.data.createDate
                activeIndex = items.length
                this.setData({
                  status: "已分拣",
                  items,
                  activeIndex,
                  imgUrls: imgUrl + "/order/15.png"
                })
                break;
              case "3":
                items = [{ title: "" }, { title: "" }, { title: '' }]
                items[0].title = "完成时间：" + res.data.data.successDate
                items[1].title = "分拣时间：" + res.data.data.sortDate
                items[2].title = "创建时间：" + res.data.data.createDate
                activeIndex = items.length
                let recycleDetailVo = res.data.data.recycleDetailVo
                res.data.data.recycleDetailVo.forEach(v => {

                  if (v.errorUrl) {
                    v.errorUrl = v.errorUrl.split(",")
                  }
                  v.totalWeighed = (Math.round((v.effectiveWeight - 0) * 100 + (v.errorWeight - 0) * 100) / 100).toFixed(2)
                })
                // if (res.data.data.recycleDetailVo[0].errorUrl) {
                //   this.setData({
                //     errImgs: res.data.data.recycleDetailVo[0].errorUrl.split(",")
                //   })
                //   // let a = res.data.data.recycleDetailVo[0].errorUrl.split(",")
                //   // console.log(a)
                // }
                // res.data.data.recycleDetailVo[0].totalWeighed = (parseFloat(res.data.data.recycleDetailVo[0].effectiveWeight) * 100 + parseFloat(res.data.data.recycleDetailVo[0].errorWeight) * 100) / 100;
                this.setData({
                  totalAmount: res.data.data.totalAmount,
                  status: "已完成",
                  recycleDetailVo,
                  items,
                  activeIndex,
                  imgUrls: imgUrl + "/order/10.png"
                })
                break;
            }
          }
        })
        break;
      case "预约":
        my.setNavigationBar({
          title: "订单预约"
        })
        request.get(`order/rest/order/getReserveOrderDetail?orderId=${e.id}`).then((res) => {
          console.log(res)
          if (res.data.code == 0) {
            this.setData({
              list: res.data.data
            })
            switch (e.status) {
              case "1":
                let items = [{ title: "" }, { title: "" }]
                items[0].title = "绑定时间：" + res.data.data.bdDate
                items[1].title = "预约时间：" + res.data.data.reserveTime
                let activeIndex = items.length
                this.setData({
                  status: "待回收",
                  items,
                  activeIndex,
                  imgUrls: imgUrl + "/order/15.png"
                })
                break;
              case "2":
                items = [{ title: "" }, { title: "" }, { title: '' }]
                items[0].title = "取消时间：" + res.data.data.cancelDate
                items[1].title = "预约时间：" + res.data.data.reserveTime
                items[2].title = "绑定时间：" + res.data.data.bdDate
                activeIndex = items.length
                this.setData({
                  status: "已取消",
                  items,
                  activeIndex,
                  imgUrls: imgUrl + "/order/6.png"
                })
                break;
              case "3":
                items = [{ title: "" }, { title: "" }, { title: '' }]
                items[0].title = "完成时间：" + res.data.data.successDate
                items[1].title = "预约时间：" + res.data.data.reserveTime
                items[2].title = "绑定时间：" + res.data.data.bdDate
                activeIndex = items.length
                let totalWeighed = res.data.data.totalWeighed
                this.setData({
                  status: "已完成",
                  items,
                  activeIndex,
                  imgUrls: imgUrl + "/order/10.png",
                  totalWeighed
                })
                break;
            }
          }
        })
        break;
    }
  }
});
