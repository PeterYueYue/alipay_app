var app = getApp();
const request = require("/utils/request.js");
Component({
  mixins: [],
  data: {
    userInfo: {}, //用户登录存的所有信息
    type: 1, //判断类型 1为用户 2为企业
    bagCount: '0', // 用户情况下可绑定数量
    // active: "一次绑定资格可循环绑定一个拾尚包。需同时绑定使用多个拾尚包，请购买更多绑定资格",
    active: `"拾尚包"可循环使用，一个绑定资格可绑定一个拾尚包，如需同时绑定多个"拾尚包"，请购买更多绑定资格`,
    list: [],
    imgUrl: app.globalData.imgUrl,
    code: '',
    userInfo: {},
  },
  props: {},

  didMount() {
    this.init();
  },
  didUpdate(prevProps, prevData) {
    // if (Object.keys(prevData.userInfo).length === 0) {
    //   this.init();
    // }
  },
  didUnmount() {
    this.setData = () => {
      return;
    };
  },
  methods: {
    init() {
      const _this = this;
      my.getStorage({
        key: 'userInfo',
        success: function (res) {
          if (res.data == null) {
            _this.toLogin();
            return;
          } else {
            _this.setData({
              userInfo: res.data,
            })
            _this.getList();
          }
        },
        fail: function (res) {
          my.alert({ content: res.errorMessage });
        }
      });
      let userInfo = my.getStorageSync({
        key: 'userInfo', // 缓存数据的key
      });
      if (app.globalData.code !== '') {//直接扫码绑袋子
        const param = {
          userId: userInfo.data.id,
          bagCode: app.globalData.code
        }
        request.post('user/rest/userSsb/userScanBag', param).then((res) => {
          app.globalData.code = "";
          if (res.data.code == 0) {
            my.showToast({
              type: 'none',
              content: "绑定成功",
              duration: 1500,
              success: (res) => {

              },
            });
            _this.getList()
            my.showToast({
              content: '绑定成功',
              duration: 1500,
            });
          }
        })
      }
    },
    unbind(e) {
      const data = {
        id: e.target.dataset.id.id,
      }
      console.log(data);
      request.post("user/rest/user/unbind?id=" + data.id).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          my.showToast({
            content: '解绑成功',
            duration: 1500,
          });
          this.getList();
        }
      })
    },
    getBag() {//去获取拾尚包
      my.navigateTo({
        url: '/pages/member/member/member'
      });
    },
    getList() {
      let userInfo = my.getStorageSync({
        key: 'userInfo', // 缓存数据的key
      });
      this.setData({
        type: userInfo.data.userFlag,
        userInfo: userInfo.data
      })
      let data = { userId: userInfo.data.id }
      request.post("user/rest/user/getUserInfo", data).then(res => {
        if (res.data.code === 0) {
          my.setStorage({
            key: 'userInfoMore', // 缓存数据的key
            data: res.data.data, // 要缓存的数据
          });
          if (res.data.data.userAddress) {
            my.setStorage({
              key: 'add', // 缓存数据的key
              data: res.data.data.userAddress,
            });
          }
        }
      })
      // 个人用户情况下获取可绑定数量
      if (userInfo.data.userFlag == 1) {
        request.post('user/rest/user/getUserInfo', { userId: userInfo.data.id }).then((res) => {
          if (res.data.code == 0) {
            this.setData({
              bagCount: res.data.data.bagCount
            })
          }
        })
      }
      //获取已绑定袋子列表
      request.post('user/rest/userSsb/getScanBagList', { userId: userInfo.data.id }).then((res) => {
        if (res.data.code == 0) {
          let status = 0
          if (res.data.data.length == 0) {
            status = 1
          }
          this.setData({
            list: res.data.data,
            status
          })
        }
      })
    },
    toBind() {
      const _this = this
      my.scan({
        type: 'qr',
        success: (res) => {
          let data = {
            userId: this.data.userInfo.id,
            bagCode: res.code.split('code=')[1],
          }
          request.post('user/rest/userSsb/userScanBag', data).then((res) => {
            if (res.data.code == 0) {
              my.showToast({
                type: 'none',
                content: "绑定成功",
                duration: 1500,
                success: (res) => {

                },
              });
              _this.getList()
            }
          })
        }
      })
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
            this.props.onSwitchTab('index')
          }
        },
      });
    },


  },
});




