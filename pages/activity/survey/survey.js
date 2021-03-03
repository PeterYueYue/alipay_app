const request = require("../../../utils/request.js");
var app = getApp();
Page({
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    userInfo: {},
    que: 0,
    dis: false,
    datas: [
      {
        number: 1,
        question: '1.您的年龄阶段是？',
        answer: ['18岁及以下', '18-25', '26-35', '36-45', '46-55', '56-65', '66岁以上'],
        reason: '',
      },
      {
        number: 2,
        question: '2.您的性别是？',
        answer: ['女', '男'],
        reason: '',
      },
      {
        number: 3,
        question: '3.您目前居住在上海哪个区？',
        answer: ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
        reason: '',
      },
      {
        number: 4,
        question: '4.您的教育水平是？',
        answer: ['高中(中专)及以下', '本科', '大专', '硕士', '博士及以上'],
        reason: '',
      },
      {
        number: 5,
        question: '5.您的职业属性是？',
        answer: ['全职', '兼职', '自由职业者', '家庭主妇', '学生', '其他(请补充)'],
        reason: '',
      },
      {
        number: 6,
        question: '6.您最近一年购置衣物的频率是？',
        answer: ['每周一次及以上', '每两周一次', '每月一次', '每两个月一次', '其他(请补充)'],
        reason: '',
      },
      {
        number: 7,
        question: '7.您最近一年内点外卖的频率是？',
        answer: ['每周一次及以上', '每两周一次', '每月一次', '每两个月一次', '其他(请补充)'],
        reason: '',
      },
      {
        number: 8,
        question: '8.您最近一年网购的频率是？',
        answer: ['每周一次及以上', '每两周一次', '每月一次', '每两个月一次', '其他(请补充)'],
        reason: '',
      },
      {
        number: 9,
        question: '9.您最近一年网购的频率是？',
        answer: ['每周一次及以上', '每两周一次', '每月一次', '每两个月一次', '其他(请补充)'],
        reason: '',
      },
      {
        number: 10,
        question: '10.在您日常的垃圾回收活动中，占比最大的可回收物是？',
        answer: ['纺织品', '塑料制品', '纸制品', '玻璃制品', '其他(请补充)'],
        reason: '',
      },
      {
        number: 11,
        question: '11.您是通过何种渠道获知并注册拾尚回收小程序的？',
        answer: ['电视新闻、报纸报道等传统媒体渠道', '微信、微博、抖音等线上新媒体渠道', '社区宣传、展会宣讲等线下推广活动', '亲朋好友推荐', '其他(请补充)'],
        reason: '',
      },
      {
        number: 12,
        question: '12.您是否已经成功预约并使用过拾尚回收垃圾分类回收服务？',
        answer: ['是', '否'],
        reason: '',
      },
    ],
    datay: [
      {
        number: 13,
        question: '13.您最近一年内使用拾尚回收小程序的频率是？',
        answer: ['每周一次及以上', '每两周一次', '每月一次', '每两个月一次', '其他(请补充)'],
        reason: '',
      },
      {
        number: 14,
        question: '14.促使您使用拾尚回收小程序的原因是？',
        answer: ['区别于传统垃圾回收模式，线上下单、上门收取的便捷性', '参与垃圾回收得到的物质报酬', '支持环保公益不计报酬', '其他(请补充)'],
        reason: '',
      },
      {
        number: 15,
        question: '15.请为拾尚回收小程序产品满意度打分：',
        answer: ['不满意', '基本满意', '满意', '非常满意'],
        reason: '',
      },
      {
        number: 16,
        question: '16.您愿意将拾尚回收推荐给亲朋好友吗？',
        answer: ['不愿意', '会考虑', '愿意', '非常愿意'],
        reason: '',
      },
    ],
    datal: [
      {
        number: 17,
        question: '17.请问您对拾尚包小程序不满意的原因是？（多选）',
        answer: ['预约流程繁琐', '物流流收运不及时', '回收数据不准确', '收益过低', '其他(请补充)'],
        reason: '',
      },
    ],
    dataf: [
      {
        number: 18,
        question: '18.您是如何处理可回收垃圾的？',
        answer: ['自行进行垃圾分类后直接丢入社区垃圾处理点', '联系并卖给垃圾回收小贩或社区清洁工', '赠送给社区保洁人员', '其他(请补充)'],
        reason: '',
      },
      {
        number: 19,
        question: '19.您暂未在拾尚回收小程序预约垃圾回收的原因是？',
        answer: ['尚不了解拾尚回收垃圾分类回收项目的背景、运营模式等', '尚不了解小程序的使用操作流程', '对垃圾回收项目不感兴趣', '其他(请补充)'],
        reason: '',
      },
      {
        number: 20,
        question: '20.以下哪一种营销方式最能吸引您参与其中？',
        answer: ['针对新用户的红包、补贴等激励型活动', '举办垃圾回收积分赛等趣味竞赛型活动', '垃圾回收兑换爱心捐助金额等公益型活动', '其他(请补充)'],
        reason: '',
      },
    ],
    arr: [],//答题结果
    num: [],//已回答题目
  },
  onShow() {// 页面显示
    let userInfo = my.getStorageSync({
      key: 'userInfo', // 缓存数据的key
    });
    if (!userInfo.data) {
      this.toLogin();
      return false;
    }
    this.setData({
      userInfo: userInfo.data,
    })
  },
  radioChange: function (e) {
    let number = e.target.dataset.number;//题号
    let question = e.target.dataset.question;//题目
    let answer = e.detail.value;
    let data = {
      number: number,
      question: question,
      answer: answer,
    };
    let arr = this.data.arr;//总答案
    let num = this.data.num;//总题号
    if (num.indexOf(number) != -1) {//重选替换
      arr = arr.map(t => {
        return t.number === data.number ? data : t;
      })
    } else {
      arr.push(data);
      num.push(number);
      this.setData({
        arr: arr,
        num: num,
      })
    }
    this.showInput(number, answer);//显示输入框
    this.relevance(e,number,num,arr)// 关联题目修正总答案
  },
  change(e) {//填写输入框
    let number = e.target.dataset.number;
    let arr = this.data.arr;
    arr = arr.map(t => {
      if (t.number == number) {
        t.reason = e.detail.value;
      }
      return t
    })
    this.setData({ arr: arr });
  },
  submit() {//提交
    if (this.check() == false) {
      return;
    }
    //判断选择其他选项输入框已经必填
    let arr = this.data.arr;
    let flag = true;
    arr.map(i => {
      if (i.re == true && i.reason == undefined) {
        my.showToast({
          type: 'none',
          content: '您第' + i.number + '题未补充',
        });
        flag = false;
        return;
      }
    })
    if (!flag) {//未补充返回
      return;
    }
    const param = {
      userId: this.data.userInfo.id,
      strJson: JSON.stringify(this.data.arr),
    }
    request.post("user/rest/researchResult/save", param).then(res => {
      if (res.data.code === 0) {
        my.showToast({
          type: 'success',
          content: '提交成功,已获得10个拾尚币',
          success: function() {
            my.navigateBack()
          }
        });
      }
    })
  },
  relevance(e,number,num,arr) {//过滤已作答
    if (number == 12) {
      this.setData({ que: e.detail.value == "是" ? 1 : 2 });
      if (e.detail.value == "是") {
        num = num.filter(item =>  ![18,19,20].includes(item))
        arr = arr.filter(item =>  ![18,19,20].includes(item.number))
        this.setData({ num: num, arr: arr });
      }else {
        num = num.filter(item =>  ![13,14,15,16,17].includes(item))
        arr = arr.filter(item =>  ![13,14,15,16,17].includes(item.number))
        this.setData({ num: num, arr: arr });
      }
    } 
    if (number == 15) {
      this.setData({ dis: e.detail.value == "不满意" ? true : false });
      if (e.detail.value !== "不满意") {
        num = num.filter(item =>  ![17].includes(item))
        arr = arr.filter(item =>  ![17].includes(item.number))
        this.setData({ num: num, arr: arr });
      }
    }
  },
  check() {
    let num = this.data.num.sort(function (a, b) { return a - b });
    let numTotal = [];
    if (this.data.que == 0) {
      numTotal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    } else if (this.data.que == 1 && !this.data.dis) {//17非不满意
      numTotal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    } else if (this.data.que == 1 && this.data.dis) {//17不满意
      numTotal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    } else if (this.data.que == 2) {
      numTotal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 19, 20];
    }
    console.log(this.data.arr)
    console.log(num)
    console.log(numTotal);
    for (var i = 0; i < numTotal.length; i++) {
      if (num[i] !== numTotal[i]) {
        my.showToast({
          type: 'none',
          content: '您第' + numTotal[i] + '题未答',
        });
        return false;
      }
    }
  },
  showInput(number, answer) {//展示补充输入框
    if (number >= 1 && number <= 12) {
      let datas = this.data.datas;
      datas = datas.map(t => {
        if (t.number == number) {
          t.reason = answer == "其他(请补充)" ? true : false;
        }
        return t
      })
      this.setData({ datas: datas });
    } else if (number >= 13 && number <= 15) {
      let datay = this.data.datay;
      datay = datay.map(t => {
        if (t.number == number) {
          t.reason = answer == "其他(请补充)" ? true : false;
        }
        return t
      })
      this.setData({ datay: datay });
    } else if (number >= 18 && number <= 20) {
      let dataf = this.data.dataf;
      dataf = dataf.map(t => {
        if (t.number == number) {
          t.reason = answer == "其他(请补充)" ? true : false;
        }
        return t
      })
      this.setData({ dataf: dataf });
    } else if (number == 17) {
      let datal = this.data.datal;
      datal = datal.map(t => {
        if (t.number == number) {
          t.reason = answer.indexOf("其他(请补充)") != -1 ? true : false;
        }
        return t
      })
      this.setData({ datal: datal });
    }
    //标记必输入框
    let arr = this.data.arr;
    arr = arr.map(res => {
      if (res.number == number) {
        res.re = answer == "其他(请补充)" ? true : false;
      }
      return res
    })
    this.setData({ arr: arr });
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
          my.redirectTo({
            url: '/pages/index/index'
          });
        }
      },
    });
  },
  onLoad(e) {
  },
  onReady() {
    // 页面加载完成
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
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
