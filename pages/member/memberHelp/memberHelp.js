const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    success_mask: false,
    userInfo: {},//用户信息
    autoDisplay: true,
    partyInfo: {},
    leaderId: '',
  },
  onLoad(e) {
    if (app.globalData.leaderId) {
      this.setData({
        leaderId: app.globalData.leaderId,
      },()=>this.getBasicUserInfo(app.globalData.leaderId))
    } else {
      this.setData({
        leaderId: e.id,
      },()=> this.getBasicUserInfo(e.id))
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    let userInfo = my.getStorageSync({
      key: 'userInfo',
    });
    if (userInfo.data) {
      this.setData({
        userInfo: userInfo.data,
      })
    }

  },
  getBasicUserInfo(id) {
    const param = {
      userId: id
    }
    request.post("user/rest/user/getBasicUserInfo", param).then(res => {
      console.log(res);
      if (res.data.code == 0) {
        app.globalData.leaderId = "";
        this.setData({
          partyInfo: res.data.data,
        });
      }
    })
  },
  join() {//加入团队
    // let data = {
    //   leaderId: this.data.leaderId,
    //   userId: this.data.userInfo.id,
    // };
    request.post("user/rest/groups/addGroup?leaderId=" + this.data.leaderId + "&userId=" + this.data.userInfo.id).then(res => {
      console.log(res);
      if (res.data.code == 0) {
        this.setData({
          success_mask: true,
        })
      } 
      setTimeout(function () {
        my.redirectTo({
          url: '/pages/index/index?common=index'
        })
      }, 1500)
    })
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
          if (res.data.code === 0) {
            //更新用户信息
            my.setStorageSync({
              key: 'userInfo',
              data: res.data.data.userInfo,
            });
            _this.setData({
              userInfo: res.data.data.userInfo,
            })
            //更新用户手机号
            my.getAuthCode({
              scopes: ['auth_base'],
              success: (res) => {
                const data = {
                  authCode: res.authCode,
                  userId: _this.data.userInfo.id,
                  userMobile: _this.data.userInfo.userMobile,
                }
                request.post("user/rest/user/login", data).then(res => {
                  if (res.data.code === 0) {
                    _this.setData({
                      userInfo: res.data.data.userInfo,
                    });
                    my.setStorage({
                      key: 'userInfo',
                      data: res.data.data.userInfo,
                      success: (res) => {
                      },
                    });
                  }
                })
              },
            });
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
