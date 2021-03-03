var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    userId: '',
    name: '',//姓名
    card: '',//银行卡号
    imgUrl: app.globalData.imgUrl,
    uploaderList1: [],//银行卡正面图片
    showUpload1: true,//银行卡正面状态
    uploaderList2: [],//银行卡背面图片
    showUpload2: true,//银行卡背面状态
    frontCard: '',
    reverseCard: '',
  },
  onLoad(query) {
    let userInfo = my.getStorageSync({ key: 'userInfo' });
    this.setData({
      userId: userInfo.data.id
    })
  },
  onReady() {
    // 页面加载完成
  },
  change(e) {
    const id = e.target.dataset.id
    switch (id) {
      case "1"://姓名
        this.setData({
          name: e.detail.value
        });
        break;
      case "2"://银行卡号
        this.setData({
          card: e.detail.value
        });
        break;
      default:
        break;
    }
  },
  push() {
    if (this.data.name == "") {
      my.showToast({
        content: '请输入持卡人姓名',
        duration: 1500,
      });
      return false;
    }
    if (this.data.card == "") {
      my.showToast({
        content: '请输入卡号',
        duration: 1500,
      });
      return false;
    }
    if (this.data.card.length < 18 || !this.testing(this.data.card)) {
      my.showToast({
        content: '请输入正确的卡号',
        duration: 1500,
      });
      return false;
    }
    if (!this.data.frontCard || !this.data.reverseCard) {
      my.showToast({
        content: '请上传银行卡图片',
        duration: 1500,
      });
      return false;
    }
    let data = {
      card: this.data.card,
      name: this.data.name,
      userId: this.data.userId,
      frontCard: this.data.frontCard,
      reverseCard: this.data.reverseCard,
    }
    // console.log(data);
    request.post('user/rest/user/addUserCard', data).then((res) => {
      if (res.data.code == 0) {
        my.showToast({
          content: '绑定成功',
          duration: 1500,
        });
        my.navigateBack();
      }
    })

  },
  blur(e) {
    const id = e.target.dataset.id
    switch (id) {
      case "1"://姓名
        if (e.detail.value == "") {
          my.showToast({
            content: '请输入持卡人姓名',
            duration: 1500,
          });
          this.setData({ card: '' })
          return false;
        }
        this.setData({
          name: e.detail.value
        });
        break;
      case "2"://银行卡号
        if (e.detail.value.length < 18) {
          my.showToast({
            content: '请输入正确的卡号',
            duration: 1500,
          });
          return false;
        }
        if (!this.testing(e.detail.value)) {
          my.showToast({
            content: '请输入正确的卡号',
            duration: 1500,
          });
          return false;
        }
        this.setData({
          card: e.detail.value
        });
        break;
      default:
        break;
    }
  },
  testing(e) {
    let f1 = e.slice(0, 6)
    let f2 = e.slice(10, 16)
    let reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
    if (reg.test(e) && f1 == 622908) {
      return true;
    } else {
      return false;
    }
  },
  // getCard(){
  //   my.chooseImage({
  //           count: 1,
  //           success: (res) => {
  //               this.callFn(res.apFilePaths[0]);
  //           },
  //       });
  // },
  // callFn(url){
  //       my.showLoading({
  //           content: '加载中...',
  //           delay: 100,
  //       });
  //       my.ocr({
  //           ocrType: 'ocr_bank_card',
  //           path: url,
  //           success: (res) => {
  //               let data = JSON.parse(res.result.outputs[0].outputValue.dataValue);
  //               let {card_num}=data;
  //               let newCard=card_num.replace(/[ \f\t\v]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
  //               this.setData({
  //                 card:card_num,
  //                 newCard:newCard
  //               });
  //               my.hideLoading();
  //           },
  //           fail: (res) => {
  //               my.hideLoading();

  //               my.alert({
  //                   title:'fail',
  //                   content:JSON.stringify(res),
  //               });
  //           },

  //       });
  //   },
  onShow() {
    // 页面显示
  },
  // 删除图片
  clearImg: function (e) {
    let index = e.currentTarget.dataset.index
    switch (index) {
      case "1":
        this.setData({
          uploaderList1: [],
          showUpload1: true,
          frontCard: ''
        })
        break;
      case "2":
        this.setData({
          uploaderList2: [],
          showUpload2: true,
          reverseCard: ''
        })
        break;
    }

  },
  //展示图片
  showImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    switch (index) {
      case "1":
        my.previewImage({
          urls: that.data.uploaderList1,
          current: 1
        })
        break;
      case "2":
        my.previewImage({
          urls: that.data.uploaderList2,
          current: 1
        })
        break;
    }

  },
  //上传图片
  upload: function (e) {
    let index = e.currentTarget.dataset.index
    var that = this;
    my.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let uploaderList = res.tempFilePaths;
        // console.log(res);
        // console.log(uploaderList)
        switch (index) {
          case "1":
            that.setData({
              showUpload1: false,
              uploaderList1: uploaderList,
            })
            console.log(uploaderList)
            const path = res.apFilePaths[0];
            
            
            my.uploadFile({
              url: request.localhost + 'user/rest/user/uploadImg',
              fileType: 'image',
              fileName: 'file',
              filePath: path,
              headers: request.dataConversion(path),
              success: res => {
                //设置银行卡正面
                // console.log(JSON.parse(res.data).data.imageUrl)
                that.setData({
                  frontCard: JSON.parse(res.data).data.imageUrl,
                })
              },
              fail: function (res) {
                console.log(res);
              },
            })
            break;
          case "2":
            that.setData({
              showUpload2: false,
              uploaderList2: uploaderList,
            })
            const path1 = res.apFilePaths[0];
            my.uploadFile({
              url: request.localhost + 'user/rest/user/uploadImg',
              fileType: 'image',
              fileName: 'file',
              filePath: path1,
              headers: request.dataConversion(path),
              success: res => {
                //设置银行卡背面
                that.setData({
                  reverseCard: JSON.parse(res.data).data.imageUrl,
                })
              },
              fail: function (res) {
                console.log(res);
              },
            })
            break;
        }
      }
    })
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
