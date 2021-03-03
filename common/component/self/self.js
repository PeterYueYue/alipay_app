var app = getApp();
const request = require("../../../utils/request.js");
const format = require("../../../utils/util.js");
Component({
  mixins: [],
  data: {
    headImg: '../../image/1.png',
    logins: false,
    visible: false,
    userInfo: {},
    userInfoMore: {},
    imgUrl: app.globalData.imgUrl,
    imgUrl1: app.globalData.imgUrl1,
    imgUrlNew: app.globalData.imgUrlNew,
    maskFlag: false,
    redFlag: true,
    redMoney: '',
    residueRedNum: '',
    percent: '50%',
    step: false,//查看等级蒙版
    tan: false,//碳排量蒙版
  },
  props() {
    
  },
  didMount() {
    this.init();
  },

  didUpdate(prevProps, prevData, ) {

  },
  didUnmount() {
    this.setData = ()=>{
      return;
    };
  },
  methods: {
    init() {
      const _this = this;
      let res = my.getStorageSync({
        key: 'userInfo'
      });
      // console.log(res,'userInfo')
      let userInfoMore = my.getStorageSync({
        key: 'userInfoMore'
      });
      // console.log(userInfoMore.data);
      if (res.data == null) {
        this.setData({
          userInfo: {},
          logins: false,
        })
        return false;
      }
      this.setData({
        userInfo: format.format(res.data),
        userInfoMore: userInfoMore.data,
        logins: true,
      });
      const param = {
        userId: res.data.id,
      };
      //获取个人中心信息
      if (res.data == null) {
        return false;
      }
      request.post("user/rest/user/getUserInfo", param).then(res => {
        // console.log(res)
        if (res.data.code === 0) {
          // res.data.data.residueMoney = res.data.data.residueMoney.split(".")
          // res.data.data.totalDeposit = res.data.data.totalDeposit.split(".")
          // res.data.data.totalErrWeight = res.data.data.totalErrWeight.split(".")
          _this.setData({
            userInfoMore: res.data.data,
          });
          my.setStorage({
            key: 'userInfoMore', // 缓存数据的key
            data: res.data.data, // 要缓存的数据
          });
          if (res.data.data.userAddress) {
            my.setStorage({
              key: 'add', // 缓存数据的key
              data: res.data.data.userAddress,
            });
          }
          if ((res.data.data.residueRedNum - 0) > 0) {
            this.setData({
              maskFlag: true
            })
          }
        }
      })
    },
    lookPart() {//查看我的环保推广团
      if(this.data.userInfoMore.hasGroup) {
        my.navigateTo({
          url: '../member/inviteRecord/inviteRecord'
        });
      }
    },
    lookStep() {//查看环保等级
      this.setData({
        step: !this.data.step,
      })
    },
    lookTan() {//查看碳排放量
      this.setData({
        tan: !this.data.tan,
      })
    },
    onClicks(e) {
      const _this = this;
      let num = e.target.targetDataset.name || e.target.dataset.name
      switch (num) {
        case "编辑资料":
          my.navigateTo({
            url: '/pages/editorData/editorData'
          });
          break;
        case "地址簿":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/address/address'
          });
          break;
        case "兑换中心":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/vouchers/exchange/exchange'
          });
          break;
        case "玩法规则":
          my.navigateTo({
            url: `/pages/webView/webView?url=https://miniapp.shishangbag.vip/web_rule/index.html`
          });
          break
        case "环保账单":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/member/bill/bill'
          });
          break;
        case "邀请好友":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/member/memberRank/memberRank?share_mask=1'
          });
          break;
        case "拾尚包":
          my.navigateTo({
            url: '/pages/bao/bao'
          });
          break;
        case "提现账户":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/bank/bank'
          });
          break;
        case "关于拾尚包":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/aboutMe/aboutMe'
          });
          break;
        case "地推二维码":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/twoBarCode/twoBarCode'
          });
          break;
        case "意见反馈":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '../advice/advice'
          });
          break;
        case "收益":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/earnings/earnings'
          });
          break;
        case "提现记录":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/tiXian/tiXian'
          });
          break;
        case "错误投递":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/delivery/delivery'
          });
          break;
        case "在线客服":
          my.navigateTo({
            url: '/pages/contact-button/contact-button'
          });
          break;
        case "修改密码":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/changePwd/changePwd'
          });
          break;
        case "提现":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/withdrawal/withdrawal'
          });
          break;
        case "我的卡券":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/vouchers/typeList/typeList'
          });
          break;
        case "提现审核":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.navigateTo({
            url: '/pages/approve/approve'
          });
          break;
        case "设置":
          if (!this.data.userInfo.id) {
            this.toLogin()
            return false;
          }
          my.openSetting({
            success: (res) => {
            }
          })
          break;
        case "退出":
          my.confirm({
            title: '温馨提示',
            content: '确定退出登录吗？',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            success: (result) => {
              if (result.confirm) {
                //同意协议信息
                let agreement = my.getStorageSync({
                  key: 'agreement'
                })
                let changeType = my.getStorageSync({
                  key: 'changeType'
                })
                //清除用户数据
                my.clearStorage()
                my.setStorageSync({
                  key: 'agreement',
                  data: agreement.data,
                });
                my.setStorageSync({
                  key: 'changeType',
                  data: changeType.data,
                });
                _this.setData({
                  userInfoMore: {},
                  userInfo: {},
                  logins: false
                })
                my.navigateTo({
                  url: '/pages/login/login'
                });
              }
            },
          });
          break;
        default:
          break;
      }
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
    gologin() {
      my.navigateTo({
        url: '/pages/login/login'
      });
    },
    //拨打客服电话
    tocall(e) {
      my.makePhoneCall({ number: e.currentTarget.dataset.phoneNum });
    },
    //关闭模板
    closermask() {
      this.setData({
        maskFlag: false
      })
      const _this = this
      const param = {
        userId: this.data.userInfo.id,
      };
      request.post("user/rest/user/getUserInfo", param).then(res => {
        if (res.data.code === 0) {
          _this.setData({
            userInfoMore: res.data.data,
          });
          my.setStorageSync({
            key: 'userInfoMore',
            data: res.data.data
          });
          if (res.data.data.userAddress) {
            my.setStorageSync({
              key: 'add',
              data: res.data.data.userAddress
            });
          }
        }
      })
    },
    //开红包
    openRed() {
      let param = {
        userId: this.data.userInfo.id
      }
      request.get("user/rest/redEnvelope/userRedEnvelope", param).then(res => {
        if (res.data.code == 0) {
          this.setData({
            redMoney: res.data.data.redMoney,
            residueRedNum: res.data.data.residueRedNum,
            redFlag: false
          })
          if (res.data.data.residueRedNum == 0) {
            my.showToast({
              icon: "none",
              content: `您已没有抽取红包次数`,
              duration: 1500,
            });
          } else {
            my.showToast({
              icon: "none",
              content: `您还有${res.data.data.residueRedNum}次抽取红包次数，请再次点击抽取`,
              duration: 1500,
            });
          }
        }
      })
    },
    showRed() {
      if ((this.data.residueRedNum - 0) > 0) {
        this.setData({
          redFlag: true
        })
      } else {

      }
    },
    onPullDownRefresh() {
      const _this = this;
      let res = my.getStorageSync({
        key: 'userInfo'
      });
      if (res.data == null) {
        this.setData({
          userInfo: {},
          logins: false
        })
        return false;
      }
      this.setData({
        userInfo: res.data,
        logins: true
      });
      const param = {
        userId: res.data.id,
      };
      //获取个人中心信息
      if (res.data == null) {
        return false;
      }
      request.post("user/rest/user/getUserInfo", param).then(res => {
        if (res.data.code === 0) {
          // res.data.data.residueMoney = (res.data.data.residueMoney - 0).toFixed(2).toString().split(".")
          // res.data.data.totalDeposit = (res.data.data.totalDeposit - 0).toFixed(2).toString().split(".")
          // res.data.data.totalErrWeight = (res.data.data.totalErrWeight - 0).toFixed(2).toString().split(".")
          _this.setData({
            userInfoMore: res.data.data,
          });
          my.setStorage({
            key: 'userInfoMore', // 缓存数据的key
            data: res.data.data, // 要缓存的数据
          });
          if (res.data.data.userAddress) {
            my.setStorage({
              key: 'add', // 缓存数据的key
              data: res.data.data.userAddress,
            });
          }
        }
      })
      my.stopPullDownRefresh();
    }
  }
});