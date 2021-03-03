const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    quan: '123',
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
  },
  onLoad(e) {
    //判断是我们register跳过来
    if (e.param != "") {
      this.setData({
        quan: e.param,
      })
    }
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
  },
  open() {
    if (this.data.quan != '' && this.data.quan !=undefined) {
      my.setClipboard({
        text: this.data.quan, // 剪贴板数据
        success: (res) => { 
          my.alert({
            title: this.data.quan,
            content: '兑换码复制成功,可立即兑换',
            buttonText: '我知道了',
            success: () => {
              my.navigateTo({
                url: `/pages/vouchers/exchange/exchange`
              });
            }
          });
        },
      });
    } else {
      my.navigateTo({
        url: `/pages/vouchers/exchange/exchange`
      });
    }

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
