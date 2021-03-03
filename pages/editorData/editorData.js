var app = getApp();
const request = require("../../utils/request.js");
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    name: '',
    head: '',
    headUrl: '',
    userInfo: ''
  },
  onLoad() {
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    // console.log(userInfo)
    this.setData({
      name: userInfo.data.nickName,
      headUrl: userInfo.data.headPortrait,
      userInfo: userInfo.data
    })
  },
  onInput(e) {
    // console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  upload: function(e) {
    var that = this;
    my.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const path = res.apFilePaths[0];
        // console.log(path)
        my.uploadFile({
          url: 'https://miniapp.shishangbag.vip/sbag-server/' + 'user/rest/user/uploadImg',
          // url: request.localhost + 'user/rest/user/uploadImg',
          fileType: 'image',
          fileName: 'file',
          filePath: path,
          headers: request.dataConversion(),
          success: res => {
            // console.log(JSON.parse(res.data).data.imageUrl)
            that.setData({
              headUrl: JSON.parse(res.data).data.baseImgUrl+JSON.parse(res.data).data.imageUrl,
              head: JSON.parse(res.data).data.imageUrl,
            })
            console.log(that.data.headUrl)
          },
          fail: function(res) {
            console.log(res);
          },
        })

      }
    })
  },
  submit() {
    if (!this.data.name) {
      my.showToast({
        content: '昵称不能为空',
        duration: 1500,
      });
      return false;
    }
    let data = {
      avatar: this.data.headUrl,
      nickName: this.data.name,
      userId: this.data.userInfo.id
    }
    let param = {
      userAccount: this.data.userInfo.id
    }
    request.post('user/rest/user/updateUserInfo', data).then((res) => {
      // console.log(res)
      my.getAuthCode({
        scopes: ['auth_base'],
        success: (res) => {
          const authCode = res.authCode;
          request.post("user/rest/user/login", { "authCode": res.authCode,"userId": this.data.userInfo.id, }).then(res => {
            // console.log(res)
            if (res.data.code === 0) {
              my.setStorageSync({
                key: 'userInfo', // 缓存数据的key
                data: res.data.data.userInfo, // 要缓存的数据
                success: (res) => {
                  
                },
              });
              my.showToast({
                content: '修改成功',
                duration: 1500,
                success() {
                  my.navigateBack();
                }
              });
            }
          })
        }
      });
    })
    // if (this.data.name.length < 2) {
    //   my.showToast({
    //     content: '昵称不能少于两个字符',
    //     duration: 1500,
    //   });
    //   return false;
    // }
    // let data = {
    //   card: this.data.card,
    //   name: this.data.name,
    //   userId: this.data.userId,
    //   frontCard: this.data.frontCard,
    //   reverseCard: this.data.reverseCard,
    // }
    // console.log(data);
    // request.post('user/rest/user/addUserCard', data).then((res) => {
    //   if (res.data.code == 0) {
    //     my.showToast({
    //       content: '绑定成功',
    //       duration: 1500,
    //     });
    //     my.navigateBack();
    //   }
    // })

  }
});
