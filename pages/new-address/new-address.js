import { rawCitiesData } from './cityData'; // 导入城市数据
const request = require("../../utils/request.js");

Page({
  data: {
      id:'',
      items: { name: 'defaultAddress', value: '默认地址' },//默认地址
      checked: true,
      name: '',//姓名
      phone: '',//手机号
      site:'',//地址
      selectValue: '', // 选择的值
      selectShow: false, // 是否显示级联组件
      rawCitiesData: rawCitiesData, // mock的级联数据
      loading:false,
      columns: [
        {
          values: ["上海市"],
          className: 'column1'
        },
        {
          values: [
            { text: '杭州'},
            { text: '宁波' },
            { text: '温州' }
          ],
          className: 'column2'
        },
        {
          values: ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区','崇明区'],
          className: 'column3',
          defaultIndex: 1
        }
      ],
      value: [0,0,0],//地址选择的数组
      province: [],//省
      citys: [],//市
      areas: [],//区
  },
  onLoad(e){
   if(e.data){//编辑
      let data = JSON.parse(e.data)
      this.setData({
        checked:data.isDefault==0?false:true,
        name:data.userName,
        phone:data.userMobile,
        id:data.id,
        site:data.address,
        selectValue:data.provinceName+' '+data.cityName+' '+data.areaName
      })

   }
   my.setNavigationBar({
      title: e.title
    });
  },

  onReady(){
    this.initData();
    
  },
  initData(){
    this.getProvince(0)
  },
  // 获取省份
  getProvince(){
    request.get("user/rest/address/tarea?parentId=0").then((res) => {
      let p = res.data.data
      this.setData({ province: p,})
      let arr1 = []
      p.map(e => {
        e.text = e.areaName
        arr1.push(e)
      })
      this.setData({ ['columns[0]' + 'values']: arr1,})
      this.getCitys(res.data.data[0].id)
    })
  },
  // 获取城市
  getCitys(id) {
    request.get("user/rest/address/tarea?parentId="+id).then((res) => {
      let c = res.data.data
      this.setData({ citys: c })
      let arr2 = []
      c.map(e => {
        e.text = e.areaName
        arr2.push(e)
      })
      this.setData({ 
        ['columns[1]' + 'values']: arr2,
         citysName: arr2[0].areaName,
      })
      this.getAreas(res.data.data[0].id)
    })
  },
  // 获取行政区
  getAreas(id) {
    request.get("user/rest/address/tarea?parentId=" + id).then((res) => {
      let a = res.data.data
      this.setData({ areas: a })
      let arr3 = []
      a.map(e => {
        e.text = e.areaName
        arr3.push(e)
      })
      this.setData({ 
        ['columns[2]' + 'values']: arr3 ,
        areasName: arr3[0].areaName,
      })
    })
  },
  onChange1(e) {//picker选择器
    let newVal = e.detail.value;
    let oldVal = this.data.value;
    for (var i=0;i<oldVal.length; i++) {
      if(newVal[i] !== oldVal[i]){
        console.log(newVal[i])
        switch (i) {
          case 0:
            this.setData({
              provinceName: this.data.province[newVal[0]].areaName,
              value: [newVal[i],0,0]
            })
            this.getCitys(this.data.province[newVal[0]].id,)
            break
          case 1:
            this.setData({
              value: [oldVal[0],newVal[1],0],
              citysName: this.data.citys[newVal[1]].areaName,
            })
            this.getAreas(this.data.citys[newVal[1]].id)
            break
          case 2:
            this.setData({
              areasName: this.data.areas[newVal[2]].areaName,
            })
            break
        }
      }
    }
  },
  onConfirm(event) {
    // console.log(this.data.provinceName)
    // console.log(this.data.citysName)
    // console.log(this.data.areasName)
    let p = this.data.provinceName?this.data.provinceName:this.data.province[0].areaName
    let c = this.data.citysName?this.data.citysName:this.data.citys[0].areaName
    let a = this.data.areasName?this.data.areasName:this.data.areas[0].areaName
    this.setData({
      selectValue: p+' '+c+' '+a,
      selectShow:false
    })
  },
  onClose() {
    this.setData({
      selectShow: false
    });
  },
  onCancel() {
   this.setData({
     selectShow:false
   })
  },

  //添加or编辑
  push:function(){
    const _this = this
     var reg= /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
     if(this.data.name==""){
      my.showToast({
        content: '请填写姓名',
        duration: 1500,
      });
      return false;
    }
    if(this.data.name.length>20){
      my.showToast({
        content: '姓名不能超过20个字符',
        duration: 1500,
      });
      return false;
    }
    if(this.data.phone==""){
      my.showToast({
        content: '请填写手机号',
        duration: 1500,
      });
      return false;
    }
    if(!reg.test(this.data.phone)){
      my.showToast({
        content: '请填写正确的手机号',
        duration: 1500,
      });
      return false;
    }
    if(this.data.selectValue==""){
      my.showToast({
        content: '请选择所在区域',
        duration: 1500,
      });
      return false;
    }
    if(this.data.site==""){
      my.showToast({
        content: '请填写详细地址',
        duration: 1500,
      });
      return false;
    }
    if(this.data.site.length>20){
      my.showToast({
        content: '详细地址不能超过20个字符',
        duration: 1500,
      });
      return false;
    }

      this.setData({
        loading:true
      })
      let userInfo = my.getStorageSync({
        key: 'userInfo', // 缓存数据的key
      });
      let addDetail = this.data.selectValue.split(' ');
      // console.log(this.data.provinceName);
      // console.log(this.data.cityName);
      // console.log(this.data.areaName);
      let data = {
        userId:userInfo.data.id,
        address:this.data.site,
        isDefault:this.data.checked==true?"1":"0",
        userMobile:this.data.phone,
        userName:this.data.name,
        provinceName:addDetail[0],
        cityName:addDetail[1],
        areaName:addDetail[2],
      }
      if(this.data.id){
        data.addressId = this.data.id
        request.get("user/rest/address/editAddress",data).then((res)=>{
          if(res.data.code == 0){
            my.navigateBack()
            _this.setData({
              loading:true
            })
          }
        })
      }else{
        request.get("user/rest/address/addAddress",data).then((res)=>{
        if(res.data.code == 0){
          my.navigateBack()
          _this.setData({
              loading:true
            })
        }
      })
      }
  },
  //默认按钮的点击事件
  onChange(e){
    if(e.currentTarget.dataset.checked== true){
      this.setData({
        checked:false
      })
    }else{
      this.setData({
        checked:true
      })
    }
  },
  change(e) {
    const id = e.target.dataset.id
    switch(id) {
     case "1"://姓名
        this.setData({
          name: e.detail.value
        });
        break;
    case "2"://手机号
        this.setData({
          phone: e.detail.value
        });
        break;  
    case "3"://地址
        this.setData({
          site: e.detail.value
        });
        break;
     default:
        break;
    } 
  },
  //显示级联选择
  showSelect(){
    if(this.data.selectValue) {
      //编辑回显
      // let data = this.data.selectValue.split(' ')
      // console.log(this.data.citys);
      // this.data.province.map((e, i) => {
      //   if(data[0]==e.areaName) {
      //     let value= "value["+0+"]"
      //     this.setData({
      //       [value]: i,
      //     })
      //   }
      // })
      
    }
    this.setData({
      selectShow:true
    })
  },
   /**
   * 关闭级联组件
   * @method closeSelect
   */
  closeSelect() {
    this.setData({ selectShow: false });
  },
  /**
   * 点击确认触发的事件
   * @method onSelectSuccess
   * @param {*} result
   */
  onSelectSuccess(result) {
    let selectValue = '';
    result && result.map((item) => {
      selectValue += item.name + ' ';
    });
    if (selectValue.length > 0) {
      selectValue = selectValue.substr(0, selectValue.length - 1);
    }
    this.setData({ selectValue });
  }
});