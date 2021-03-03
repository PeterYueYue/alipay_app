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

const rpx2px = createRpx2px()

// function canvasToTempFilePath(option, context) {
//   return new Promise((resolve, reject) => {
//     const ctx = my.createCanvasContext(option);
//     ctx.toTempFilePath({
//       success(res) {
//         // console.log(res)
//       },
//     }, context);
//     // wx.canvasToTempFilePath({
//     //   ...option,
//     //   success: resolve,
//     //   fail: reject,
//     // }, context)
//   })
// }

// function saveImageToPhotosAlbum(option) {
//   return new Promise((resolve, reject) => {
//     my.saveImage({
//       ...option,
//       success: resolve,
//       fail: reject,
//     })
//   })
// }

Component({
  props: {
    visible: {
      type: Boolean,
      value: false,
      // observer(visible) {
      //   if (visible && !this.beginDraw) {
      //     this.draw();
      //     this.beginDraw = true;
      //   }
      // }
    },
    userInfo: {
      type: Object,
      value: false
    }
  },
  data: {
    beginDraw: false,
    isDraw: false,
    canvasWidth: 843,
    canvasHeight: 1500,
    imageFile: '',
    responsiveScale: 1,
    userInfo: {},
  },
  onInit() {

  },
  didMount() {
    const designWidth = 375
    const designHeight = 603 // 这是在顶部位置定义，底部无tabbar情况下的设计稿高度
    // 以iphone6为设计稿，计算相应的缩放比例
    const { windowWidth, windowHeight } = my.getSystemInfoSync()
    const responsiveScale =
      windowHeight / ((windowWidth / designWidth) * designHeight)
    if (responsiveScale < 1) {
      this.setData({
        responsiveScale,
      })
    }
    this.onInfo();
    this.init();
  },
  methods: {
    init() {
      let res = my.getStorageSync({
        key: 'userInfo'
      });
       let userInfoMore = my.getStorageSync({
        key: 'userInfoMore'
      });
      if (res.data == null) {
        this.setData({
          userInfo: {},
        })
        return false;
      }
      this.setData({
        userInfo: res.data,
        userInfoMore: userInfoMore.data,
      });

    },
    onInfo() {
      this.props.onInfo();
    },
    handleClose() {
      this.props.onClose();
    },
    handleSave() {
      my.saveImage({
        url: this.data.imageFile,
        showActionSheet: true,
        success: () => {
          my.alert({
            title: '保存成功',
          });
          this.props.onClose();
        },
      });
    },
    draw() {
      my.showLoading()
      let that = this;
      const { userInfo, canvasWidth, canvasHeight } = this.data
      const { headPortrait, nickName } = userInfo
      const avatarPromise = getImageInfo(headPortrait)
      const backgroundPromise = getImageInfo('https://image.shishangbag.vip/upload/img/web/yy/member/poster.png')
      Promise.all([avatarPromise, backgroundPromise])
        .then(([avatar, background]) => {
          const ctx = my.createCanvasContext('share', this)
          const canvasW = rpx2px(canvasWidth * 2)
          const canvasH = rpx2px(canvasHeight * 2)
          // 绘制背景
          ctx.drawImage(
            background.path,
            0,
            0,
            canvasW,
            canvasH
          )
          function rect (x, y, w, h, r) {
            var min_size = Math.min(w, h);
            if (r > min_size / 2) r = min_size / 2;
            // 开始绘制
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.closePath();
            return ctx;
          }
          // 绘制数据区域
          ctx.fillStyle = "#fff";
          rect(canvasW * 0.1, canvasH * 0.77, canvasW * 0.8, canvasH * 0.15,10);
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
          const radius = rpx2px(126 * 2)
          ctx.fillStyle = '#fff';
          circleImage(
            ctx,
            avatar.path,
            canvasW * 0.13,
            canvasH * 0.80,
            radius/2,
          )

          // 绘制用户名
          ctx.setFontSize(30)
          ctx.font = "bold";
          ctx.setFillStyle('#000')
          ctx.fillText(
            'HI,我是' + nickName,
            canvasW*0.28,
            canvasH * 0.81,
          )
          //绘制数据
          ctx.setFontSize(20)
          ctx.setFillStyle('#000')
          ctx.fillText(
            '我的环保推广团队已经',
            canvasW*0.28,
            canvasH * 0.84,
          )
          ctx.fillText(
            '累计减少碳排放' + this.data.userInfoMore.carbonReducing + 'kg',
            canvasW*0.28,
            canvasH * 0.865,
          )
          ctx.fillText(
            '一起加入我们吧',
            canvasW*0.28,
            canvasH * 0.890,
          )
          //绘制二维码
          const url = "https://miniapp.shishangbag.vip/member?id="+userInfo.id;
          QR.api.draw(url, ctx, canvasW * 0.68, canvasH * 0.79, 154, 154 );
          // 绘制二维码中心logo
          // const logo= 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM4K27Gk8pb350OPJhP5VjHoxacicZaXLIYcrRKxdCnQ8Lw/0';
          // ctx.drawImage(logo,  canvasW * 0.745, canvasH * 0.825, 50, 50);
          ctx.stroke();
          ctx.draw(false, () => {
            // 返回canvas图片路径
            ctx.toTempFilePath({
              fileType: 'png',
              success(res) {
                that.setData({ imageFile: res.apFilePath }) 
                ctx.drawImage(res.apFilePath)
              },
            });
          })
          my.hideLoading()
          this.setData({ isDraw: true })
        })
        .catch(() => {
          this.setData({ beginDraw: false })
          my.hideLoading()
        })
    }
  }
})