const request = require("../../../utils/request.js");
var app = getApp();

Page({
  data: {
    donationList:[],
  },
  onLoad() {
  },
  onReady() {
  },
  onShow() {
    this.donationList();
  },
  donationList(){
    request.get("user/open/donation/donationProjectList").then(res => {
      this.setData({donationList:res.data});
    })
  },
  gobenefitDetail(e){
    let item = e.currentTarget.dataset.data;
    my.navigateTo({
      url: '/pages/publicBenefit/benefitDetail/benefitDetail?id='+item.id+'&type='+item.projectType,
    })
  },
  onUnload() {
  },
  onHide() {
  }
});