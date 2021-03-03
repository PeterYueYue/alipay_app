var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    leftMenuList: [],
    // 右侧的数组
    rightList: [],
    // 选中的菜单的索引
    currentIndex: 0,
    // 右侧滚动条的距离顶部的位置
    scrollTop: -1,
    imgUrl: app.globalData.imgUrl,
    pageIndex: 1,
    pageSize: 20

  },
  top: [],
  getList() {
    let data = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
    }
    request.get('user/rest/category/getCategoryList', data).then((res) => {
      if (res.data.code == 0) {
        let list = res.data.data.map(v => ({ content: v.listCategory.content }))
        let rightList = []
        let index = this.data.currentIndex
        if (this.data.pageIndex == 1) {
          return false
        } else {
          rightList = this.data.rightList.map((v, i) => ({ content: [...v.content, ...list[i].content] }))
        }
        this.setData({
          rightList
        })

      }
    })
  },
  handleMenuChange(e) {
    const { index } = e.currentTarget.dataset;
    let scrollTop = 0
    if (this.data.scrollTop == 0 && !this.top[index]) {
      scrollTop = -1
    } else if
      (this.data.scrollTop == -1 && !this.top[index]) {
      scrollTop = 0
    } else {
      scrollTop = this.top[index]
    }
    this.setData({
      currentIndex: index,
      scrollTop

    })

  },
  lower(e) {
    let index = this.data.currentIndex
    if ((this.data.pageIndex - 0) >= (this.data.leftMenuList[index].totalPages - 0)) {
      return false;
    }
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this.getList()
  },
  scroll(e) {
    this.top[this.data.currentIndex] = e.detail.scrollTop
  },
  search() {
    my.navigateTo({
      url: '/pages/search/search'
    });
  },
  onLoad(query) {
    let data = {
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize,
    }
    request.get('user/rest/category/getCategoryList', data).then((res) => {
      if (res.data.code == 0) {
        let index = this.data.currentIndex

        let leftMenuList = res.data.data.map(v => ({ title: v.parentName, totalPages: v.listCategory.totalPages }))
        let rightList = res.data.data.map(v => ({ content: v.listCategory.content }))

        leftMenuList[2].title = "可回收物"
        this.setData({
          leftMenuList,
          rightList
        })

      }
    })
  },
  onReady() {
    // 页面加载完成
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
    console.log(1111)
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