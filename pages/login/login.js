const request = require("../../utils/request.js");
const md5 = require("../../utils/md5.js");
var app = getApp();
Page({
  data: {
    userAccount: '',//账号
    userPassword: '',//密码
    vCode: '',//验证码
    display: true,
    autoDisplay: true,
    codeKey: "",
    codeImg: '',
    userInfo: '',
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    newUser: {},//新手提示
    choose: true,
    targetPath: '',
  },
  onLoad(e) {
    if(e.targetPath && e.targetPath!=undefined&& e.targetPath!='undefined') {
      this.setData({
        targetPath: e.targetPath,
      })
    }
  },
  onShow(e) {
    const codeKey = this.getuuid();
    this.setData({
      codeKey: codeKey,
    })
    this.setData({
      codeImg: request.localhost + 'user/rest/user/getCode?codeKey=' + codeKey,
    })
  },
  tab() {
    this.setData({
      choose: !this.data.choose,
    })
  },
  change(e) {
    const id = e.target.dataset.id
    switch (id) {
      case "1"://账户
        this.setData({
          userAccount: e.detail.value
        });
        break;
      case "2"://密码
        this.setData({
          userPassword: e.detail.value
        });
        break;
      case "3"://验证码
        this.setData({
          vCode: e.detail.value
        });
        break;
      default:
        break;
    }
  },
  getuuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; 
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
  },
  changeCode() {//更换验证码
    const codeKey = this.getuuid();
    this.setData({
      codeKey: codeKey,
    })
    this.setData({
      codeImg: request.localhost + 'user/rest/user/getCode?codeKey=' + codeKey,
      vCode: '',
    })
  },
  // 企业登录
  push() {
    if (this.data.userAccount === "") {
      my.showToast({
        type: 'none',
        content: '请输入账号',
        duration: 1500,
      });
      return
    }
    if (this.data.userPassword === "") {
      my.showToast({
        type: 'none',
        content: '请输入密码',
        duration: 1500,
      });
      return
    }
    if (this.data.vCode === "") {
      my.showToast({
        type: 'none',
        content: '请输入验证码',
        duration: 1500,
      });
      return
    }
    this.setData({
      display: false,
    })
    const param = {
      userAccount: this.data.userAccount,
      userPassword: md5.hex_md5(this.data.userPassword),
      vCode: this.data.vCode,
      codeKey: this.data.codeKey,
    }
    request.post("user/rest/user/companyLogin", param).then(res => {
      this.setData({
        display: true,
      })
      if (res.data.code === 0) {
        my.setStorage({
          key: 'userInfo', // 缓存数据的key
          data: res.data.data.result, // 要缓存的数据
          success: (res) => {

          },
        });
        my.showToast({
          type: 'none',
          content: '登录成功',
          duration: 1500,
          success: () => {
            this.goBack();
          },
        });
      } else {
        this.setData({
          display: true,
        })
      }
    });
  },
  goBack(){
    if(this.data.targetPath == ''){
      my.navigateBack();
    } else {
      my.redirectTo({
        url: this.data.targetPath,
      });
    }
  },
  // 授权手机号登录
  onGetAuthorize(e) {
    const _this = this;
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
                      token: res.data.data.token,
                    });
                    my.setStorageSync({
                      key: 'token',
                      data: res.data.data.token, 
                    });
                    my.setStorage({
                      key: 'userInfo', // 缓存数据的key
                      data: res.data.data.userInfo, // 要缓存的数据
                      success: (res) => {
                        _this.backTotaget();
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
  // 个人登录 编辑器用
  onGetAuthorize1() {
    const _this = this;
    _this.setData({
      autoDisplay: false,
    });
    my.getAuthCode({
      scopes: ['auth_base'],
      success: (res) => {
        const data = {
          authCode: res.authCode,
          // userId: '52e5a4f10fc64b52869338a0d9c1060c',//夏 正式
          userId: 'ff6ed39d72dc4ad5a6e2bac8455d3242',//岳 正式
          // userId: '74304c30440a4013b8505115265d3b3d',//cf测试
          // userId: '61dc4dc99f944303a81ab5307211b9ba',//新用户测试
        }
        request.post("user/rest/user/login", data).then(res => {
          if (res.data.code === 0) {
            my.setStorageSync({
              key: 'userInfo',
              data: res.data.data.userInfo, 
            });
            my.setStorageSync({
              key: 'token',
              data: res.data.data.token, 
            });
            _this.setData({
              autoDisplay: true,
              userInfo: res.data.data.userInfo,
            });
            _this.backTotaget();
          }
        })
      }
    }); 
  },
  backTotaget() { 
    const that = this;
    //获取用户信息
    const data = {
      userId: this.data.userInfo.id
    }
    request.post("user/rest/user/getUserInfo", data).then(res => {
      if (res.data.code === 0) {
        my.setStorage({
          key: 'userInfoMore', 
          data: res.data.data, 
        });
        if (res.data.data.userAddress) {
          my.setStorage({
            key: 'add', 
            data: res.data.data.userAddress,
          });
        }
        if(that.data.targetPath == ''){
          my.navigateBack();
        } else {
          my.redirectTo({
            url: that.data.targetPath,
          });
        }
      }
    })
    
  },
  getmsg(authCode) {
    const _this = this;
    const data = {
      authCode: authCode,
      userId: _this.data.userInfo.id,
    }
    request.post("user/rest/user/login", data).then(res => {
      if (res.data.code === 0) {
        _this.setData({
          userInfo: res.data.data.userInfo,
        });
        my.setStorageSync({
          key: 'userInfo',
          data: res.data.data.userInfo,
        });
      }
    })
    
  },


});
