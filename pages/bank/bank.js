var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    num:'123456789123456789',
    userInfo:{},
    imgUrl: app.globalData.imgUrl,
    list:[],
    status:0
  },
  onLoad(query) {
    // 页面加载
  },
  onReady() {
    // 页面加载完成
    const num1=this.data.num.replace(/\s/g,'').replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** $2")
    this.setData({
        num:num1
      })
    
  },
  //删除
  delete(e){ 
    const _this = this
    my.confirm({
      title: '温馨提示',
      content: '确定删除吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
       if(result.confirm){
         let data = { cardId: e.currentTarget.dataset.id }
         request.get(`user/rest/user/deleteUserCard`,data).then((res)=>{
           if(res.data.code == 0){
             _this.getList()  
           }
         })
       }
      },
    });
  },
  //获取银行卡列表
  getList(){
    let data = {
      userId:this.data.userInfo.id
    }
    request.get(`user/rest/user/getUserCardList`,data).then((res)=>{
      if(res.data.code == 0){
        let status = 0
        if(res.data.data.length!==0){
          res.data.data.map((item,index)=>{
            item.cardNo = item.cardNo.replace(/\s/g,'').replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** $2")
          })
        }else{
          status = 1
        }
        this.setData({
          list:res.data.data,
          status
        })
      }
    })
  },
  onShow() {
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfo:userInfo.data
    })
    this.getList()
  },
  push:function(){
    my.navigateTo({
      url: '/pages/bank_step1/bank_step1'
    });
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
