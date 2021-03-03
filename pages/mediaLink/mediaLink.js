Page({
  data: {
    url:''
  },
  onLoad(e) {
    this.setData({
      url:e.url
    })
  },
  onShareAppMessage(options) {
    return {
      title: '分享 web-View 组件',
      desc: 'View 组件很通用',
      path: 'page/component/component-pages/webview/baidu',
      'web-view': options.webViewUrl,
    };
  },
  onmessage(e){

  }
});
