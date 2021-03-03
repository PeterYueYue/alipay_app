const request = require("../../../utils/request.js");
var app = getApp();
var isDisable = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    projectList:[],
    userName:'',
    mobile:'',
    expressNo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = JSON.parse(options.item)
    item.express = item.express.slice(1,-1).replace(/"/g,"").replace(/,/g,"、");
    this.setData({item})
    this.donationDetail(item)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    
    

  },
  // 提交
  submit(){
    if(!isDisable){return}
    isDisable = false
    var reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (this.data.userName == "") {
      my.showToast({
        type:'none',
        content: '请填写发件人姓名',
        duration: 1500,
      });
      return false;
    }
    if (this.data.mobile == "") {
      my.showToast({
        type: 'none',
        content: '请填写手机号',
        duration: 1500,
      });
      return false;
    }
    if (!reg.test(this.data.mobile)) {
      my.showToast({
        type:'none',
        content: '请填写正确的手机号',
        duration: 1500,
      });
      return false;
    }
    if (this.data.expressNo == "") {
      my.showToast({
        type: 'none',
        content: '请填写物流单号',
        duration: 1500,
      });
      return false;
    }
    let list = []
    this.data.projectList.map(e => {
      
      let obj = {
        "current" : e.count,
        "id":e.id
      }
      if(e.count>0){
        list.push(obj)
      }
      
    })
    if (list.length<1) {
      my.showToast({
        type: 'none',
        content: '请输入捐赠物品数量',
        duration: 1500,
      });
      return false;
    }

    let userInfo = my.getStorageSync({key: "userInfo"});userInfo=userInfo.data;
    request.post("user/open/donation/donationSubmit",JSON.stringify({
      projectId:this.data.item.id,
      userId:userInfo.id,
      userName:this.data.userName,
      mobile:this.data.mobile,
      mailNo:this.data.expressNo,
      ssbDonationGoodsList:list
    })).then(res => {
      my.showToast({
        type:'success',
        duration:2000,
        content: res.data.message,
        success:() => {
          my.redirectTo({
            url: '/pages/publicBenefit/success/success?item='+JSON.stringify(this.data.item),
          })
        }
      })
    })
    setTimeout(() => {
      isDisable = true
    },3000)
    
  },
  changeInput(e){
    let index = e.currentTarget.dataset.data;
    let value = e.detail.value;
    let projectList = this.data.projectList;
    projectList[index].count = value;
    this.setData({projectList:projectList})
  },
  changeuserName(e){
    this.setData({userName:e.detail.value})
  },
  changeMobile(e){
    this.setData({mobile:e.detail.value})
  },
  changeExpress(e){
    this.setData({expressNo:e.detail.value})
  },
  // 捐赠详情
  donationDetail(item){
    request.post("user/open/donation/donationProjectDetail",JSON.stringify({
      id:item.id
    })).then(res => {
      console.log(res)

      let list = res.data.ssbDonationGoodsList.map(e => {
        e.count = ""
        return e;
      })
      this.setData({projectList:list})
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})