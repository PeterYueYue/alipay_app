import md5 from "./md5.js"
var app = getApp();

var localhost = "https://cat.shishangbag.vip/sbag-server/" //测试环境 
// var localhost = "https://miniapp.shishangbag.vip/sbag-server/v20210101/"  //线上
// 签名MD5加密
function dataConversion (data) {
  let user = my.getStorageSync({key:'token'});
  let token =user.data?user.data:''; 
  let timestamp = new Date().getTime();
  let random = Math.ceil(Math.random()*1000000000);
  let nonce = `83552b17-c9a4-4bfb-9ceb-ef31dc82faa9${new Date().getTime()}${random}`;
  let headMsg = {
    'content-type': 'application/json',
    "timestamp": JSON.stringify(timestamp),
    "appid": "appid00000000000002",
    "nonce": nonce,
  }
  if (token) {
    headMsg.token=token;
    headMsg.sign=md5.hex_md5(`appid=appid00000000000002&nonce=${nonce}&timestamp=${timestamp}&token=${token}&sa82kjk*98^asda78fyfhgt7fy6556r213gu`);
  }else{
    headMsg.sign=md5.hex_md5(`appid=appid00000000000002&nonce=${nonce}&timestamp=${timestamp}&sa82kjk*98^asda78fyfhgt7fy6556r213gu`);
  }
  return headMsg
}
var that = this;
const post = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    let newData = dataConversion(data);
    my.request({
      url: localhost + url,
      data: data,
      method: 'POST',
      headers:newData,
      success: function(res) {//服务器返回数据
        if (res.data.code == 2 || res.data.code == 1) {
          my.showToast({
            type: 'none',
            content: res.data.message,
            duration: 1500,
            success: function() {
            }
          });
          resolve(res);
        } else if (res.data.code == "0000") { 
          resolve(res);
        }
        else if (res.data.code == "1110") {
          my.clearStorage();
          my.navigateTo({
            url: '/pages/login/login'
          });
        }  else {
          resolve(res);
        }
      },
      error: function(e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

// 封装get请求
const get = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    let newData = dataConversion(data)
    my.request({
      url: localhost + url,
      data: data,
      headers: newData,
      success: function(res) {//服务器返回数据 
        if (res.data.code == 2 || res.data.code == 1) {
          my.showToast({
            type: 'none',
            content: res.data.message,
            duration: 1500,
          });
          resolve(res);
        } else if (res.data.code == "0000") {
          resolve(res);
        }
        else if (res.data.code == "1110") {
          my.clearStorage();
          my.navigateTo({
            url: '/pages/login/login'
          });
        } else {
          resolve(res);
        }
      },
      error: function(e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}

module.exports = {
  post,
  get,
  localhost,
  dataConversion,
}