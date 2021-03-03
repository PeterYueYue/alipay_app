const request = require("/utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    add: {}, //地址数据
    addressStatus: false,//是否选择了上门地址的状态
    userInfo: {},
    userInfoMore: {},
    list: [],//商品列表
    status: true,//加载
    productDetails: {},
    coin: 0,//使用拾尚币数量  
    money: 0,//支付金额
    selected: true,//是否用拾尚币支付
    isShowVouList:false,
    pageSize:10
  },
  onLoad(options) {
    this.getProductDetail(options.id)
  },
  onShow() {
    this.init();
  },
  init() {
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    let userInfoMore = my.getStorageSync({
      key: 'userInfoMore'
    });
    if (!userInfo.data) {
      return false;
    }
    this.setData({
      userInfo: userInfo.data,
      userInfoMore: userInfoMore.data,
    });
    // 地址数据
    let add = my.getStorageSync({
      key: 'add', // 缓存数据的key
    });
    if (add.data) {
      this.setData({
        addressStatus: true,
        add: add.data,
      })
    } else {
      this.setData({
        addressStatus: false,
        add: {},
      })
    }
    this.getVou(userInfo.data)
  },
  openVouList() {
    this.setData({ isShowVouList: true })
  },
  // 获取信息
  getVou(userInfo) {
    let pageIndex = 0, state = 0, hasDoor = 0;
    request.post(`user/rest/voucher/myCouponList?pageIndex=${pageIndex}&pageSize=${this.data.pageSize}&state=${state}&userId=${userInfo.id}&hasDoor=${hasDoor}`).then(res => {
      console.log(res,"kk")
      if (res.data.code === 0) {
        res.data.data.couponList.content.forEach(function (item, index) {
          item.selected = false;
          item.checked = false;
        })
        this.setData({
          vou: res.data.data.couponList.content,
        })
      }
    })
  },

  // 选择可用权益
  chooseVou(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.vou.map((e,i) => {
      if( i==index && !e.selected ){
        e.selected = true
      }else{
        e.selected = false
      }
      return e
    })
    this.setData({vou:list})
  },
  //确定选中的券
  closeVouList() {
    this.setData({ isShowVouList: false });
    let p = new Promise((reslove,reject) => {
    let arr = this.data.vou
      arr.forEach( (item, i) => {
        if (item.selected) {
          reslove(item)
        } else if(this.data.vou.length-1 == i && !item.selected){
          reject()
        }
      })
    })
    p.then((item)=>{
      this.setData({
        vouChoosed: item,
      },() => {
        this.discountAmount(item)
      })

    },() => {
      this.delVou()
      
    })

  },
  // 获取优惠券后的价格
  discountAmount(item){
    request.post(`order/rest/order/calculateThePrice?userId=${this.data.userInfo.id}&productId=${this.data.productDetails.id}&useShiShangCoin=${this.data.selected}&userCouponId=${item.id}`).then(res => {
      this.setData({
        money: res.data.data.cashAmount,
      })
    })
  },
  //删除券
  delVou() {
    this.setData({vouChoosed:"",selected:!this.data.selected},() => {
      this.check()
    })
    let list = this.data.vou.map(e => {
      e.selected = false
      return e
    })

    this.setData({vou:list})
  },
  check() {

    this.setData({ selected: !this.data.selected });
    if(!this.data.vouChoosed){
      if (!this.data.selected) {
        this.setData({
          money: this.data.productDetails.price / 100+this.data.productDetails.freight,
        })
      } else {
        if (this.data.userInfoMore.residueMoney >= this.data.productDetails.price) {
          this.setData({
            money: 0+this.data.productDetails.freight,
          })
        } else {
  
          this.setData({
            money: ((this.data.productDetails.price - this.data.userInfoMore.residueMoney) / 100).toFixed(2)- -this.data.productDetails.freight,
          })
        }
      }
    }else{
      this.closeVouList()
    }
  },
  
  toAddress() {
    my.navigateTo({
      url: `/pages/address/address?status=2`
    });
  },
  getProductDetail(id) {//获取产品详情
    let that = this;
    request.get(`user/rest/product/productDetail?productId=${id}`).then((res) => {
      this.setData({
        productDetails: res.data.data,
      })
      console.log(res);
      if (that.data.userInfoMore.residueMoney >= that.data.productDetails.price) {
        that.setData({
          coin: that.data.productDetails.price,
          money: 0 + that.data.productDetails.freight,
        })
      } else {
        that.setData({
          coin: that.data.userInfoMore.residueMoney,
          money: ((this.data.productDetails.price - this.data.userInfoMore.residueMoney) / 100).toFixed(2) + that.data.productDetails.freight,
        })
      }
    })
  },
  order() {//下单
    let that = this;
    let param = {
      userId: this.data.userInfo.id,
      productId: this.data.productDetails.id,//传地址id
      addressId: this.data.add.id,
      useShiShangCoin: this.data.selected,
      payMethod: 'isv',
      userCouponId:this.data.vouChoosed?this.data.vouChoosed.id:'',
    }
    this.setData({
      status: false,
    })
    request.get("order/rest/order/createOrder", param).then(res => {
      this.setData({
        status: true,
      })
      if (res.data.code == 0) {
        if (res.data.data.isCashUsed) {// 积分不够
          that.tradePay(res);
        } else {// 全额积分兑换
          my.showToast({
            type: 'none',
            content: "下单成功",
            duration: 1500,
            success: (res) => {
              my.redirectTo({
                url: '/pages/shop/order/order'
              })
            },
          });
        }
      }
    });
  },
  tradePay(res) {
    my.tradePay({
      tradeNO: res.data.data.tradeNo,
      success: function (res) {
        if (res.resultCode == 9000) {
          my.setStorage({
            key: 'activeIndex',
            data: 2,
            success: (res) => {
            },
          })
          my.showToast({
            type: 'none',
            content: "下单成功",
            duration: 1500,
            success: (res) => {
              my.redirectTo({
                url: '/pages/shop/order/order'
              })
            },
          });
        } else if (res.resultCode == 6001) {
          my.redirectTo({
            url: '/pages/shop/order/order'
          })
        }
      },
      fail: function (res) {
      },
    });
  },
  toLogin() {
    my.confirm({
      title: '温馨提示',
      content: '您还未登录，确定去登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.navigateTo({
            url: '/pages/login/login'
          });
        }
      },
    });
  },
  onPullDownRefresh() {
    my.stopPullDownRefresh()
  }

});
