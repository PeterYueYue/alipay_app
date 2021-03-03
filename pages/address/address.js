const request = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    status: 1,
    addList: [],
    showMOdal: false,//删除的弹框
    imgUrl: app.globalData.imgUrl,
    status1: 0
  },
  onLoad(e) {
    if (e.status) {
      this.setData({
        status: e.status
      })  
    }
  },
  onShow() {
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    if (userInfo.data==null) {
      my.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      let data = {
        userId: userInfo.data.id
      }
      this.getList(data);
      request.post("user/rest/user/getUserInfo", data).then(res => {
        if (res.data.code == 0) {
          if (res.data.data.userAddress) {
            my.setStorage({
              key: 'add', // 缓存数据的key
              data: res.data.data.userAddress,
            });
          }
        }
      })
    }
    
  },
  getList(data) {
    request.get('user/rest/address/getAddressList', data).then((res) => {
      if (res.data.code == 0) {
        let status1 = 0;
        if(res.data.data.length == 0){
          status1 = 1
        }
        this.setData({
          addList: res.data.data,
          status1
        })
      }

    })
  },
  goBack(e) {
    let add = e.currentTarget.dataset.add
    my.setStorage({
      key: 'add', // 缓存数据的key
      data: add, // 要缓存的数据
      success: (res) => {

      },
    });
    my.navigateBack()
  },
  edit(e) {

    my.navigateTo({
      url: `/pages/new-address/new-address?data=${JSON.stringify(e.currentTarget.dataset.add)}&title=修改地址`
    });
  },
  delete(e) {
    let add = my.getStorageSync({ key: "add" })
    my.confirm({
      title: '温馨提示',
      content: '确定删除吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          let data = { addressId: e.currentTarget.dataset.delId }
          request.get("user/rest/address/delAddress", data).then((res) => {
            if (res.data.code == 0) {
              if (add && (add.data.id == e.currentTarget.dataset.delId)) {
                my.removeStorage({ key: 'add' });
              }
              let userInfo = my.getStorageSync({
                key: 'userInfo'
              });
              let data = {
                userId: userInfo.data.id
              }
              this.getList(data);
            }
          })
        }
      },
    });
  },
  goToNewAddress: function() {
    my.navigateTo({
      url: '/pages/new-address/new-address?title=新建地址'
    });
  },
  onPullDownRefresh() {
    let userInfo = my.getStorageSync({
      key: 'userInfo'
    });
    if (userInfo.data==null) {
      my.navigateTo({
        url: '/pages/login/login'
      });
    } else {
      let data = {
        userId: userInfo.data.id
      }
      this.getList(data);
    }
    const param = {
      userId: userInfo.data.id,
    };
    this.getList(param)
    my.stopPullDownRefresh();
  }
});
