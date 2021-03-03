const request = require("../../utils/request.js");
import parse from 'mini-html-parser2';
Page({
  data: {
    nodes:[]
  },
  onLoad(query) {
    // 页面加载
    const param = {mediaId: query.id };
    request.get("user/rest/banner/getMediaDetail",param).then(res => {
      if (res.data.code===0) {
        let mediaContent = res.data.data.mediaContent
        mediaContent = mediaContent.replace("<img","<img style='height：100%;width:100%'")
        parse(mediaContent, (err, nodes) => {
          if (!err) {
            this.setData({
              nodes,
            });
          }
        })
      }
    }) 
  },
  onReady() {
  },
  onShow() {
    // 页面显示
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
