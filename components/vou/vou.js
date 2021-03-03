var app = getApp();
const request = require("../../utils/request.js");
Component({
  /**
   * 组件的属性列表
   */
  props: {
    //   isShowVouList: null,
    //   userInfo: Object,
    //   orderId: string,
  },
  data: {
    imgUrl: app.globalData.imgUrl, //图片路径
    imgUrlNew: app.globalData.imgUrlNew,
    vou: [],//券列表
    pageSize: 10,
  },
  onInit() {

  },
  didMount() {


    let that = this;
    setTimeout(function () {
      that.setData({
        userInfo: that.props.userInfo,
        orderId: that.props.orderId,
        // isShowVouList: that.props.isShowVouList,
      })
      console.log(that.props.userInfo);
      console.log(that.props.isShowVouList);
      console.log(that.props.orderId);
       that.getVou();
    }, 1000)
    
  },
  methods: {
    // 获取信息
    getVou() {
      let pageIndex = 0, state = 0, hasDoor = 0;
      request.post(`user/rest/voucher/myVouchers?pageIndex=${pageIndex}&pageSize=${this.data.pageSize}&state=${state}&userId=${this.data.userInfo.id}&hasDoor=${hasDoor}`).then(res => {
        if (res.data.code === 0) {
          res.data.data.voucherList.content.forEach(function (item, index) {
            item.selected = false;
            item.checked = false;
          })
          this.setData({
            vou: res.data.data.voucherList.content,
          })
        }
      })
    },
    // 选择可用权益
    chooseVou(e) {
      const index = e.currentTarget.dataset.index;
      const item = e.currentTarget.dataset.item;
      let vou = this.data.vou;
      let list = [] //列表状态
      if (item.ran == 0) {
        vou.map((e, i) => {
          if (i == index) {
            e.selected = true
          } else {
            e.selected = false
          }
          list.push(e)
        })
        this.setData({ vou: list })
      } else {
        vou.map((e, i) => {
          if (e.ran == 0) {
            e.selected = false
          }
          list.push(e)
        })
        vou[index].selected = !vou[index].selected
        this.setData({ vou: vou })
      }

    },
    //确定选中的券
    close() {
      this.setData({
        isShowVouList: false,
      })
    },
    closeVouList() {
      // this.triggerEvent('closeVou')
      let arr = []
      this.data.vou.forEach(function (item, i) {
        if (item.selected) {
          arr.push(item.typeId);
        }
      })

      request.post("user/rest/voucher/bindingVoucher", JSON.stringify({
        userId: this.data.userInfo.id,
        reserveOrderId: this.data.orderId,
        voucherTypes: arr

      })).then(res => {
        if (res.data.code === 0) {
          my.showToast({
            type: 'none',
            content: res.data.message,
            duration: 1500,
          });
          
        }
        this.setData({
          isShowVouList: false,
        })
      })
    },
    //删除券
    delVou(e) {
      var newarr = this.data.vouChoosed;
      let ide = e.currentTarget.dataset.item
      if (ide) {
        newarr = newarr.filter(k => {
          if (k.id && k.id !== ide) {
            return k
          }
        });
      }
      this.setData({
        vouChoosed: newarr,
      })
    },

  }
})
