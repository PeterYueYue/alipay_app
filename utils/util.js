const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  format: format,
  orderInfo:orderInfo,
  getWeek: getWeek,
  weiChatPay: weiChatPay,
  meterTokm: meterTokm,
  // decrease_oneSecond: decrease_oneSecond
  terminal: terminal,
  timeLimit: timeLimit,
  cutDate: cutDate
}
function weiChatPay (timeStamp, nonceStr, packages, paySign, orderInfo) {
  my.requestPayment({
    'timeStamp': timeStamp,
    'nonceStr': nonceStr,
    'package': packages,
    'signType': 'MD5',
    'paySign': paySign,
    'success': function (res) {
      // my.navigateTo({
      //   url: '/pages/paySuccess/paySuccess',
      // })
    },
    'fail': function (res) {
  
    },
    'complete': function (res) {
      my.setStorageSync("orderInfo", orderInfo);
      
    }
  })
}
function format (mes) {
  if (mes.userMobile) {
    mes.userMobile = mes.userMobile.slice(0, 3) + "****" + mes.userMobile.slice(-4)
  }
  if (mes.userAccount) {
    mes.userAccount = mes.userAccount.slice(0, 3) + "****" + mes.userAccount.slice(-4)
  }
  if (mes.idNum) {
    mes.idNum = mes.idNum.slice(0, 10) + "****" + mes.idNum.slice(-4)
  }
  if (mes.bookStartTime) {
    mes.bookStartTime = mes.bookStartTime.slice(0, 16) 
  }
  if (mes.bookEndTime) {
    mes.bookEndTime = mes.bookEndTime.slice(0, 16)
  }
  return mes;
}

function orderInfo(mes) {
  if (mes.mobile) {
    mes.mobile = mes.mobile.slice(0, 3) + "****" + mes.mobile.slice(-4)
  }
  if (mes.idNum) {
    mes.idNum = mes.idNum.slice(0, 10) + "****" + mes.idNum.slice(-4)
  }
  if (mes.bookStartTime) {
    mes.startTime = mes.bookStartTime.slice(-8, -3);
    mes.startDay = mes.bookStartTime.split(" ")[0];
  }
  if (mes.bookEndTime) {
    mes.endTime = mes.bookEndTime.slice(-8, -3)
    mes.endDay = mes.bookEndTime.split(" ")[0];
  }
  return mes;
}

function getWeek(date) {
  var weekNum = new Date(date).getDay();
  var week;
  switch (weekNum){
    case 0:
      week = "周日";
      break;
    case 1:
      week = "周一";
      break;
    case 2:
      week = "周二";
      break;
    case 3:
      week = "周三";
      break;
    case 4:
      week = "周四";
      break;
    case 5:
      week = "周五";
      break;
    case 6:
      week = "周六";
      break;
  }
  return week;
}

function meterTokm(res){
  res.forEach(function(item,i){
    let distance = Number(item.distance)
    if (distance >= 1000) {
      distance = (distance / 1000).toFixed(1) + ' KM';
      res[i].distance = distance
    } else {
      res[i].distance = item.distance + ' M'
    }
  })
  return res
}

function decrease_oneSecond_android(time){
  let date = (new Date(time).getTime()) - 1000;
  return timetrans(date)
}

function decrease_oneSecond_ios(time) {
  let oldtime = time.replace(/-/g, '/')
  let date = (new Date(oldtime).getTime()) - 1000;

  return timetrans(date)
}
function timetrans(date){
    var date = new Date(date);//如果date为10位不需要乘1000
    var Y = Number(date.getFullYear()) + '-';
    var M = (Number(date.getMonth()) + 1 < 10 ? '0' + (Number(date.getMonth()) + 1) : Number(date.getMonth())+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}

function terminal(time) {
  let endTime;
  if (time.indexOf("24:00:00") !== -1){
    endTime = time.split(" ")[0] + " 23:59:59";
  }else{
    my.getSystemInfo({
      success: function (res) {
        if (res.platform == "devtools") { //PC
          endTime = decrease_oneSecond_android(time)
        } else if (res.platform == "ios") { //            IOS
          
          endTime = decrease_oneSecond_ios(time)
        } else if (res.platform == "android") { // android
          endTime = decrease_oneSecond_android(time)
        }
      }
    })
  }
  return endTime;
}

function timeLimit(time){
  let endTime;
  const localTime = new Date().getTime();
  my.getSystemInfo({
    success: function (res) {
      if (res.platform == "ios") { // IOS
        time = time.replace(/-/g, '/')
      }
    }
  })

  if (time.indexOf("24:00:00") !== -1) {
    const str = time.split(" ")[0] + " 23:59:59"
    endTime = new Date(str).getTime();
  } else {
    endTime = new Date(time).getTime();
  }
  if (localTime >= endTime) {
    
    return false;
  } else {
    return true;
  }
  
}

function cutDate(time){ //入住截取时间
  if (time.bookEndTime) {
    time.endTime = time.bookEndTime.slice(5, 16);
  }
  if (time.bookStartTime){
    time.startTime = time.bookStartTime.slice(5, 16);
  }
  return time;
}