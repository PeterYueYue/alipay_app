var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    checked: 0,
    evaluation: 3,
    text: '',
    orderInfo: '',
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
  },
  onLoad(e) {
    console.log(e)
    request.get(`order/rest/order/getReserveOrderDetail?orderId=${e.id}`).then(res => {
      console.log(res.data.data)
      if (res.data.code == 0) {
        this.setData({
          orderInfo: res.data.data
        })
      }
    })
  },
  radioChange(e) {
    if (this.data.checked) {
      this.setData({
        checked: 0
      })
    } else {
      this.setData({
        checked: 1
      })
    }
    console.log(this.data.checked)
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
            my.navigateBack();
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
  evaluation(e) {
    console.log(e)
    this.setData({
      evaluation: e.currentTarget.dataset.flag
    })
  },
  input(e) {
    this.setData({
      text: e.detail.value
    })
  },
  cancel(e) {
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
              my.navigateBack();
            }
          })
        }
      },
    });
  },
  del(e) {
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
              my.navigateBack();
            }
          })
        }
      },
    });
  },
  comments() {
    let data = {
      evalComm: this.data.text,
      evalScore: this.data.evaluation,
      isNm: this.data.checked,
      operationId: this.data.orderInfo.operationId,
      orderId: this.data.orderInfo.id,
      orderType: 1,
      userId: this.data.orderInfo.userId
    }
    console.log(data)
    // my.showToast({
    //   content: '评论成功',
    //   duration: 1500,
    //   success: (res) => {
    //     let orderInfo = this.data.orderInfo
    //     orderInfo.isComm = 1
    //     this.setData({
    //       orderInfo
    //     })
    //   },
    // });
    request.post("order/rest/order/submitServiceComm", data).then((res) => {
      console.log(res)
      if (res.data.code == 0) {
        // my.navigateBack();
        my.showToast({
          content: '评论成功',
          duration: 1500,
          success: (res) => {
            let orderInfo = this.data.orderInfo
            orderInfo.isComm = 1
            this.setData({
              orderInfo
            })
          },
        });
      }
    })
  }
});
