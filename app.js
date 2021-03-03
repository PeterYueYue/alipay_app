if (!my.canIUse('plugin') && !my.isIDE) {
  my.ap && my.ap.updateAlipayClient && my.ap.updateAlipayClient();
}
const request = require("./utils/request.js");
App({
  data: {
    isIphoneX: false,
  },
  onLaunch(options) {
    //判断天猫跳转
    if (options && options.query && options.query.tianmao) {
      this.globalData.tianmao = options.query.tianmao;
    }
    //判断环境
    // https://ds.alipay.com/?scheme=alipays://platformapi/startapp?appId=2019090266827440&page=pages/member/member/member&query=tianmao
    this.isIphoneX();
    // 获取到地推人员id
    if (options && options.query && options.query.qrCode) {
      this.globalData.pushId = options.query.qrCode.split('pushId=')[1];
    }
    // 获取到拾尚包二维码
    if (options && options.query && options.query.qrCode) {
      this.globalData.code = options.query.qrCode.split('code=')[1];
    }
    // 获取绿色小程序传过来的id
    if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.sourceId) {
      //绿色账户banner图跳过来
      this.globalData.sourceId = options.referrerInfo.extraData.sourceId
    }
    // 绿色账户小程序加密数据
    if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.extraData) {
      this.globalData.encodeData = options.referrerInfo.extraData.extraData;
    }
    if (options && options.query && options.query.qrCode) {
      if (options.query.qrCode.indexOf('encData=') != -1) {// 获取iot数据
        this.globalData.iotEncData = options.query.qrCode.split('encData=')[1];
      }
      if (options.query.qrCode.indexOf('id=') != -1) {// 获取环保推广团团长id
        this.globalData.leaderId = options.query.qrCode.split('id=')[1];
      }
      if (options.query.qrCode.indexOf('obi=') != -1) {
        this.globalData.obi = options.query.qrCode.split('obi=')[1];//获取达能口罩码
      }

    }


    // 分享 双十一活动
    // if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.userId) {
    //   this.globalData.userId = options.referrerInfo.extraData.userId
    // }


    // 新手领券初始化
    // let newUser = my.getStorageSync({
    //   key: 'newUser'
    // })
    // if (!newUser.data) {
    //   my.setStorageSync({
    //     key: 'newUser',
    //     data: {
    //       index: true,
    //       myVoucher: true,
    //       timelogin: true,
    //       appointment: true,
    //     },
    //     success: (result) => {
    //     }
    //   });
    // }

  },
  onShow(options) {
    //判断天猫跳转
    if (options && options.query && options.query.tianmao) {
      this.globalData.tianmao = options.query.tianmao;
    }
    this.UpDate();
    // 获取到地推人员id
    if (options && options.query && options.query.qrCode) {
      this.globalData.pushId = options.query.qrCode.split('pushId=')[1];
    }
    // 获取到拾尚包二维码
    if (options && options.query && options.query.qrCode) {
      this.globalData.code = options.query.qrCode.split('code=')[1];
    }
    // 获取绿色小程序传过来的id
    if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.sourceId) {
      //绿色账户banner图跳过来
      this.globalData.sourceId = options.referrerInfo.extraData.sourceId
    }
    // 绿色账户小程序加密数据
    if (options && options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.extraData) {
      this.globalData.encodeData = options.referrerInfo.extraData.extraData;
    }
   
    // 获取环保推广团团长id
    if (options && options.query && options.query.qrCode) {
      if (options.query.qrCode.indexOf('encData=') != -1) {// 获取iot数据
        this.globalData.iotEncData = options.query.qrCode.split('encData=')[1];
      }
      if (options.query.qrCode.indexOf('id=') != -1) {
        this.globalData.leaderId = options.query.qrCode.split('id=')[1];
      }
      if (options.query.qrCode.indexOf('obi=') != -1) {
        this.globalData.obi = options.query.qrCode.split('obi=')[1];//获取达能口罩码
      }
    }
  },
  onHide() {
    //小程序从前台进入后台
  },
  onError(msg) {
    // 小程序发生脚本错误或 API 调用出现报错
  },
  globalData: {
    // 全局数据
    imgUrl: 'http://image.shishangbag.vip/upload/img/web/image/',//线上 img地址
    imgUrl1: 'http://image.shishangbag.vip/upload/img/web/',
    imgUrlNew: 'http://image.shishangbag.vip/upload/img/web/',//线上新图片地址
    pushId: '',//地推人员身份id
    code: '',//拾尚包二维码
    sourceId: '',//绿色小程序传过来id
    // userId: '' // 分享用户Id
    encodeData: '',//绿杖加密数据
    iotEncData: '',//iot数据
    tianmao: '',//天猫跳转
    obi: '',//赢创扫码
  },
  isIphoneX() {
    var promise = new Promise((resolve, reject) => {
      my.getSystemInfo({
        success: (res) => {
          let isIphoneX = false;
          switch (res.model) {
            case "iPhone X":
              isIphoneX = true
              break;
            case "iPhone10,3":
              isIphoneX = true
              break;
            case "iPhone10,6":
              isIphoneX = true
              break;
            case "iPhone10,3":
              isIphoneX = true
              break;
            case "iPhone11,2":
              isIphoneX = true
              break;
            case "iPhone11,6":
              isIphoneX = true
              break;
            case "iPhone11,8":
              isIphoneX = true
              break;
            case "iPhone XR<iPhone11,8>":
              isIphoneX = true
              break;
            case "iPhone XR":
              isIphoneX = true
              break;
            case "iPhone X":
              isIphoneX = true
              break;
            case "iPhone XS":
              isIphoneX = true
              break;
            case "iPhone XS Max":
              isIphoneX = true
              break;
            case "iPhone 11":
              isIphoneX = true
              break;
            case "iPhone 11 Pro":
              isIphoneX = true
              break;
            case "iPhone 11 Pro Max":
              isIphoneX = true
              break;
          }
          resolve(isIphoneX)
        }
      })

    }).then((res) => {
      this.data.isIphoneX = res
    })

  },

  UpDate() {
    if (my.getUpdateManager()) {
      const updateManager = my.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
      })
      updateManager.onUpdateReady(function () {
        my.confirm({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        my.confirm({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel: false
        })
      })
    } else if (!my.canIUse('request')) {
      my.alert({
        title: '提示',
        content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
      });
    }
  },

});
