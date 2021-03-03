const request = require("../../utils/request.js");
var app = getApp();
Page({
  data: {
    status: 1,
    addList: [],
    showMOdal: false,//删除的弹框
    imgUrlNew: app.globalData.imgUrlNew,
    status1: 0,
    num: 0,//选中服务商
    list: [
      {
        name: "其他低值物",
        value: "50拾尚币/kg",
      },
      {
        name: "其他低值物",
        value: "50拾尚币/kg",
      },
      {
        name: "其他低值物",
        value: "50拾尚币/kg",
      },
    ],
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
  choose(e) {//选择服务商
    console.log(e)
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
