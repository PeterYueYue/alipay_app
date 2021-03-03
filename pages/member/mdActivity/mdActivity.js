const request = require("../../../utils/request.js");
var app = getApp();
var time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    imgUrl: app.globalData.imgUrl,
    add: {}, //地址数据
    addressStatus: false,//是否选择了上门地址的状态
    animationData:{},
    list:[
      {
        tel:"---",
        date:'---'
      }
    ],
    isShowBox:false,
    bagCount:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    let userInfo = my.getStorageSync({key:'userInfo'});userInfo=userInfo.data
    let add = my.getStorageSync({key:'add'});add=add.data
    if (add) {
      this.setData({
        addressStatus: true,
        add: add,
      })
    } else {
      this.setData({
        addressStatus: false,
        add: {},
      })
    }

    if (!userInfo) {
      return;
    }
    this.setData({userInfo: userInfo,},() => {
      this.getFriendList();
      time = setInterval(() => {
        this.getBagCount();
      },1000)
    })

  },
  getBagCount(){
    let data ={ type:"ropeBundle"}
    request.post("user/rest/user/typeRemainingNumber",data).then(res => {
      this.setData({bagCount:res.data.data.number})
    })
  },
  buy(e) {
    if(!this.data.add.id) {
      my.showToast({
          type: "none",
          content: "请填写地址",
        });
      return;
    }
    let param = {
      userId: this.data.userInfo.id,
      addressId: this.data.add.id,
      sendFlag: 9
    }
    if(this.data.add.cityName != '上海市'&& e.currentTarget.dataset.status == 2){
      my.showToast({
        type: "none",
        content: "当前区域暂未开通服务",
        duration: 1500,
      });
      return;
    }
    this.setData({
      status: true,
    })
    request.post("user/rest/user/member.registered?userId="+param.userId+"&addressId="+param.addressId+"&sendFlag="+param.sendFlag).then(res => {
      this.setData({
        status: false,
      })
      if (res.data.code == 0) {
        this.getFriendList();
        this.setData({isShowBox:false})
        my.showToast({
          type: "none",
          content: "领取成功",
          duration: 1500,
         
        });
      }
    });
  },
  toAddress() {
    my.navigateTo({
      url: `/pages/address/address?status=2`
    });
  },
  // 动画效果
  initAnimation(e){
    let animation = my.createAnimation({
      duration:"200",
      timingFunction:"ease"
    });
    this.animation = animation;
    if(e.target.id == "shade"){
      animation.height("0rpx").step();
      this.setData({isShowBox:false},()=>{
        this.setData({
          animationData:animation.export(),
        })
      })
    }else if(e.target.id == 'btnTap') {
      animation.height("428rpx").step();
      this.setData({isShowBox:true},()=>{
        this.setData({
          animationData:animation.export(),
        })
      })
    }
    
  },
  getFriendList(){
    let data ={ userId:this.data.userInfo.id }
    request.post("user/rest/user/inviteesInfo",data).then(res => {
      this.setData({list:res.data.data.list,received:res.data.data.received});
      my.stopPullDownRefresh()
      console.log(res);
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(time);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getFriendList()
    this.getBagCount()
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

    return {
      title: '加入我的环保团队，为保护地球出一份力！',
      // desc: '拾尚包环保',
      imageUrl: app.globalData.imgUrlNew + "yy/dnActivity/sharePic2.png",
      path: `pages/member/member/member?id=${this.data.userInfo.id}`,
    };


  }
})