var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    list:[],
    imgUrl: app.globalData.imgUrl
  },
  onLoad() {
    
  },
  handleInput(e){
    
    let data = {
      categoryName: e.detail.value
    }
    if (e.detail.value == ''){
      this.setData({
        list: []
      })
    }
    request.get('user/rest/category/getSearchCategory',data).then((res)=>{
      
      if(res.data.code == 0){
        this.setData({
          list:res.data.data
        }) 
      }
    })
  }
});
