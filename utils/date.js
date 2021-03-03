const currentDay = () => { //2018-11-11
  var date = new Date();
  var year = date.getFullYear(); //当前年
  var fullMonth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); //当前月 加0
  var month = date.getMonth() + 1; //当前月 
  var fullDay = (date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1); //当前日 加0
  var day = date.getDate();
  var week = new Date().getDay(); //当前星期
  const todayModel = "今天 " + month + "月" + day + "日";
  const navData = [{
      text: todayModel,
      value: localDate(0)
    },
    {
      text: formatCurrentDay(week + 1, 1),
      value: localDate(1)
    },
    {
      text: formatCurrentDay(week + 2, 2),
      value: localDate(2)
    },
    {
      text: formatCurrentDay(week + 3, 3),
      value: localDate(3)
    },
    {
      text: formatCurrentDay(week + 4, 4),
      value: localDate(4)
    },
    {
      text: formatCurrentDay(week + 5, 5),
      value: localDate(5)
    },
    {
      text: formatCurrentDay(week + 6, 6),
      value: localDate(6)
    }
  ];
  return navData;
}

const localDate = (AddDayCount) => {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  return y + "-" + m + "-" + d;
}

const formatCurrentDay = (week, AddDayCount) => { // 周四 12月6日
  var str = "";
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var month = dd.getMonth() + 1; //获取当前月份的日期，不足10补0
  var day = dd.getDate(); //获取当前几号，不足10补0
  if (week % 7 == 0) {
    str = "周日 " + month + "月" + day + "日";
  } else if (week % 7 == 1) {
    str = "周一 " + month + "月" + day + "日";
  } else if (week % 7 == 2) {
    str = "周二 " + month + "月" + day + "日";
  } else if (week % 7 == 3) {
    str = "周三 " + month + "月" + day + "日";
  } else if (week % 7 == 4) {
    str = "周四 " + month + "月" + day + "日";
  } else if (week % 7 == 5) {
    str = "周五 " + month + "月" + day + "日";
  } else if (week % 7 == 6) {
    str = "周六 " + month + "月" + day + "日";
  }
  return str;
}

const localTime = () => { //首页
  var date = new Date();
  var startTime = date.getHours() + ":00";
  var endTime = date.getHours() + 1 + ":00";
  var startTime_full = date.getHours() + ":00:00";
  var endTime_full = date.getHours() + 1 + ":00:00";
  var selectedHoursId = date.getHours()
  var startDay = localDate(0);
  var week = date.getDay(); //当前星期
  var startDayText = getWeek(week);

  var deserveTime = {
    "startTime": startTime,
    "endTime": endTime,
    "startDayText": startDayText,
    "startDay": startDay,
    "hourLength": 1,
    "startTime_full": startTime_full,
    "endTime_full": endTime_full,
    "selectedNavsId": 0,
    "selectedHoursId": [selectedHoursId]
  }
  return deserveTime;
}

const getWeek = (week) => {
  var str = "";
  if (week == 0) {
    str = "周日";
  } else if (week == 1) {
    str = "周一";
  } else if (week == 2) {
    str = "周二";
  } else if (week == 3) {
    str = "周三";
  } else if (week == 4) {
    str = "周四";
  } else if (week == 5) {
    str = "周五";
  } else if (week == 6) {
    str = "周六";
  }
  return str;
}

function timestampToTime(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '年';
   let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
  let D = date.getDate() + '日';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return Y+M+D;
}
module.exports = {
  currentDay,
  localTime,
  timestampToTime
}
