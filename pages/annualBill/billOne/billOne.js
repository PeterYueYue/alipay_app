var app = getApp();
const request = require("../../../utils/request.js");
Page({
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    step: 1,
    bglist: {
      bg1: app.globalData.imgUrlNew + 'yy/bill/bg1.png',
      bg2: app.globalData.imgUrlNew + 'yy/bill/bg2.png',
      bg3: app.globalData.imgUrlNew + 'yy/bill/bg3.png',
      bg4: app.globalData.imgUrlNew + 'yy/bill/bg4.png',
      bg2word: app.globalData.imgUrlNew + 'yy/bill/bg2word.png',
      bg3word: app.globalData.imgUrlNew + 'yy/bill/bg3word.png',
      bg4word: app.globalData.imgUrlNew + 'yy/bill/bg4word.png',
    },
    current: 0,
    series: [
      {
        type: '纸类0',
        data: 1,
      },
      {
        type: '塑料0',
        data: 1,
      },
      {
        type: '金属0',
        data: 1,
      },
      {
        type: '玻璃0',
        data: 1,
      },
      {
        type: '衣物0',
        data: 0,
      },
      {
        type: '电子废弃物0',
        data: 0,
      },
      {
        type: '复合纸包装0',
        data: 0,
      },
      {
        type: '其他低值物0',
        data: 0,
      },
    ],
    radius: 0.8,
    innerRadius: 0.6,
    legend: {
      position: 'right',
    },
    myWeightData: {},
    showSeries: false,
  },
  onLoad() {

  },
  onShow() {
    my.setNavigationBar({
      title: '年度账单',
      backgroundColor: '#108ee9',
    });
    let userInfo = my.getStorageSync({ key: 'userInfo', }); userInfo = userInfo.data;
    let userInfoMore = my.getStorageSync({ key: 'userInfoMore', }); userInfoMore = userInfoMore.data;
    if (!userInfo) {
      this.toLogin();
      return;
    }
    this.setData({
      userInfo: userInfo,
      userInfoMore: userInfoMore,
    })
    this.getmyWeightData(userInfo.id);
  },
  open() {
    let that = this;
    that.setData({
      step: 2,
    })
  },
  onChange: function (e) {
    this.setData({
      current: e.detail.current,
    });
  },
  touchStart(e) {
    var that = this;
    that.setData({
      touchx: e.changedTouches[0].clientX,
      touchy: e.changedTouches[0].clientY
    })
  },
  touchEnd(e) {
    var that = this;
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let turn = "";
    // if (x - that.data.touchx > 50 && Math.abs(y - that.data.touchy) < 50) {
    //   turn = "right";
    // } else if (x - that.data.touchx < -50 && Math.abs(y - that.data.touchy) < 50) {
    //   turn = "left";
    // }
    if (y - that.data.touchy > 50 && Math.abs(x - that.data.touchx) < 50) {
      turn = "down";
    } else if (y - that.data.touchy < -50 && Math.abs(x - that.data.touchx) < 50) {
      turn = "up";
    }
    //根据方向进行操作
    if (turn == 'down') {
      let number = this.data.step;
      if (number == 2) {
        return;
      }
      number -= 1;
      this.setData({
        step: number,
      })
    }
    if (turn == 'up') {
      let number = this.data.step;
      if (number == 1) {//首页禁止下滑
        return;
      }
      if (number <= 2) {
        that.setData({
          series: [],
          showSeries: true,
        })
      }
      if (number == 3) {
        this.getDetail(this.data.userInfo.id);
      }
      if (number == 4) {//跳转
        my.navigateTo({
          url: '/pages/annualBill/bill/bill',
        })
        return;
      }
      number += 1;
      this.setData({
        step: number,
      })
      console.log(number)
    }

  },
  getDetail(id) {
    let that = this;
    let prarm = {
      userId: id,
      year: '2020',
    }
    request.post(`user/rest/user/annualStatement?userId=` + prarm.userId + '&year=' + prarm.year).then(res => {
      if (res.data.code == 0) {
        let myWeightData = {};
        myWeightData = res.data.data;
        myWeightData.year = res.data.data.registerDate.slice(0, 4)
        myWeightData.month = res.data.data.registerDate.slice(5, 7)
        myWeightData.day = res.data.data.registerDate.slice(8, 10)
        this.setData({ myWeightData: myWeightData })
        let series = []
        res.data.data.userRegenerantWeightList.map((e) => {
          let obj = {};
          obj.type = e.name + e.weight
          obj.data = parseInt(e.weight);
          obj.a = 1;
          series.push(obj)
        })
        setTimeout(function() {
          that.setData({
            series: series,
            showSeries: true,
          })
        },2000)
      }
    });
  },
  getmyWeightData(id) {
    let prarm = {
      userId: id,
      year: '2020',
    }
    request.post(`user/rest/user/annualStatement?userId=` + prarm.userId + '&year=' + prarm.year).then(res => {
      if (res.data.code == 0) {
        let myWeightData = {};
        myWeightData = res.data.data;
        myWeightData.year = res.data.data.registerDate.slice(0, 4)
        myWeightData.month = res.data.data.registerDate.slice(5, 7)
        myWeightData.day = res.data.data.registerDate.slice(8, 10)
        this.setData({ myWeightData: myWeightData })
      }
    });
  },
  toLogin() {
    my.confirm({
      title: '温馨提示',
      content: '您还未登录，确定去登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          my.navigateTo({
            url: '/pages/login/login'
          });
        } else {
          my.redirect({
            url: '/pages/index/index'
          });
        }
      },
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '环保账单',
      desc: this.data.userInfoMore.name + this.data.month + '在' + this.data.area + '排名第' + this.data.rankIndex + '位',
      bgImgUrl: app.globalData.imgUrlNew + "yy/member/sharerank.png",
      path: 'pages/index/index',
    };
  },
});
