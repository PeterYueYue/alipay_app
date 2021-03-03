const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    list: [],//银行卡列表
    userInfo: {},
    normal: false,//普通会员
    register: false,//是否展示免费注册按钮 true为未注册
    banner:[
      {src: app.globalData.imgUrlNew+ 'yy/member/bemember/swiperGray.png' },
      {src: app.globalData.imgUrlNew+ 'yy/member/bemember/swiperBlue.png' },
      {src: app.globalData.imgUrlNew+ 'yy/member/bemember/swiperGold.png' }
    ],
    current: 1,//轮播图下标
    invitationId: '',
  },
  onLoad(e) {
    if(e.id){
      this.setData({invitationId:e.id})
    }
  },
  onReady() {
  },
  onShow() {// 页面显示
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    let userInfoMore = my.getStorageSync({
      key: 'userInfoMore',
    });
    if (!userInfo.data) {
      this.toLogin();
      return false;
    }
    this.setData({
      userInfo: userInfo.data,
      userInfoMore: userInfoMore.data,
    })
    this.getCompanys();
    my.getSetting({
      success: (res) => {
        console.log(res.authSetting.userInfo);
        if (res.authSetting.userInfo) {
          this.setData({
            register: true,
          })
        }
      }
    })
  },
  onChange: function (e) {//banner切换时候替换角标
    this.setData({
      current: e.detail.current
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
        } else {
          my.redirectTo({
            url: '/pages/index/index'
          });
        }
      },
    });
  },
  goNomal() {//免费预约回收
    this.setData({
      normal: !this.data.normal,
    })
    my.navigateTo({
      url: '/pages/appointment/appointment'
    });
  },
  goSure() {//查看优惠详情
    my.navigateTo({
      url: '/pages/member/nomalMemberSure/nomalMemberSure'
    });
  },
  get() {//成为普通会员
    // my.navigateTo({
    //   url: '/pages/member/nomalMember/nomalMember'
    // });
    // 达能活动
    my.navigateTo({
      url: `/pages/member/dnActivity/dnActivity?id=${this.data.invitationId}`
    });
  },
  pay() {//成为plus会员
    my.navigateTo({
      url: '/pages/member/plusMember/plusMember'
    });
  },
  getCompanys() {//获取企业列表
    request.get("user/rest/company/getHomePageShowCompany").then(res => {
      if (res.data.code == 0) {
        this.setData({
          list: res.data.data,
        })
      }
    })
  },
  // 个人授权
  onGetAuthorize(e) {
    const _this = this;
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
        const data = {
          authCode: res.authCode,
          userId: _this.data.userInfo.id,
          userMobile: _this.data.userInfo.userMobile, 
        }
        console.log(res);
        request.post("user/rest/user/login", data).then(res => {
          if (res.data.code === 0) {
            // my.showToast({
            //   type: "none",
            //   content: "注册成功",
            //   duration: 1500,
            //   success: () => {
            //   }
            // });
            _this.setData({
              register: true,
              normal: !this.data.normal,  
            })
            my.setStorageSync({
              key: 'userInfo',
              data: res.data.data.userInfo,
            });
            _this.setData({
              userInfo: res.data.data.userInfo,
            });
            // 送券 不再调用
            if (!_this.data.userInfoMore.hasSendDoorVoucher) {
              // _this.sendDoorVoucher();
            }
            //更新用户头像昵称
            if (_this.data.userInfo.headPortrait == 'http://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/image/home/12.png' && _this.data.userInfo.nickName == '拾小尚') {
              _this.update();
            }
            _this.get();
          }
        })
      }
    });
  },
  // 发券
  // sendDoorVoucher() {
  //   request.post("user/rest/user/sendDoorVoucher?userId=" + this.data.userInfo.id + "&num=3").then(res => {
  //     if (res.data.code === 0) {
  //     }
  //   })
  // },
  update() {//普通会员 更新用户头像和昵称(未修改过头像和昵称的用户)
    let _this = this;
    my.getOpenUserInfo({
      success: (res) => {
        let userInfo = JSON.parse(res.response).response; //以下方的报文格式解析两层 response
        const param = {
          avatar: userInfo.avatar,
          nickName: userInfo.nickName,
          userId: _this.data.userInfo.id,
        }
        //更新信息
        request.post("user/rest/user/updateUserInfo", param).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            my.getAuthCode({
              scopes: ['auth_base'],
              success: (res) => {
                const data = {
                  authCode: res.authCode,
                  userId: _this.data.userInfo.id,
                }
                request.post("user/rest/user/login", data).then(res => {
                  if (res.data.code === 0) {
                    my.setStorageSync({
                      key: 'userInfo', // 缓存数据的key
                      data: res.data.data.userInfo, // 要缓存的数据
                    });
                  }
                })
              }
            });
          }
        })
      }
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
