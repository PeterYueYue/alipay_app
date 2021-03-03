const request = require("../../../utils/request.js");
var countTimer = null;
var num = 0;
var answerNum = 0;
var app = getApp();
Page({
  data: {
    imgUrlNew: app.globalData.imgUrlNew,
    readyArr:"Ready",
    canvasId:'canvasProgressbg',
    canvasId1:'canvasProgress',
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null
    progress_txt:'11',
    index:0,
    result:'',
    typeId:'',
    animationInfo:null,
    ishowTips:false,
    qusetionsList:'',
    qusetionsListBefor:[,],
    qlist:[],
    prefix:'',
    scount:0,
    isOpenMask:false,
    resState:""
  },
  onLoad() {},
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '每日答答答',
      desc: '垃圾要分类，拒做污染者',
      path: 'pages/view/index/index?source=dadada',
    };

  },
  onReady: function() {
    
  },

  onShow(){
    this.getQuestionList()
    
  },
  getbao(){
    // my.navigateTo({
    //   url:'/pages/member/nomalMember/nomalMember',
    // })
    my.navigateTo({
      url: `/pages/member/dnActivity/dnActivity?id=${this.data.invitationId}`
    });
  },
  goRule(){
    my.navigateTo({
      url: '/pages/answer/library/library',
    })
  },
  goAgain(){
    let list = this.data.qlist;
    this.setData({scount:0})
    this.setData({isOpenMask:false})
    this.setData({index:0},() => {
      this.drawCircle((1/this.data.qlist.length)*2)
    })
    this.setData({prefix:''})
    this.setData({qlist:list.map(e => {
      e.state = "none"
      e.optionList.forEach(j => {
        j.state = 'none'
        return j;
      })
      return e;
    } )})
    
  },
  changeIndex(){
    let index = this.data.index
    if(this.data.qlist[index].state != 'none'){
      if(index < this.data.qlist.length-1){
        index+=1
        console.log(index)
        this.setData({prefix:''})
        this.setData({index:index})
      }
      this.drawCircle(((index+1)/this.data.qlist.length)*2)
    }else{
      my.showToast({
        content: '请选择答案',
        type:'none'
      })

    }
    
  },
  changeState(e){
    if(e.currentTarget.dataset.data.prefix=='A') {
      this.setData({right: 'B'})
    } else {
      this.setData({right: 'A'})
    }
    let list = this.data.qlist
    let index_ = e.currentTarget.dataset.index_
    if(list[this.data.index].state != 'none'){
      return
    }
    list[this.data.index].optionList.forEach(e => {
      e.state = 'none'
      return e
    })
    if(e.currentTarget.dataset.data.isCorrect){
      list[this.data.index].state = "d"
      list[this.data.index].optionList[index_].state = "d"
      let scount = this.data.scount;
      scount+=1
      this.setData({scount:scount})
    }else{
      list[this.data.index].state = "cw"
      list[this.data.index].optionList[index_].state ="cw"
      this.setData({prefix:list[this.data.index].optionList[index_].prefix})
    }
    if(this.data.index == this.data.qlist.length-1){
      this.drawCircle(2)

      
      if(this.data.scount == this.data.qlist.length){
        this.setData({resState:'Y'})
        // 答题完成提交
        let id = my.getStorageSync({key: "userInfo"}); id = id.data.id
        request.post("user/rest/user/answerQuestion?userId="+id).then((res) => {
          //console.log(res,"lll")
        })
      }else{
        this.setData({resState:'N'})
      }
      this.setData({isOpenMask:true})

    }


    this.setData({qlist:list})

  },
  getQuestionList(){

    request.post("user/rest/question/getQuestionList?qty=3").then(res => {
      
      if(res.data.code == 0){
        this.setData({qlist:res.data.data.map(e => {
          e.state = "none"
          e.optionList.forEach(j => {
            j.state = 'none'
            return j;
          })
          return e;
        } )},() => {
          this.drawCircle((1/this.data.qlist.length)*2)
        })
        
        
      }
      
    })

  },
  titleAnimation(){
    var animation = my.createAnimation({
      duration: 200,
        timeFunction: 'linear',
    });
    this.animation = animation;

    animation.opacity(1).scale(1.1).step();
    animation.opacity(1).scale(1).step();
    
    
    this.setData({
      animationInfo:animation.export()
    });

    


  },
  
  onUnload(){

    clearInterval(countTimer);

  },
  getResult(e){
    num++
    if(num>=2){
      return
    }
    clearInterval(countTimer);
    let data = e.target.dataset.data;
  
  },
  goNextStep(){

    let newIndex = this.data.index+1
    clearInterval(countTimer);
    if(newIndex>=this.data.qusetionsList.length){
      if(answerNum>0){
        my.redirectTo({url:"/pages/view/answer/achieve/achieve"});
      }else{
        my.navigateBack({
          delta: 1
        });
      }
      
      
    }else{

      this.titleAnimation();
      this.setData({typeId:" "})
      this.setData({index:newIndex})

      
      this.init()
    }
    
  },  
  drawCircle: function(step) {
    console.log(step,"stepstep")
    
    var context = my.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#8fc9e1");
    gradient.addColorStop("0.5", "#22B4F1");
    gradient.addColorStop("1.0", "#0f45a0");
    context.setLineWidth(4);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(42, 42, 35, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()

  },
 
  
});
