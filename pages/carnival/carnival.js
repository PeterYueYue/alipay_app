const request = require("../../utils/request.js");
var app = getApp();

Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    prizeList: [],
    cardBgImg: app.globalData.imgUrl + '/carnival/pai.png',//抽奖牌背图
    prizeName: '',//中奖物品名称
    flipAllCards: false,//是否翻开剩余牌
    isDrawing: false,//是否正在抽奖
    cardNum: 6,//牌数
    cardHeight: 270,//牌高度
    maskFlag: false,//中奖显示界面
    recordFlag: false,//中奖记录
    rluesFlag: false,//规则界面
    scrollTop: 0,
    flag: true,//是否允许滚动
    flipFlag: true,//抽奖组件状态
    img: '',//中奖物品图片
    info: {},//签到信息
    drawTimes: 0,//剩余抽奖次数
    userInfo: {},//登录信息
    width: 0,//签到条长度
    winningPrize: {},//中奖信息
    luckyList: [],//中奖记录列表
    FollwersFlag: false,//关注组件状态
    pushList: [],//播报列表
    FollwersId: '',//关注任务ID
    noPushList: false,//没有播报列表
    noLuckyList: false,//没有中奖记录
    once: true,//禁止多次点击
  },
  onLoad() {

  },
  onShow() {
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfo: userInfo.data
    })
    if (!userInfo.data) {
      this.toLogin()
      return false;
    }
    const param = "gameId=1&userId=" + userInfo.data.id
    request.post("user/rest/game1912/home?" + param).then(res => {
      if (res.data.code == 0) {
        let pushList = res.data.data.pushList
        if (res.data.data.pushList.length == 0) {
          this.setData({
            noPushList: true
          })
        } else {
          this.setData({
            noPushList: false
          })
        }
        pushList = pushList.map((v, i) => ({ title: '恭喜' + v.nickName + '抽中' + v.prizeName }))
        if (res.data.data.days <= 7) {
          this.setData({
            info: res.data.data,
            pushList,
            drawTimes: res.data.data.drawTimes,
            width: 100 / 7 * res.data.data.days - 3
          })
        } else {
          this.setData({
            info: res.data.data,
            pushList,
            drawTimes: 0,
            width: 100,
          })
        }

      }
    });
    this.setData({
      once: true,
    })
  },
  toLogin() {
    my.showToast({
      type: 'none',
      content: '您还未登录,请先授权登录',
      duration: 2000,
      success: (res) => {
        my.navigateTo({
          url: '/pages/login/login'
        })
      },
    });
    // my.confirm({
    //   title: '温馨提示',
    //   content: '您还未登录，确定去登录吗？',
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   success: (result) => {
    //     if (result.confirm) {
    //       my.navigateTo({
    //         url: '/pages/login/login'
    //       });
    //     } else {

    //     }
    //   },
    // });
  },
  onFlipStart() {
    var that = this;
    // 禁掉多次点击
    if (!this.data.once) {
      return false;
    }
    this.setData({
      once: false,
    })
    if (this.data.drawTimes == 0) {
      my.showToast({
        content: '您没有翻牌次数了',
        success: (res) => {
        },
      });
      this.setData({
        once: true,
      })
      return false
    }
    const param = "gameId=1&userId=" + this.data.userInfo.id
    request.post("user/rest/game1912/raffle?" + param).then(res => {
      if (res.data.data) {
        let prizeList = res.data.data.gamePrizeByAfterTheDraw.map((v, i) => ({ name: v.prizeName, icon: this.data.imgUrl + 'carnival/' + v.prizeCode + '.png' }))
        prizeList.push({ name: res.data.data.winningPrize.prizeName, icon: this.data.imgUrl + 'carnival/' + res.data.data.winningPrize.prizeCode + '.png' })
        this.setData({
          canFlip: true,
          prizeList,
          winningPrize: res.data.data.winningPrize,
        })
      }
    })
    this.setData({
      isDrawing: true, // 修改抽奖状态，防止重复点击多次请求
    });
    // 开始抽奖
    setTimeout(() => {
      this.setData({
        prizeName: this.data.winningPrize.prizeName,
        isDrawing: false,
        flag: false,
        img: this.data.imgUrl + 'carnival/' + this.data.winningPrize.prizeCode + '.png',
        drawTimes: this.data.drawTimes - 1
      })
    }, 1000);
    setTimeout(() => {
      this.showResultDialog()
      request.post("user/rest/game1912/home?" + param).then(res => {
        if (res.data.code == 0) {
          let pushList = res.data.data.pushList
          if (res.data.data.pushList.length == 0) {
            this.setData({
              noPushList: true
            })
          } else {
            this.setData({
              noPushList: false
            })
          }
          pushList = pushList.map((v, i) => ({ title: '恭喜' + v.nickName + '抽中' + v.prizeName }))
          this.setData({
            info: res.data.data,
            pushList,
            drawTimes: res.data.data.drawTimes,
            width: 100 / 7 * res.data.data.days - 3,

          })
        }
      });
    }, 2000)
    setTimeout(() => {
      this.setData({
        maskFlag: true,
        once: true,
      })
    }, 3500)


  },
  showResultDialog() {
    this.setData({
      flipAllCards: true, // 将剩下未翻过的牌自动翻，展示奖品结果。
    })
  },
  task(e) {
    let id = e.currentTarget.dataset.info.id
    let name = e.currentTarget.dataset.info.taskName
    const that = this
    switch (name) {
      case '收藏拾尚包小程序':
        my.isCollected({
          success: (res) => {
            if (res.isCollected) {
              that.refresh(that, id)();
            } else {
              my.showToast({ content: '请去收藏小程序' })
            }

          }
        });
        break;
      case '申领拾尚包':
        request.get(`user/rest/game1912/task/receiveRecord?userId=${that.data.userInfo.id}`).then(res1 => {
          if (res1.data.code == 0) {
            that.refresh(that, id);
          } else {
            setTimeout(() => {
              my.navigateTo({
                url: '/pages/freeGet/freeGet'
              })
            }, 2000)

          }
        })
        break;
      case '关注拾尚先锋生活号':
        this.setData({
          FollwersId: id,
          FollwersFlag: true,
          flag: false
        })
        break;
      case '邀请好友申领拾尚包':
        this.setData({
          FollwersId: id,
        })
        my.showSharePanel();
        break;

      case '访问绿色账户小程序':
        // that.refresh(that, id);
        // my.navigateToMiniProgram({
        //   appId: '2019090967097603',
        //   path: 'pages/index/index',
        //   extraData: {
        //   },
        //   success: () => {

        //   }
        // });
        break;
      case '扫码绑定拾尚包':
        request.get(`user/rest/game1912/task/bindingRecord?userId=${that.data.userInfo.id}`).then(res1 => {
          if (res1.data.code == 0) {
            that.refresh(that, id);
          } else {
            setTimeout(() => {
              my.navigateTo({
                url: '/pages/bao/bao'
              })
            }, 2000)
          }
        })
        break;
      case '预约拾尚包上门回收':
        request.get(`user/rest/game1912/task/reserveRecord?userId=${that.data.userInfo.id}`).then(res1 => {
          if (res1.data.code == 0) {
            that.refresh(that, id);
          } else {
            setTimeout(() => {
              my.navigateTo({
                url: '/pages/index/index'
              })
            }, 2000)

          }

        })
        break;
    }
  },
  continue() {
    this.setData({
      maskFlag: false,
      flag: true,
      flipFlag: false,
      flipAllCards: false,
      prizeName: ''
    })
    const _this = this
    setTimeout(() => {
      _this.setData({
        flipFlag: true
      })
    }, 100)
  },
  examine() {
    const param = "gameId=1&userId=" + this.data.userInfo.id
    request.get("user/rest/game1912/myWinningRecord?" + param).then(res => {
      if (res.data.data.length == 0) {
        this.setData({
          noLuckyList: true
        })
      } else {
        this.setData({
          noLuckyList: false
        })
      }
      this.setData({
        luckyList: res.data.data
      })
    });
    this.setData({
      maskFlag: false,
      recordFlag: true,
      flag: false,
      flipFlag: false,
      flipAllCards: false,
      prizeName: ''
    })

    const _this = this
    setTimeout(() => {
      _this.setData({
        flipFlag: true
      })
    }, 100)
  },
  defaultTouchMove(e) {
  },
  refresh(that, id) {
    request.post(`user/rest/game1912/task/save?userId=${that.data.userInfo.id}&taskId=${id}`).then(res2 => {
      if (res2.data.code == 0) {
        request.post(`user/rest/game1912/home?gameId=1&userId=${that.data.userInfo.id}`).then(res => {
          if (res.data.code == 0) {
            that.setData({
              info: res.data.data,
              drawTimes: res.data.data.drawTimes,
              width: 100 / 7 * res.data.data.days - 3
            })
          }
        });
      }
    });
  },
  tap() {
    if (this.data.scrollTop == 2000) {
      this.setData({
        scrollTop: 1999
      })
    } else {
      this.setData({
        scrollTop: 2000
      })
    }
  },
  close() {
    this.setData({
      maskFlag: false,
      flag: true,
      flipFlag: false,
      flipAllCards: false
    })
    const _this = this
    setTimeout(() => {
      _this.setData({
        flipFlag: true
      })
    }, 100)
  },
  closelist() {
    this.setData({
      recordFlag: false,
      flag: true
    })
  },
  closerlues() {
    this.setData({
      rluesFlag: false,
      flag: true
    })
  },
  closeLifestyle() {
    this.setData({
      FollwersFlag: false,
      flag: true
    })
  },
  totop() {
    my.navigateTo({
      url: "/pages/top/top"
    });
  },
  torules() {
    this.setData({
      rluesFlag: true,
      flag: false
    })
  },
  onFollow() {
    const that = this
    request.post(`user/rest/game1912/task/save?userId=${that.data.userInfo.id}&taskId=${that.data.FollwersId}`).then(res1 => {
      if (res1.data.code == 0) {
        request.post(`user/rest/game1912/home?gameId=1&userId=${that.data.userInfo.id}`).then(res => {
          if (res.data.code == 0) {
            this.setData({
              info: res.data.data,
              drawTimes: res.data.data.drawTimes,
              FollwersFlag: false,
              flag: true
            })
          }
        });
      }
    });
  },
  onPullDownRefresh() {
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    this.setData({
      userInfo: userInfo.data
    })
    const param = "gameId=1&userId=" + userInfo.data.id
    request.post("user/rest/game1912/home?" + param).then(res => {
      if (res.data.code == 0) {
        let pushList = res.data.data.pushList
        if (res.data.data.pushList.length == 0) {
          this.setData({
            noPushList: true
          })
        } else {
          this.setData({
            noPushList: false
          })
        }
        pushList = pushList.map((v, i) => ({ title: '恭喜' + v.nickName + '抽中' + v.prizeName }))
        this.setData({
          info: res.data.data,
          pushList,
          drawTimes: res.data.data.drawTimes,
          width: 100 / 7 * res.data.data.days - 3
        })
      }
    });
    my.stopPullDownRefresh();
  },
  // clean() {

  //   request.get("user/rest/game1912/task/delete").then(res1 => {
  //     let userInfo = my.getStorageSync({
  //       key: 'userInfo', // 缓存数据的key
  //     });
  //     this.setData({
  //       userInfo: userInfo.data
  //     })
  //     const param = "gameId=1&userId=" + userInfo.data.id
  //     request.post("user/rest/game1912/home?" + param).then(res => {
  //       if (res.data.code == 0) {
  //         let pushList = res.data.data.pushList
  //         if (res.data.data.pushList.length == 0) {
  //           this.setData({
  //             noPushList: true
  //           })
  //         } else {
  //           this.setData({
  //             noPushList: false
  //           })
  //         }
  //         pushList = pushList.map((v, i) => ({ title: '恭喜' + v.nickName + '抽中' + v.prizeName }))
  //         this.setData({
  //           info: res.data.data,
  //           pushList,
  //           drawTimes: res.data.data.drawTimes,
  //           width: 100 / 7 * res.data.data.days - 3
  //         })
  //       }
  //     });
  //     request.get("user/rest/game1912/myWinningRecord?" + param).then(res => {
  //       this.setData({
  //         luckyList: res.data.data
  //       })
  //     });
  //   })

  // },
  default() { },
  onShareAppMessage(e) {
    if (e.from == "code") {
      return {
        title: '拾尚包',
        desc: '免费上门，专注回收，助力环保',
        path: 'pages/freeGet/freeGet?userId=' + this.data.userInfo.id + '&FollwersId=' + this.data.FollwersId,
        imageUrl: this.data.imgUrl + 'carnival/share22.png',
        bgImgUrl: this.data.imgUrl + 'carnival/share22.png'
      }
    } else if (e.from == "button") {
      const that = this
      const id = e.target.dataset.info.id
      return {
        title: '拾尚包',
        desc: '免费上门，专注回收，助力环保',
        path: 'pages/index/index',
        imageUrl: this.data.imgUrl + 'carnival/share22.png',
        bgImgUrl: this.data.imgUrl + 'carnival/share22.png',
        success() {
          that.refresh(that, id);
        }
      }
    } else {
      return {
        title: '拾尚包',
        desc: '免费上门，专注回收，助力环保',
        path: 'pages/index/index',
        imageUrl: this.data.imgUrl + 'carnival/share22.png',
        bgImgUrl: this.data.imgUrl + 'carnival/share22.png'
      }
    }

  }
});