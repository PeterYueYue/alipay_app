const request = require("../../../utils/request.js");
var app = getApp();
const QR = require("../../../utils/qrcode.js");
function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    my.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}
function createRpx2px() {
  const { windowWidth } = my.getSystemInfoSync()
  return function (rpx) {
    return windowWidth / 750 * rpx
  }
}
const rpx2px = createRpx2px();
Page({
  data: {
    series: [
      {
        type: '纸类              0',
        data: 0,
      },
      {
        type: '塑料              0',
        data: 0,
      },
      {
        type: '金属              0',
        data: 0,
      },
      {
        type: '玻璃              0',
        data: 0,
      },
      {
        type: '衣物              0',
        data: 0,
      },
      {
        type: '电子废弃物   0',
        data: 0,
      },
      {
        type: '复合纸包装   0',
        data: 0,
      },
      {
        type: '其他低值物   0',
        data: 0,
      },
    ],
    radius: 0.85,
    innerRadius: 0.7,
    legend: {
      position: 'right',
    },
    imgUrl: app.globalData.imgUrl,
    imgUrlNew: app.globalData.imgUrlNew,
    userInfo: {},
    month: '当月', //选择月份
    area: '',//选择区域
    open: true,
    array: [],
    areaNameList: [],
    areaIdList: [],
    myInfo: {//加入数据
      days: 0,
      sendNumber: 0,
      totalWeight: 0,
      carbonReducing: '***',
      trees: '***',
    },
    showChart: false,
    myInfo: [],
    tYear: '',//月份
    rankIndex: 0,//排行
    theFirst: {
      name: "---",
      level: "---",
      carbonReducingM: "---"
    },
    theSecond: {
      name: "---",
      level: "---",
      carbonReducingM: "---"
    },
    theThird: {
      name: "---",
      level: "---",
      carbonReducingM: "---"
    },
    share_mask: false,
    dateStr: "----年--月",
    imgUUrr: "",
    isShowCanvas: false,
    responsiveScale: 0.5,
  },
  onLoad(e) {
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {// 页面显示
    my.setNavigationBar({
      title: '拾尚回收',
      backgroundColor: '#108ee9',
    });
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    let userInfoMore = my.getStorageSync({
      key: 'userInfoMore', // 缓存数据的key
    });
    if (!userInfo.data) {
      this.toLogin();
      return;
    }
    this.setData({
      userInfo: userInfo.data,
      userInfoMore: userInfoMore.data,
    })
    this.init();
  },
  lookBill() {
    my.navigateTo({
      url: '/pages/annualBill/billOne/billOne'
    })
  },
  init() {
    this.setMonth();//设置月份
    this.getMyMonthTotalBasicUserInfo();
    let tYear = doHandleDate();
    this.setData({ tYear: tYear });
    this.getMyMonthTotalDeliver(doHandleDate());
    this.getAreaList(doHandleDate());
  },
  setMonth() {//设置月份
    let arrlist = [];
    arrlist[0] = doHandleDate().slice(0, 4) + '年' + doHandleDate().slice(4) + '月';
    arrlist[1] = getLastMonth().slice(0, 4) + '年' + getLastMonth().slice(4) + '月';
    arrlist[2] = getLLastMonth().slice(0, 4) + '年' + getLLastMonth().slice(4) + '月';
    let arr = [doHandleDate(), getLastMonth(), getLLastMonth()]
    this.setData({
      arr: arr,
      arrlist: arrlist,
      month: arrlist[0],
    })
  },
  setArea() {//设置区域
  },
  openOne() {//选择月份
    let that = this;
    my.optionsSelect({
      title: "月份选择",
      optionsOne: this.data.arrlist,
      selectedOneIndex: 0,
      success(res) {
        if (res.selectedOneOption != '') {
          that.setData({
            month: res.selectedOneOption,
            tYear: that.data.arr[res.selectedOneIndex],
          })
          that.getMyMonthTotalDeliver(that.data.arr[res.selectedOneIndex]);
          that.getAreaList(that.data.arr[res.selectedOneIndex]);
          that.getTop50();
        }
      }
    });
  },
  openArea() {
    var that = this;
    my.optionsSelect({
      title: "区域选择",
      optionsOne: this.data.areaNameList,
      selectedOneIndex: 0,
      success(res) {
        if (res.selectedOneOption != "") {
          that.setData({
            area: res.selectedOneOption,
          })
          // 获取新区域的排行榜
          console.log(res.selectedOneIndex);
          that.getTop50(res.selectedOneIndex);
        }
      }
    });
  },
  getMyMonthTotalDeliver(tYear) {// 获取我的回收重量和画图
    request.post("user/rest/monthTotalDeliveries/myMonthTotalDeliveries?userId=" + this.data.userInfo.id + "&time=" + tYear).then(res => {
      // console.log(res.data);
      if (res.data.code == 0) {
        this.setData({ myWeightData: res.data.data })
        let newmyMonthTotalDeliveries = []
        res.data.data.myMonthTotalDeliveries.map((e) => {
          let obj = {};
          obj.type = e.categoryName;
          if (e.categoryName.length == 2) {
            obj.type = e.categoryName + "                   " + e.sumWeight
          } else if (e.categoryName.length == 3) {
            obj.type = e.categoryName + "               " + e.sumWeight
          } else if (e.categoryName.length == 4) {
            obj.type = e.categoryName + "            " + e.sumWeight
          } else if (e.categoryName.length == 5) {
            obj.type = e.categoryName + "        " + e.sumWeight
          }
          obj.data = e.sumWeight;
          obj.a = 1;
          newmyMonthTotalDeliveries.push(obj)
        })
        this.setData({
          series: newmyMonthTotalDeliveries,
        })
        // console.log(this.data.series);
      }
    })
  },
  getAreaList(tYear) {// 当月用户投递的地区
    request.post("user/rest/monthTotalDeliveries/monthTotalDeliveriesArea?userId=" + this.data.userInfo.id + "&time=" + tYear).then(res => {
      if (res.data.code == 0) {
        if (res.data.data.length > 0) {
          this.setData({ open: true })
          let areaNameList = [];
          let areaIdList = [];
          res.data.data.map((e) => {
            areaNameList.push(e.areaName)
            areaIdList.push(e.id)
          })
          this.setData({
            areaNameList: areaNameList,
            areaIdList: areaIdList
          })
          this.setData({ area: areaNameList[0] });
          this.getTop50();
        } else {
          this.setData({ open: false });
        }
      }
    })
  },
  getTop50(value) {// 根据时间和区域获取排行榜
    let index = value ? value : 0;
    request.post("user/rest/monthTotalDeliveries/monthTotalDeliveriesTop50?areaId=" + this.data.areaIdList[index] + "&time=" + this.data.tYear)
      .then(res => {
        console.log(res);
        if (res.data.code == 0) {
          let topList = res.data.data
          this.setData({
            area: this.data.areaNameList[index],
            topList: topList,
          })
          if (res.data.data.length > 0) {
            this.setData({
              open: true,
            })
          } else {
            this.setData({
              open: false,
            })
          }
          // let arr = ["theFirst", "theSecond", "theThird"];
          // arr.forEach((e, i) => {
          //   if (topList[i]) {
          //     this.setData({
          //       [e]: {
          //         name: topList[i].user.nickName,
          //         level: topList[i].user.carbonReducingLevel.level,
          //         carbonReducingM: topList[i].carbonReducingM,
          //         headPortrait: topList[i].user.headPortrait,
          //       }
          //     })
          //   }
          // })
        }
      })
    this.myCarbonReducingRank(index)
  },
  myCarbonReducingRank(index) {//获取排行榜
    request.post("user/rest/monthTotalDeliveries/myCarbonReducingRank?areaId=" + this.data.areaIdList[index] + "&time=" + this.data.tYear + "&userId=" + this.data.userInfo.id)
      .then(res => {
        if (res.data.code == 0) {
          this.setData({ rankIndex: res.data.data })
        }
      })
  },
  getMyMonthTotalBasicUserInfo() { // 获取天数投递次数 累计重量
    request.post("user/rest/monthTotalDeliveries/myMonthTotalBasicUserInfo?userId=" + this.data.userInfo.id).then(res => {
      if (res.data.code == 0) {
        this.setData({ myInfo: res.data.data })
      }
    })
  },
  toLogin() {
    my.confirm({
      title: '温馨提示',
      content: '您还未登录，确定去登录吗？',
      confirmButtonText: '确定',
      success: (result) => {
        if (result.confirm) {
          my.navigateTo({
            url: '/pages/login/login'
          });
        }
      },
    });
  },
  // 绘图保存到相册
  shareQ() {
    this.setData({ isShowCanvas: true })
    this.draw();
    my.showLoading({
      mask: true
    })
  },
  draw() {
    let that = this;
    const ctx = my.createCanvasContext('myCanvas2');
    let userInfoMore = this.data.userInfoMore;
    my.getSystemInfo({
      success: function (res) {
        console.log(res)
        var v = 750 / res.windowWidth;//设计稿尺寸除以当前手机屏幕宽度
        function shiftSize(w) {
          return w * 2 / v;
        }
        const avatarPromise = getImageInfo(that.data.userInfo.headPortrait)
        const backgroundPromise = getImageInfo('http://image.shishangbag.vip/upload/img/web/yy/member/sharerankbg2.png')
        const qrPromise = getImageInfo('http://image.shishangbag.vip/upload/img/web/yy/ssbIndex.png')
        Promise.all([avatarPromise, backgroundPromise, qrPromise])
          .then(([avatar, background, qr]) => {
            // 背景1
            ctx.setFillStyle('#FFFFFF')
            ctx.fillRect(shiftSize(0), shiftSize(0), shiftSize(600), shiftSize(740));
            ctx.setFillStyle('#FFFFFF')
            //背景2
            ctx.drawImage(background.path, shiftSize(30), shiftSize(30), shiftSize(540), shiftSize(200));
            // 绘制头像
            const circleImage = (context, path, x, y, r) => {
              let d = 2 * r;
              let cx = x + r;
              let cy = y + r;
              context.save();
              context.beginPath();
              context.arc(cx, cy, r, 0, 2 * Math.PI);
              context.fill();
              context.clip();
              context.drawImage(path, x, y, d, d);
              context.restore();
            };
            const radius = shiftSize(120)
            ctx.fillStyle = '#fff';
            circleImage(
              ctx,
              avatar.path,
              shiftSize(240),
              shiftSize(174),
              radius / 2,
            )
            // 日期地区
            ctx.setFontSize(shiftSize(28))
            ctx.setFillStyle('#fff')
            ctx.fillText(that.data.area + ' | ' + that.data.month, shiftSize(180), shiftSize(72))
            // 排名
            ctx.setFontSize(shiftSize(34))
            ctx.setFillStyle('#fff')
            ctx.fillText('我的排名:第' + that.data.rankIndex + '名', shiftSize(169), shiftSize(128))
            // 昵称
            function canvas_text(ctx, _text, _height) {
              ctx.setFontSize(shiftSize(42))
              ctx.setFillStyle('#333333')
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.width = 600;
              ctx.fillText(_text, ctx.width / 2, _height);
            }
            canvas_text(ctx, userInfoMore.name, 334);
            // 累计减少碳排放
            ctx.setFontSize(shiftSize(24))
            ctx.textAlign = "left";
            ctx.setFillStyle('#3AA5FF')
            ctx.fillText('累计减少' + that.data.myInfo.carbonReducing + 'kg碳排放', shiftSize(187), shiftSize(380))
            // 加入天
            ctx.setFontSize(shiftSize(50))
            ctx.setFillStyle('#3AA5FF')
            ctx.fillText(that.data.myInfo.days, shiftSize(87), shiftSize(442))
            ctx.setFontSize(shiftSize(22))
            ctx.setFillStyle('#3AA5FF')
            ctx.fillText('加入拾尚回收(天)', shiftSize(45), shiftSize(497))
            // 累计投递次数
            ctx.setFontSize(shiftSize(50))
            ctx.setFillStyle('#3AA5FF')
            ctx.fillText(that.data.myInfo.sendNumber, shiftSize(280), shiftSize(442))
            ctx.setFontSize(shiftSize(22))
            ctx.setFillStyle('#3AA5FF')
            ctx.fillText('累计投递(次)', shiftSize(250), shiftSize(497))
            // 累计重量
            ctx.setFontSize(shiftSize(50))
            ctx.setFillStyle('#3AA5FF')
            ctx.fillText(that.data.myInfo.totalWeight, shiftSize(418), shiftSize(442))
            ctx.setFontSize(shiftSize(22))
            ctx.setFillStyle('#3AA5FF')
            ctx.fillText('累计重量(kg)', shiftSize(428), shiftSize(497))
            // 背景3
            ctx.fillStyle = '#DFF0FF';
            ctx.fillRect(shiftSize(0), shiftSize(550), shiftSize(600), shiftSize(190));
            // 底部提示
            ctx.setFontSize(shiftSize(24))
            ctx.setFillStyle('#333333')
            ctx.fillText('你知道吗？每投递2个塑料瓶', shiftSize(46), shiftSize(629))
            ctx.fillText('相当于少开1个小时的空调噢~', shiftSize(46), shiftSize(670))
            //绘制小程序二维码
            ctx.drawImage(qr.path, shiftSize(426), shiftSize(580), shiftSize(120), shiftSize(120));
            ctx.draw(true, () => {
              // 返回canvas图片路径
              my.hideLoading();
              ctx.toTempFilePath({
                fileType: 'png',
                canvasId: 'myCanvas2',
                success(res) {
                  console.log(66666);
                  that.setData({ imgUUrr: res.apFilePath })
                },
              });
            })
          })
      }
    })

  },
  // 保存相册
  save() {
    let that = this;
    my.saveImage({
      url: this.data.imgUUrr,
      showActionSheet: true,
      success: () => {
        my.hideLoading();
        my.alert({
          title: '保存成功',
        });
        that.setData({ share_mask: false })
      },
    });
    return;
    // const ctx = my.createCanvasContext('myCanvas2');
    // ctx.toTempFilePath({
    //   x: 0,
    //   y: 0,
    //   width: 600,
    //   height: 740,
    //   destWidth: 600 * 8,
    //   destHeight: 740 * 8,
    //   fileType: 'jpg',
    //   quality: 1,
    //   canvasId: 'myCanvas2',
    //   success(res) {
    //     console.log(res, "res.apFilePath")
    //     my.saveImage({
    //       // url: res.apFilePath,
    //       url: that.data.imgUUrr,
    //       showActionSheet: true,
    //       success: () => {
    //         my.hideLoading();
    //         my.alert({
    //           title: '保存成功',
    //         });
    //       },
    //     });
    //   }
    // }, that)
  },
  share() {//我要晒账单
    this.setData({ share_mask: true });
    this.shareQ();
    let m = this.data.index
    let myDate = new Date();
    let tMonth = myDate.getMonth();
    if (m) {
      m = m < 10 ? "0" + m : m
      m++
    } else {
      m = tMonth + 1;
    }
    let dateStr = myDate.getFullYear() + "年" + m + "月";
    this.setData({ dateStr: dateStr })
  },
  close(e) {
    this.setData({ share_mask: false })
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
    my.stopPullDownRefresh();
  },
  onReachBottom() {
    // 页面被拉到底部
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
function doHandleDate() {//获取当前月份
  var myDate = new Date();
  var tYear = myDate.getFullYear();
  var tMonth = myDate.getMonth();
  tMonth = tMonth + 1;
  if (tMonth.toString().length == 1) {
    tMonth = "0" + tMonth;
  }
  return tYear.toString() + tMonth.toString();
}
function getLastMonth() {//获取上月
  var myDate = new Date();
  var tYear = myDate.getFullYear();
  var tMonth = myDate.getMonth();
  if (tMonth == 0) {
    tMonth = 12;
    tYear = tYear - 1;
  }
  if (tMonth.toString().length == 1) {
    tMonth = "0" + tMonth;
  }
  return tYear.toString() + tMonth.toString();
}
function getLLastMonth() {//获取上上月
  var myDate = new Date();
  var tYear = myDate.getFullYear();
  var tMonth = myDate.getMonth();
  if (tMonth == 0) {
    tMonth = 11;
    tYear = tYear - 1;
  } else if (tMonth == 1) {
    tMonth = 12;
    tYear = tYear - 1;
  } else {
    tMonth = tMonth - 1;
  }
  if (tMonth.toString().length == 1) {
    tMonth = "0" + tMonth;
  }
  return tYear.toString() + tMonth.toString();
}
