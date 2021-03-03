
var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    checked: [],
    evaluation: [],
    text: [],
    orderId: '',
    orderInfo: '',
    recycleDetailVo: [],
    userId: '',
    pointChecked: 0,
    pointEvaluation: 3,
    pointText: '',
    imgUrl: app.globalData.imgUrl,
    vouChoosed: [],//已使用的券
  },
  onLoad(e) {
    console.log(e)
    let orderId = e.orderId
    let userId = e.userId
    // let orderId = '14a2f342f16d4168a9f3a39215e5593c'
    // let userId = '822de6b6a4f64e67ba562f688bffd795'
    this.setData({
      userId
    })
    request.get(`order/rest/order/getRecycleOrderDetail?orderId=${orderId}&userId=${userId}`).then(res => {
      console.log(res.data.data)
      if (res.data.code == 0) {

        console.log(this.data.recycleDetailVo)
        if (res.data.data.recycleState == 3) {
          let checked = []
          let evaluation = []
          let text = []
          res.data.data.recycleDetailVo.forEach((item, index) => {
            checked[index] = 0
            evaluation[index] = 3
            text[index] = ''
            if (item.errorUrl) {
              item.errorUrl = item.errorUrl.split(",")
            }
          })
          this.setData({
            checked,
            evaluation,
            text
          })
          console.log(this.data.checked)
          console.log(this.data.evaluation)
          console.log(this.data.text)
        }
        let arr = res.data.data.recycleDetailVo.map(e => {
          e.listJson.map(k => {
            k.totalPrice = parseInt(k.totalPrice)
            return k
          })
          return e
        })
        this.setData({
          orderInfo: res.data.data,
          recycleDetailVo: arr
        })
      }
    })
  },
  goSenlin() {
    my.ap.navigateToAlipayPage({
      appCode: 'antForest',
      appParams: {
        autoShowProps: 1 //可选参数，等1时，默认打开开启森林背包
      },
      success: (res) => {
      },
      fail: (res) => {
      }
    });
  },
  radioChange(e) {
    let index = e.currentTarget.dataset.index
    let checked = this.data.checked
    if (checked[index]) {
      checked[index] = 0

    } else {
      checked[index] = 1
    }
    this.setData({
      checked
    })
  },
  evaluation(e) {
    let evaluation = this.data.evaluation
    evaluation[e.currentTarget.dataset.index] = e.currentTarget.dataset.flag
    this.setData({
      evaluation
    })
  },
  input(e) {
    // console.log(e)
    let text = this.data.text
    text[e.target.dataset.index] = e.detail.value
    this.setData({
      text
    })
  },
  comments(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    // console.log(index)
    // console.log(item)
    // console.log(this.data.text[index])
    // console.log(this.data.evaluation[index])
    // console.log(this.data.checked[index])
    let data = {
      evalComm: this.data.text[index],
      evalScore: this.data.evaluation[index],
      isNm: this.data.checked[index],
      operationId: item.operationId,
      orderId: item.recycleId,
      orderType: 2,
      userId: this.data.userId,
      bagCode: item.bagCode
    }
    console.log(data)
    request.post("order/rest/order/submitServiceComm", data).then((res) => {
      // console.log(res)
      if (res.data.code == 0) {
        // my.navigateBack();
        my.showToast({
          content: '评论成功',
          duration: 1500,
          success: (res) => {
            let recycleDetailVo = this.data.recycleDetailVo
            recycleDetailVo[index].isComm = 1
            this.setData({
              recycleDetailVo
            })
          },
        });

      }
    })

  },
  previewImage(e) {
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.errorUrl)
    let index = e.currentTarget.dataset.index
    let urls = e.currentTarget.dataset.errorUrl
    my.previewImage({
      current: index,
      urls
    });
  },
  ponintRadioChange() {
    if (this.data.pointChecked) {
      this.setData({
        pointChecked: 0
      })
    } else {
      this.setData({
        pointChecked: 1
      })
    }
    console.log(this.data.pointChecked)
  },
  pointEvaluation(e) {
    this.setData({
      pointEvaluation: e.currentTarget.dataset.flag
    })
    console.log(this.data.pointEvaluation)
  },
  pointInput(e) {
    this.setData({
      pointText: e.detail.value
    })
    console.log(this.data.pointText)
  },
  pointComments() {
    let data = {
      evalComm: this.data.pointText,
      evalScore: this.data.pointEvaluation,
      isNm: this.data.pointChecked,
      operationId: this.data.orderInfo.operationId,
      orderId: this.data.orderInfo.id,
      orderType: 2,
      userId: this.data.userId,
    }
    console.log(data)
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
