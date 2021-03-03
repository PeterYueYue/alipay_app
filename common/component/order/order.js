const request = require("/utils/request.js");
var app = getApp();
Component({
  mixins: [],
  data: {
    activeTab: 0,
    current: 0,
    total1: "", //回收总页数
    total2: "", //预约总页数
    total3: "", //交易总页数
    userId: '', //用户id
    imgUrl: app.globalData.imgUrl, //图片路径
    imgUrlNew: app.globalData.imgUrlNew, //图片路径
    pageIndex1: 1, //回收订单当前页码
    pageIndex2: 1, //预约订单当前页码
    pageIndex3: 1, //交易订单当前页码
    pageSize: 10, //每页十条数据
    list1: [],
    list2: [],
    list3: [],
    list1Length: 0,
    list2Length: 0,
    list3Length: 0,
    //地图配置
    // scale: 15,
    setting: {
      // 手势
      gestureEnable: 0,
      // 比例尺
      showScale: 0,
      // 指南针
      showCompass: 0,
      //双手下滑
      tiltGesturesEnabled: 0,
      // 交通路况展示
      trafficEnabled: 0,
      // 地图 POI 信息
      showMapText: 1

    },
   
    includePadding: {
      left: 80, right: 80,
      top: 30, bottom: 30
    },
    userInfo:{},
  },
  
  props: {},
  onInit() {
  },
  didMount() {
    // 页面显示
    this.init();
  },
  
  didUpdate (prevProps, prevData) {
    // if (Object.keys(prevData.userInfo).length === 0) {
    //   this.init();
    // }
  },
  didUnmount() {
    this.setData = ()=>{
      return;
    };
  },
  methods: {
    init() {
      const _this = this
      let activeTab = my.getStorageSync({
        key: 'activeIndex'
      })
      if (activeTab.data) {
        this.setData({
          activeTab: activeTab.data - 0,
          current: activeTab.data - 0
        })
      }
      my.getStorage({
        key: 'userInfo',
        success: function(res) {
          // console.log(res.data, 222);
          if (res.data == null) {
            _this.toLogin();
          } else {
            _this.setData({
              userInfo: res.data,
            })
            _this.getList();
            _this.setData({
              userId: res.data.id,
              pageIndex1: 1,
              pageIndex2: 1,
              pageIndex3: 1,
            })
            _this.getList1()
            _this.getList2()
            _this.getList3()
          }
        },
        fail: function(res) {
          my.alert({ content: res.errorMessage });
        }
      });
      let a = this.getMarkers();
      // console.log(a)
      let b = this.getIncludePoints();
      // console.log(b)
    },
    tab(e) {
      // console.log(e)
      this.setData({
        activeTab: e.currentTarget.dataset.index,
        current: e.currentTarget.dataset.index
      })
      my.setStorage({
        key: 'activeIndex',
        data: e.currentTarget.dataset.index,
        success: (res) => {
        },
      })
    },
    // 取消原因列表
    getEnumList(){
      request.get("order/rest/order/reserveOrderCancelReasonEnumList").then(res => {
        if (res.data.code === 0) {
          let list = []
          res.data.data.map((item,index) => {
            let obj = {}
            obj.title = item;
            obj.checked = false;
            list.push(obj)
          })
          this.setData({cancelReasonEnumList:list})
          this.setData({cancelMask:true})
        }
      })
    },
    // 取消原因
    changeChecked(e){
      let index = e.currentTarget.dataset.data;
      let list = this.data.cancelReasonEnumList.map((j,i) => {
        if(index == i){
          j.checked =true
        }else{
          j.checked = false
        }
        return j
      });
      this.setData({cancelReasonEnumList:list})
    },
    closemask_(){
      this.setData({cancelMask:false})
    },
    // 提交取消订单
    agree(){
      let reason = this.data.cancelReasonEnumList.filter(e => e.checked);
      if(reason.length==0) {
        return;
      }
      let a = encodeURI(reason[0].title);
      if(reason.length>0){
        request.get(`order/rest/order/cancelReserveOrder?orderId=${this.data.cancelOrderId}&reason=${a}`).then((res) => {
          if (res.data.code == 0) {
            my.showToast({
              type: 'success',
              content: "操作成功",
              duration: 1500,
            });
            this.setData({cancelMask:false})
            this.setData({
              pageIndex2: 1,
              list2Length: 0
            })
            this.getList2()
          }
        })
      }else{
        my.showToast({
          type: 'none',
          content: "请选择取消原因",
          duration: 1500,
        });
      }
    },
    onChange(e) {
      // console.log(e.detail.current)
      this.setData({
        activeTab: e.detail.current
      })
      my.setStorage({
        key: 'activeIndex',
        data: e.detail.current,
        success: (res) => {
        },
      })
    },
    getMarkers(latitude1, longitude1, latitude2, longitude2) {
      return [{
        iconPath: this.data.imgUrl + "order/me.png",
        id: 9,
        latitude: latitude1,
        longitude: longitude1,
        width: 19,
        height: 25,

      }, {
        iconPath: this.data.imgUrl + "order/car.png",
        id: 10,
        latitude: latitude2,
        longitude: longitude2,
        width: 30,
        height: 30
      }]
    },
    getIncludePoints(latitude1, longitude1, latitude2, longitude2) {
      return [
        {
          latitude: latitude1,
          longitude: longitude1
        },
        {
          latitude: latitude2,
          longitude: longitude2,
        }
      ]
    },
    getList() {
      let userInfo = my.getStorageSync({
        key: 'userInfo', // 缓存数据的key
      });
      if (userInfo.data) {
        let data = { userId: userInfo.data.id }
        request.post("user/rest/user/getUserInfo", data).then(res => {
          if (res.data.code === 0) {
            my.setStorage({
              key: 'userInfoMore', // 缓存数据的key
              data: res.data.data, // 要缓存的数据
            });
            if (res.data.data.userAddress) {
              my.setStorage({
                key: 'add', // 缓存数据的key
                data: res.data.data.userAddress,
              });
            }
          }
        })
      }
    },
    toLogin() {
      my.confirm({
        title: '温馨提示',
        content: '您还未登录，确定去登录吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            // 卸载一下当前组件
            my.navigateTo({
              url: '/pages/login/login'
            });
          } else {
            this.props.onSwitchTab('index')
          }
        },
      });
      return false;
    },
    //去预约的详情页
    bookingDetail(e) {
      // let name = e.currentTarget.dataset.name
      // let status = e.currentTarget.dataset.status
      let id = e.currentTarget.dataset.id
      let item = e.currentTarget.dataset.item
      if (item.reserveState == 1 && item.ghState == 1) {
        // my.navigateTo({
        //   url: `/pages/toMap/toMap?id=${id}`
        // });
      } else {
        my.navigateTo({
          url: `/pages/bookingOrder/bookingOrder?id=${id}`
        });
      }

    },
    //去回收的详情页
    recoveryDetail(e) {
      // let name = e.currentTarget.dataset.name
      // let status = e.currentTarget.dataset.status
      let orderId = e.currentTarget.dataset.orderId;
      let userId = e.currentTarget.dataset.userId;
      // console.log(orderId)
      // console.log(userId)
      my.navigateTo({
        url: `/pages/recoveryOrder/recoveryOrder?orderId=${orderId}&userId=${userId}`
      });
    },
    //去交易订单的详情页
    checkDetail(e) {
      let status = e.currentTarget.dataset.status
      let id = e.currentTarget.dataset.id
      my.navigateTo({
        url: `/pages/checkOrder/checkOrder?status=${status}&id=${id}&delbtn=0`
      });
    },
    //回收订单的删除
    del1(e) {
      let id = e.currentTarget.dataset.id
      my.confirm({
        title: '温馨提示',
        content: '确定删除吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            request.get(`order/rest/order/deleteRecycleOrder?orderId=${id}`).then((res) => {
              if (res.data.code == 0) {
                this.setData({
                  pageIndex1: 1,
                  list1Length: 0
                })
                this.getList1()
              }
            })
          }
        },
      });
    },
    //预约订单的删除
    del2(e) {
      let id = e.currentTarget.dataset.id
      my.confirm({
        title: '温馨提示',
        content: '确定删除吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            request.get(`order/rest/order/deleteReserveOrder?orderId=${id}`).then((res) => {
              if (res.data.code == 0) {
                this.setData({
                  pageIndex2: 1,
                  list2Length: 0
                })
                this.getList2()
              }
            })
          }
        },
      });
    },
    // 交易订单的删除
    del(e) {
      let id = e.currentTarget.dataset.id
      my.confirm({
        title: '温馨提示',
        content: '确定删除吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            request.get(`order/rest/order/deleteSendOrder?orderId=${id}`).then((res) => {
              if (res.data.code == 0) {
                this.setData({
                  pageIndex3: 1,
                  list3Length: 0
                })
                this.getList3()
              }
            })
          }
        },
      });
    },
    cancel1(e) {
      let id = e.currentTarget.dataset.id
      this.getEnumList()
      this.setData({cancelOrderId:id});
      return;
      my.confirm({
        title: '温馨提示',
        content: '确定取消预约吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            request.get(`order/rest/order/cancelReserveOrder?orderId=${id}`).then((res) => {
              if (res.data.code == 0) {
                this.setData({
                  pageIndex2: 1,
                  list2Length: 0
                })
                this.getList2()
              }
            })
          }
        },
      });

    },
    getList1() {
      let data = {
        pageIndex: this.data.pageIndex1,
        pageSize: this.data.pageSize,
        userId: this.data.userId
      }
      request.get('order/rest/order/getRecycleOrderList', data).then((res) => {
        // console.log(res, 11111111111)
        if (res.data.code == 0) {
          let list = []
          let list1Length = 0
          if (this.data.pageIndex1 == 1) {
            list = res.data.data.content
            if (res.data.data.content.length == 0) {
              list1Length = 1
            }
          } else {
            let data = this.data.list1
            list = [...data, ...res.data.data.content]
          }
          this.setData({
            list1: list,
            total1: res.data.data.totalPages,
            list1Length
          })
        }
      })
    },
    getList2() {
      let _this = this
      let data = {
        pageIndex: this.data.pageIndex2,
        pageSize: this.data.pageSize,
        userId: this.data.userId
      }
      request.get('order/rest/order/getReserveOrderList', data).then((res) => {
        // console.log(res, 22222222222)
        if (res.data.code == 0) {
          let list = [];
          let list2Length = 0
          res.data.data.content.forEach((item, index) => {
            if (item.reserveState == 1 && item.ghState == 1) {
              item.markers = _this.getMarkers(item.latitude, item.longitude, item.driveLat, item.driveLng)
              item.includePoints = _this.getIncludePoints(item.latitude, item.longitude, item.driveLat, item.driveLng)
            }
          })
          if (this.data.pageIndex2 == 1) {
            list = res.data.data.content
            if (res.data.data.content.length == 0) {
              list2Length = 1
            }
          } else {
            let data = this.data.list2
            list = [...data, ...res.data.data.content]
          }
          this.setData({
            list2: list,
            total2: res.data.data.totalPages,
            list2Length
          })
        }
      })
    },
    getList3() {
      let data = {
        pageIndex: this.data.pageIndex3,
        pageSize: this.data.pageSize,
        userId: this.data.userId
      }
      request.get('order/rest/order/getSendBagList', data).then((res) => {
        // console.log(res, 3333333333333)
        if (res.data.code == 0) {
          let list = []
          let list3Length = 0
          if (this.data.pageIndex3 == 1) {
            list = res.data.data.content
            if (res.data.data.content.length == 0) {
              list3Length = 1
            }
          } else {
            let data = this.data.list3
            list = [...data, ...res.data.data.content]
          }
          this.setData({
            list3: list,
            total3: res.data.data.totalPages,
            list3Length,
          })
        }
      })
    },
    call(e) {
      let call = e.currentTarget.dataset.call
      my.makePhoneCall({ number: call });

    },
    lower() {
      let activeTab = this.data.activeTab
      switch (activeTab) {
        case 0:
          if ((this.data.pageIndex1 - 0) >= (this.data.total1 - 0)) {
            return false;
          }
          this.setData({
            pageIndex1: this.data.pageIndex1 + 1
          })
          this.getList1()
          break;
        case 1:
          if ((this.data.pageIndex2 - 0) >= (this.data.total2 - 0)) {
            return false;
          }
          this.setData({
            pageIndex2: this.data.pageIndex2 + 1
          })
          this.getList2()
          break;
        case 2:
          if ((this.data.pageIndex3 - 0) >= (this.data.total3 - 0)) {
            return false;
          }
          this.setData({
            pageIndex3: this.data.pageIndex3 + 1
          })
          this.getList3()
          break;
      }
    },
    toMap(e) {
      // console.log(e)
      let id = e.currentTarget.id
      my.navigateTo({
        url: `/pages/toMap/toMap?id=${id}`
      });
    },
    onPullDownRefresh() {
      this.setData({
        pageIndex1: 1,
        pageIndex2: 1,
        pageIndex3: 1,
        total1: '',
        total2: '',
        total3: ''
      })
      this.getList1()
      this.getList2()
      this.getList3()
      my.stopPullDownRefresh()
    }


  },
});

