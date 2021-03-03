Page({
  data: {
    userInfoMore: {},
  },
  onLoad() {},
  onShow() {
    let userInfoMore = my.getStorageSync({
      key: 'userInfoMore', // 缓存数据的key
    });
    if (userInfoMore.data) {
      this.setData({
        userInfoMore: userInfoMore.data,
      })
    }
  },
});
