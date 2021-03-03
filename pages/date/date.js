const request = require("../../utils/request.js");
const util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    tabs: [],
    text: '',
    time: {},
    t_index: 0,
    weightId:0,
    isAgree:true,
    isOpen:false,
    userInfo: {},
  },
  onLoad(e) {
    this.setData({ 
     weightId: e.weightId,
     providerId:e.providerId
    },() => {
      if(e.type == 'appliance'){
        this.getApplianceData(e)
      }else{
        this.getData(e);
      }
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    let date =my.getStorageSync({
      key: 'date', // 缓存数据的key
    }); 
    if(date.data){
      this.setData({
        text:date.data.remark
      })
    }
    let userInfo =my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    }); 
    if(userInfo.data) {
      this.setData({
        userInfo:userInfo.data,
      })
    }
  },
  //同意按钮
  changeAgree(){
    this.setData({ isAgree: !this.data.isAgree})
  },
  //获取服务商时间
  getApplianceData(e){
    const _this = this
    let add = my.getStorageSync({key:"add"});add=add.data;
    let userInfo = my.getStorageSync({key:'userInfo'}); userInfo= userInfo.data;
    let data = {
      providerId:e.providerId,
      userAddressId: add.id,
      userId:userInfo.id
    }
    request.post('order/rest/resserveOrder/getAddressTimeByProviderId', data).then((res) => {
       if (res.data.code == 0) {
        let list = []
        res.data.data.map((v, i) => {
          let num = {}
          num.street = res.data.data.street
          num.year = v.reserveDate
          num.week = "星期" + v.week
          num.title = v.reserveDate + " " + "星期" + v.week
          num.anchor = i
          list.push(num)
        })
        this.setData({
          tabs: list
        })
        if (list.length > 0) {
          this.setData({
            time: list[0]
          })
        }
        this.setData({ isOpen: true })
      } else {
        this.setData({ isOpen:false})
      }
    })
  },
  //初始化数据
  getData(e) {
    const _this = this
    let add = my.getStorageSync({key:"add"});add=add.data;
    let userInfo = my.getStorageSync({key:'userInfo'}); userInfo= userInfo.data;
    let data = {
      providerId:e.providerId,
      userAddressId: add.id,
      userId:userInfo.id
    }
    
    request.post('order/rest/resserveOrder/getAddressTime', data).then((res) => {
      if (res.data.code == 0) {
        let list = []
        res.data.data.result.map((v, i) => {
          let num = {}
          num.street = res.data.data.street
          num.year = v.reserveDate
          num.week = "星期" + v.week
          num.title = v.reserveDate + " " + "星期" + v.week
          num.anchor = i
          list.push(num)
        })
        this.setData({
          tabs: list
        })
        if (list.length > 0) {
          this.setData({
            time: list[0]
          })
        }
      } 
    })
  },
  tap(e) {
    this.setData({
      time: e.currentTarget.dataset.item,
      t_index: e.currentTarget.dataset.index
    })
  },
  input(e) {
    this.setData({
      text: e.detail.value
    })
  },
  btn(e) {
    let data = this.data.time
    my.setStorage({
      key: 'date', // 缓存数据的key
      data: data, // 要缓存的数据
      success: (res) => {my.navigateBack()},
    });
    
  },
  onSubmit(e){//德邦物流推送消息
    //获取formId
    // console.log(e.detail.formId);
    // if(!this.data.click) {//暂未开通点击确定
    //   my.navigateBack();
    //   return false;
    // }
    let data = this.data.time
    data.remark = this.data.text;
    if (this.data.isAgree) {
      data.formId = e.detail.formId;
    }
    my.setStorage({
      key: 'date', // 缓存数据的key
      data: data, // 要缓存的数据
      success: (res) => {},
    });
    my.navigateBack();
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
