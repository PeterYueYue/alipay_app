const request = require("../../../utils/request.js");
var app = getApp();

Page({
  data: {
    imgUrl: app.globalData.imgUrlNew,
    bg1: app.globalData.imgUrlNew + 'yy/bill/bg1.png',
    userInfo: {},
    img: "",
    canvasWidth: 750,
    canvasHeight: 1624,
  },
  onLoad: function (options) {
  },
  onReady: function () {
    let userInfo = my.getStorageSync({ key: "userInfo" }); userInfo = userInfo.data;
    this.setData({ userInfo: userInfo })
    this.getBillData()
  },
  onShow: function () {
    my.setNavigationBar({
      title: '年度账单',
      backgroundColor: '#108ee9',
    });
  },
  getBillData() {
    let userInfo = my.getStorageSync({ key: "userInfo" }); userInfo = userInfo.data;
    let that = this
    request.post("user/rest/user/annualStatement?userId=" + userInfo.id + "&year=" + "2020").then(res => {
      let mainbg = getImageInfo('https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/bill/bg1.png');
      let billbg = userInfo.userFlag == 1 ? getImageInfo('https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/bill/cjd.png') : getImageInfo('https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/bill/cjd_b.png');
      let qrcode = getImageInfo('https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/annualcode.png');
      let avatar = userInfo.headPortrait ? getImageInfo(userInfo.headPortrait) : getImageInfo('https://sbag.oss-cn-huhehaote.aliyuncs.com/upload/img/web/image/home/12.png');
      Promise.all([mainbg, billbg, qrcode, avatar])
        .then(([mainbg, billbg, qrcode, avatar]) => {
          if (userInfo.userFlag == 1) {
            that.draw(res.data.data, { mainbg, billbg, qrcode, avatar })
          } else {
            that.draw_b(res.data.data, { mainbg, billbg, qrcode, avatar })
          }
        })
      //  my.downloadFile({
      //   url: "https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/bill/bg1.png",
      //   success(mainbg) {
      //     my.downloadFile({
      //       url: "https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/bill/cjd.png",
      //       success(billbg) {
      //         my.downloadFile({
      //           url: "https://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/ssbIndex.png",
      //           success(qrcode) {
      //             my.downloadFile({
      //               url: "https://sbag.oss-cn-huhehaote.aliyuncs.com/upload/img/web/image/home/12.png",
      //               success(avatar) {
      //                 console.log(mainbg);
      //                 if (userInfo.userFlag == 1) {
      //                   that.draw(res.data.data, { mainbg, billbg, qrcode, avatar })
      //                 } else {
      //                   that.draw_b(res.data.data, { mainbg, billbg, qrcode, avatar })
      //                 }
      //               },
      //             })
      //           },
      //         })
      //       },
      //   })
      // },
      // fail(res) {
      //   console.log(res, "fail")
      // }
    })
  },
  // 个人
  draw(billdata, imgObj) {
    // console.log(imgObj, "imgObj")
    my.showLoading({
      content: '账单生成中...',
    });
    let that = this;
    const ctx = my.createCanvasContext('myCanvas');
    my.getSystemInfo({
      success: function (res) {
        var v = 750 / res.windowWidth;//设计稿尺寸除以  当前手机屏幕宽度
        function shiftSize(w) {
          return (w / v) * 2;
        }
        let userInfo = my.getStorageSync({ key: "userInfo" }); userInfo = userInfo.data;
        // 设定画布大小
        ctx.fillRect(shiftSize(0), shiftSize(0), shiftSize(750), shiftSize(1624));
        // 设定画布大小
        ctx.fillRect(shiftSize(0), shiftSize(0), shiftSize(750), shiftSize(1624));
        // 背景
        ctx.drawImage(imgObj.mainbg.path, shiftSize(0), shiftSize(0), shiftSize(750), shiftSize(1624));
        // 卷背景
        ctx.drawImage(imgObj.billbg.path, shiftSize(44), shiftSize(113), shiftSize(686), shiftSize(1264));
        // 二维码
        ctx.drawImage(imgObj.qrcode.path, shiftSize(100), shiftSize(1430), shiftSize(130), shiftSize(130));
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
        const radius = shiftSize(90)
        ctx.fillStyle = '#fff';
        circleImage(
          ctx,
          imgObj.avatar.path,
          shiftSize(100),
          shiftSize(352),
          radius / 2,
        )
        // 昵称
        ctx.setFontSize(shiftSize(34));
        ctx.fillStyle = "#333333";
        ctx.fillText(userInfo.nickName, shiftSize(217), shiftSize(415))
        // 文字
        let textX = shiftSize(104)
        let textY1 = shiftSize(500)
        ctx.setFontSize(shiftSize(24));
        ctx.fillText("加入拾尚回收已经", textX, textY1)
        ctx.fillText("天", shiftSize(380), textY1)
        ctx.setFontSize(shiftSize(40));
        ctx.fillStyle = "#FA9300";
        ctx.fillText(billdata.days, shiftSize(310), textY1)
        // 虚线
        ctx.strokeStyle = '#FA9300';
        drawDashedLine(ctx, shiftSize(112), shiftSize(524), shiftSize(638), shiftSize(524))
        // 文字
        ctx.fillStyle = "#333333";
        let textY2 = shiftSize((482 + 100))
        ctx.setFontSize(shiftSize(24));
        ctx.fillText("这一年贡献了", textX, textY2)
        ctx.fillText("公斤的可回收物", shiftSize(350), textY2)
        ctx.setFontSize(shiftSize(34));
        ctx.fillStyle = "#FA9300";
        ctx.setTextAlign('center');
        ctx.fillText(billdata.totalWeight ? billdata.totalWeight : 0, shiftSize(300), textY2);
        // 虚线
        ctx.strokeStyle = '#FA9300';
        drawDashedLine(ctx, shiftSize(112), shiftSize(612), shiftSize(638), shiftSize(612))
        // 文字
        ctx.setTextAlign('left')
        ctx.fillStyle = "#333333";
        let textY3 = shiftSize((482 + 185))
        ctx.setFontSize(shiftSize(24));
        ctx.fillText("当前减少碳排放", textX, textY3)
        ctx.fillText("kg≈种植了", shiftSize(410), textY3)
        ctx.fillText("棵树", shiftSize(590), textY3)
        ctx.setFontSize(shiftSize(24));
        ctx.fillStyle = "#FA9300";
        ctx.setTextAlign('center')
        ctx.fillText(billdata.carbonReducing, shiftSize(340), textY3)
        ctx.fillText(billdata.trees, shiftSize(555), textY3)
        // 虚线
        ctx.strokeStyle = '#FA9300';
        drawDashedLine(ctx, shiftSize(112), shiftSize(700), shiftSize(638), shiftSize(700))
        // 文字
        ctx.setTextAlign('left')
        ctx.fillStyle = "#333333";
        let textY4 = shiftSize((482 + 270))
        ctx.setFontSize(shiftSize(24));
        ctx.fillText("2020年的可回收物由这些组成", textX, textY4);

        // 数据内容
        ctx.setFillStyle('#4DA0FF')
        ctx.fillRect(shiftSize(110), shiftSize(785), shiftSize(6), shiftSize(32));
        ctx.setFontSize(shiftSize(32));
        ctx.fillStyle = "#333333";
        ctx.fillText("我的回收重量", shiftSize(123), shiftSize(812))
        ctx.setTextAlign('right')
        ctx.fillText(billdata.totalWeight + "(kg)", shiftSize(647), shiftSize(812))

        // 饼图
        let array = [];
        let nameArr = []
        billdata.userRegenerantWeightList.map(e => {
          if (billdata.carbonReducing == 0) {
            array.push(1);
          } else {
            array.push(parseFloat(e.weight));
          }
          nameArr.push(e.name)
        })
        let colors = ["#FF7342", "#1086FF", "#B56CFF", "#68DDFF", "#41FFCB", "#FFE13C", "#FFA23E", "#FF70E6"];
        let total = 0;
        for (var val = 0; val < array.length; val++) {
          total += array[val];
        }
        let point = { x: shiftSize(220), y: shiftSize(971) };
        let radius_1 = shiftSize(120);
        for (var i = 0; i < array.length; i++) {
          ctx.beginPath();
          let start = 0;
          if (i > 0) {
            for (let j = 0; j < i; j++) {
              start += array[j] / total * 2 * Math.PI;
            }
          }
          let end = start + array[i] / total * 2 * Math.PI;
          ctx.arc(point.x, point.y, radius_1, start, end);
          ctx.setLineWidth(0)
          ctx.lineTo(point.x, point.y);
          ctx.setStrokeStyle('#F5F5F5');
          ctx.setFillStyle(colors[i]);
          ctx.fill();
          ctx.closePath();
          ctx.stroke();
        }
        fillRoundRect(ctx, shiftSize(145), shiftSize(896), shiftSize(150), shiftSize(150), shiftSize(75), "#ffffff")

        // 饼图右侧数据
        let dataY = 800;
        for (let i = 0; i < array.length; i++) {
          dataY += 35
          let textY = (dataY + 15)
          ctx.setFillStyle(colors[i])
          ctx.fillRect(shiftSize(410), shiftSize((dataY)), shiftSize(14), shiftSize(14));
          ctx.setFontSize(shiftSize(22));
          ctx.setFillStyle("#333333")
          ctx.setTextAlign("left")
          ctx.fillText(nameArr[i], shiftSize(435), shiftSize((textY)),)
          ctx.setTextAlign("right")
          ctx.fillText(billdata.carbonReducing == 0 ? 0 : array[i], shiftSize(640), shiftSize((textY)),)
        }
        // 底部文字
        ctx.setFontSize(shiftSize(26));
        ctx.setFillStyle("#ffffff")
        ctx.setTextAlign("left")
        ctx.fillText("长按识别二维码", shiftSize(250), shiftSize((1475)),)
        ctx.fillText("查看你的2020年度环保成绩单", shiftSize(250), shiftSize((1530)),)
        ctx.draw(true, () => {
          // 返回canvas图片路径
          my.hideLoading();
          ctx.toTempFilePath({
            fileType: 'png',
            width: 1500,
            height: 3248,
            destWidth: 1500,
            destHeight: 3248,
            success(res) {
              that.setData({
                img: res.apFilePath,
              })
              my.hideLoading();
            },
          });
        });
      }
    })
  },
  // B端
  draw_b(billdata, imgObj) {
    my.showLoading({
      content: '账单生成中...',
    });
    let that = this;
    const ctx = my.createCanvasContext('myCanvas');
    my.getSystemInfo({
      success: function (res) {
        var v = 750 / res.windowWidth;
        function shiftSize(w) {
          return w * 2 / v;
        }
        let userInfo = my.getStorageSync({ key: "userInfo" }); userInfo = userInfo.data;
        // 设定画布大小
        ctx.fillRect(shiftSize(0), shiftSize(0), shiftSize(750), shiftSize(1624));
        // 背景
        ctx.drawImage(imgObj.mainbg.path, shiftSize(0), shiftSize(0), shiftSize(750), shiftSize(1624));
        // // 卷背景
        ctx.drawImage(imgObj.billbg.path, shiftSize(44), shiftSize(150), shiftSize(686), shiftSize(1316));

        let pl1 = 110;
        let textY = 490;

        // 公司名称
        ctx.setFontSize(shiftSize(25));
        ctx.fillStyle = "#333333";
        ctx.setTextAlign("left")
        ctx.fillText(userInfo.nickName, shiftSize(pl1), shiftSize(440))
        // 文字行1
        ctx.setFontSize(shiftSize(25));
        ctx.fillText("您好!", shiftSize(pl1 + 50), shiftSize(textY));
        // 文字行2
        let y1 = textY + 55
        ctx.fillText("2020年度贵单位累计回收量", shiftSize(pl1 + 50), shiftSize(y1));
        ctx.setFontSize(shiftSize(40));
        ctx.fillStyle = "#FA9300";
        ctx.setTextAlign("center");
        ctx.fillText(billdata.totalWeight ? billdata.totalWeight : 0, shiftSize(525), shiftSize(y1));
        ctx.setTextAlign("left");
        ctx.setFontSize(shiftSize(25));
        ctx.fillStyle = "#333333";
        ctx.fillText("公斤,", shiftSize(580), shiftSize(y1));
        // 文字行3
        let y2 = textY + 110
        ctx.fillText("当前减少碳排放", shiftSize(pl1), shiftSize(y2));
        ctx.setFontSize(shiftSize(40));
        ctx.fillStyle = "#FA9300";
        ctx.setTextAlign("center");
        ctx.fillText(billdata.carbonReducing, shiftSize(365), shiftSize(y2));
        ctx.setTextAlign("left");
        ctx.setFontSize(shiftSize(25));
        ctx.fillStyle = "#333333";
        ctx.fillText("kg，约等于种植了", shiftSize(420), shiftSize(y2));
        // 文字行4
        let y3 = textY + 165
        ctx.setFontSize(shiftSize(40));
        ctx.fillStyle = "#FA9300";
        ctx.setTextAlign("center");
        ctx.fillText(billdata.trees, shiftSize(140), shiftSize(y3));
        ctx.setTextAlign("left");
        ctx.setFontSize(shiftSize(25));
        ctx.fillStyle = "#333333";
        ctx.fillText("棵树。", shiftSize(190), shiftSize(y3));
        // 文字行5
        let y4 = textY + 220
        ctx.setTextAlign("left");
        ctx.setFontSize(shiftSize(25));
        ctx.fillStyle = "#333333";
        ctx.fillText("感谢贵单位长期以来对环保事业做出的贡献，", shiftSize(pl1 + 50), shiftSize(y4));
        // 文字行6
        let y5 = textY + 275
        ctx.setTextAlign("left");
        ctx.setFontSize(shiftSize(25));
        ctx.fillStyle = "#333333";
        ctx.fillText("愿2021年与贵公司保持密切合作，一起为环保事", shiftSize(pl1), shiftSize(y5));
        // 文字行7
        let y6 = textY + 330
        ctx.setTextAlign("left");
        ctx.setFontSize(shiftSize(25));
        ctx.fillStyle = "#333333";
        ctx.fillText("业继续努力", shiftSize(pl1), shiftSize(y6));

        // 数据内容
        ctx.setFillStyle('#4DA0FF')
        ctx.fillRect(shiftSize(110), shiftSize(865), shiftSize(6), shiftSize(32));
        ctx.setFontSize(shiftSize(32));
        ctx.fillStyle = "#333333";
        ctx.fillText("我的回收重量", shiftSize(123), shiftSize(892))
        ctx.setTextAlign('right')
        ctx.fillText(billdata.totalWeight + "(kg)", shiftSize(647), shiftSize(892))

        // 饼图
        let array = [];
        let nameArr = []
        billdata.userRegenerantWeightList.map(e => {
          if (billdata.carbonReducing == 0) {
            array.push(1);
          } else {
            array.push(parseFloat(e.weight));
          }
          nameArr.push(e.name)
        })
        let colors = ["#FF7342", "#1086FF", "#B56CFF", "#68DDFF", "#41FFCB", "#FFE13C", "#FFA23E", "#FF70E6"];
        let total = 0;
        for (var val = 0; val < array.length; val++) {
          total += array[val];
        }
        let point = { x: shiftSize(220), y: shiftSize(1090) };
        let radius_1 = shiftSize(120);
        for (var i = 0; i < array.length; i++) {
          ctx.beginPath();
          let start = 0;
          if (i > 0) {
            for (let j = 0; j < i; j++) {
              start += array[j] / total * 2 * Math.PI;
            }
          }
          let end = start + array[i] / total * 2 * Math.PI;
          ctx.arc(point.x, point.y, radius_1, start, end);
          ctx.setLineWidth(0)
          ctx.lineTo(point.x, point.y);
          ctx.setStrokeStyle('#F5F5F5');
          ctx.setFillStyle(colors[i]);
          ctx.fill();
          ctx.closePath();
          ctx.stroke();
        }
        fillRoundRect(ctx, shiftSize(145), shiftSize(1016), shiftSize(150), shiftSize(150), shiftSize(75), "#ffffff")
        // 饼图右侧数据
        let dataY = 910;
        for (let i = 0; i < array.length; i++) {
          dataY += 35
          let textY = (dataY + 15)
          ctx.setFillStyle(colors[i])
          ctx.fillRect(shiftSize(410), shiftSize((dataY)), shiftSize(14), shiftSize(14));
          ctx.setFontSize(shiftSize(22));
          ctx.setFillStyle("#333333")
          ctx.setTextAlign("left")
          ctx.fillText(nameArr[i], shiftSize(435), shiftSize((textY)),)
          ctx.setTextAlign("right")
          ctx.fillText(billdata.carbonReducing == 0 ? 0 : array[i], shiftSize(640), shiftSize((textY)),)
        }
        ctx.draw(true, () => {
          // 返回canvas图片路径
          my.hideLoading();
          ctx.toTempFilePath({
            fileType: 'png',
            width: 1500,
            height: 3248,
            destWidth: 1500,
            destHeight: 3248,
            success(res) {
              that.setData({
                img: res.apFilePath,
              })
              my.hideLoading();
            },
          });
        });

      }
    })

  },

  // 保存相册
  save() {
    my.saveImage({
      url: this.data.img,
      showActionSheet: true,
      success: () => {
        my.alert({
          title: '保存成功',
        });
      },
    });
  },
  onPageScroll(res) {
  },
  goback() {
    my.navigateBack()
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '年度账单',
      desc: "请查收您的年度账单",
      bgImgUrl: app.globalData.imgUrlNew + "yy/bill/share.png",
      path: 'pages/annualBill/billOne/billOne',
    };
  },
})
function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    my.getImageInfo({
      src: url,
      success: resolve,
      fail: reject,
    })
  })
}
let chart = null;
//绘制虚线函数
function drawDashedLine(context, x1, y1, x2, y2, dashLength) {//传入参数：上下文，起点，终点，虚线间隔
  dashLength = dashLength === undefined ? 5 : dashLength;//运用三元表达式实现默认参数
  var deltaX = x2 - x1;//水平长度
  var deltaY = y2 - y1;//垂直长度
  var numDashes = Math.floor(
    Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);//虚线数量
  for (var i = 0; i < numDashes; ++i) {
    context[i % 2 === 0 ? 'moveTo' : 'lineTo']
      (x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);//(deltaX/numDashed)是指虚线的长度
  }
  context.stroke();
};
function fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
  //圆的直径必然要小于矩形的宽高          
  if (2 * radius > width || 2 * radius > height) { return false; }

  cxt.save();
  cxt.translate(x, y);
  //绘制圆角矩形的各个边  
  drawRoundRectPath(cxt, width, height, radius);
  cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
  cxt.fill();
  cxt.restore();
}
function drawRoundRectPath(cxt, width, height, radius) {
  cxt.beginPath(0);
  //从右下角顺时针绘制，弧度从0到1/2PI  
  cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

  //矩形下边线  
  cxt.lineTo(radius, height);

  //左下角圆弧，弧度从1/2PI到PI  
  cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

  //矩形左边线  
  cxt.lineTo(0, radius);

  //左上角圆弧，弧度从PI到3/2PI  
  cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

  //上边线  
  cxt.lineTo(width - radius, 0);

  //右上角圆弧  
  cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

  //右边线  
  cxt.lineTo(width, height - radius);
  cxt.closePath();
}