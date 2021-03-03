var app = getApp();
const request = require("../../../utils/request.js");
Component({
  properties: {
  },
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    userInfo: {},
    userInfoMore: {},
    activity_30: false,//是否显示新人活动
  },
  didMount() {
    this.init();
    this.getList();
  },
  didUnmount() {
    this.setData = () => {
      return;
    };
  },
  methods: {
    init() {
      let userInfo = my.getStorageSync({
        key: 'userInfo',
      });
      let userInfoMore = my.getStorageSync({
        key: 'userInfoMore', // 缓存数据的key
      });
      if (!userInfo.data) {
        return;
      }
      this.setData({
        userInfo: userInfo.data,
        userInfoMore: userInfoMore.data,
      })
      this.getProductList();
    },

    getProductList() {
      request.post('user/rest/product/shopProductPage').then((res) => {
        this.setData({ productList: res.data.data })
      })
    },
    goList(e) {
      // console.log(e.currentTarget.dataset.item.productType);
      my.navigateTo({
        url: `/pages/shop/productList/productList?item=${JSON.stringify(e.currentTarget.dataset.item.productType)}`
      });
    },
    goDetails(e) {
      if (e.currentTarget.dataset.item.stock == 0) {
        return false;
      }
      my.navigateTo({
        url: `/pages/shop/productDetail/productDetail?item=${e.currentTarget.dataset.item.id}`,
      })
    },
    onClick(e) {
      let name = e.currentTarget.dataset.name;
      if (!this.data.userInfo.id) {
        this.toLogin()
      } else {
        // console.log(name)
        switch (name) {
          case '兑换':
            my.navigateTo({
              url: '/pages/withdrawal/withdrawal'
            });
            break;
          case '券码兑换':
            my.navigateTo({
              url: `/pages/vouchers/exchange/exchange`
            });
            break;
          case '签到中心':
            my.navigateTo({
              url: `/pages/shop/signIn/signIn`
            });
            break;
          case '我的订单':
            my.navigateTo({
              url: `/pages/shop/order/order`
            });
            break;
          case '返回30':
            my.navigateTo({
              url: `/pages/shop/cashback/cashback`
            });
            break;
          case '拾尚币':
            my.navigateTo({
              url: '/pages/withdrawal/withdrawal'
            });
            break;
        }
      }
    },
    getList() {//获取领取列表
      const that = this;
      const data = this.data.userInfo.id
      request.get("user/rest/userSsb/rechargeDiscountInfo?userId=" + data).then(res => {
        if(res.data.isItQualified) {
            this.setData({
              activity_30: true,
            })
        }
      })
    },
    toLogin() {
      my.showModal({
        title: '温馨提示',
        content: '您还未登录，确定去登录吗？',
        confirmText: '确定',
        cancelText: '取消',
        success: (result) => {
          if (result.confirm) {
            my.navigateTo({
              url: '../login/login'
            });
          }
        },
      });
    },

  }
})
