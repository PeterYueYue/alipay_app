
const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    userInfo: {},//用户信息
    imgUrl1: app.globalData.imgUrl1,
    imgUrlNew: app.globalData.imgUrlNew,
    autoDisplay: true,
    success: false,///开箱成功
    marked: '',
  },
  onLoad: function (e) {
    console.log(e)
  },
  onReady: function () {
  },
  onShow: function () {
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
      this.openIot()
    }
  },
  onGetAuthorize(e) {
    let _this = this;
    _this.setData({
      autoDisplay: false,
    });
    my.getPhoneNumber({
      success: (res) => {
        const encryptedData = res.response;
        const param = {
          response: JSON.parse(encryptedData).response,
          sign: JSON.parse(encryptedData).sign,
        }
        request.post("user/rest/user/getUserPhone", param).then(res => {
          console.log(res,'iotlogin')
          if (res.data.data.userInfo === 0) {
            //更新用户信息
            my.setStorageSync({
              key: 'userInfo',
              data: res.data.data.userInfo,
            });
            _this.openIot();
          }
          _this.setData({
            autoDisplay: true,
          })
        })
      },
      fail: (res) => {

      },
    });
  },
  openIot(){
    let userInfo = my.getStorageSync({
      key: "userInfo",
    });
    let data = JSON.stringify({
      userId: userInfo.data.id,
      encData: app.globalData.iotEncData
    })
    console.log(data)
    request.post("user/rest/iot/scan",data).then(res => {
        my.hideLoading()
        if(res.data.code == 0){
          this.setData({marked:res.data.data.msg})
        }else{
          this.setData({marked:res.data.message})
        }
        this.setData({success:true})
        setTimeout(() => {
          my.redirectTo({
            url: '/pages/index/index?common=index'
          })
         },3000);
    })

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
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function (res) {
  }
})