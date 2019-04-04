var app = getApp()
const {
  $Toast
} = require('../../dist/base/index');

Page({

  data: {
    clientHeight: '',
    currentTab: '0',
    changeType: '0',
    chooseList: [],
    productTypeList:[],
    quantum: 1,
    productList: [],
    all: '全选',
    timeIndex: '1',
    timeType:'7',
    nameCode:'325',
    nameIndex: '0',
    applyTime: ['今天', '最近7天', '全部时间'],
    recordList: [{
        name: '玫瑰精油1',
        num: '4',
        time: '2018-04-02',
        statues: '已通过'
      },
      {
        name: '玫瑰精油1',
        num: '4',
        time: '2018-04-02',
        statues: '已通过'
      },
      {
        name: '玫瑰精油1',
        num: '4',
        time: '2018-04-02',
        statues: '已通过'
      },
      {
        name: '玫瑰精油1',
        num: '4',
        time: '2018-04-02',
        statues: '已通过'
      },
      {
        name: '玫瑰精油1',
        num: '4',
        time: '2018-04-02',
        statues: '已通过'
      }
    ],
    today:''
  },

  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    that.getApplyList('325', that.data.timeType);
    that.getAllProduct();
    // debugger
    // that.data.productTypeList.unshift({ name: '全部', code: '325' })
    // that.setData({
    //   productTypeList: that.data.productTypeList
    // })
  },
  // tab
  handleChange({
    detail
  }) {
    this.setData({
      currentTab: detail.key,
      changeType: '0',
    });
  },
  // 显示产品名称下拉
  changeType() {
    if (this.data.changeType == 0) {
      this.setData({
        changeType: '1'
      })
    } else {
      this.setData({
        changeType: '0'
      })
    }
  },
  // 选择产品
  chooseBtn(event) {
    var that = this;
    let id = event.target.id;
    that.data.chooseList.forEach((v, i, arr) => {
      if (v.code == id) {
        let click = arr[i].statues == '0' ? '1' : '0';
        that.setData({
          [`chooseList[${i}].statues`]: click
        })
        if (click == 1) {
          let projectItem = {
            craCode: wx.getStorageSync('user').code,
            craName: wx.getStorageSync('user').name,
            productCode: arr[i].code,
            productName: arr[i].name,
            quantum: 1,
            unit: arr[i].unit,
            unitPrice: arr[i].cost,
          }
          that.data.productList.push(projectItem);
          that.setData({
            productList: that.data.productList
          })
        } else {
          that.data.productList.forEach((value, index, array) => {
            if (array[index].productCode == id)
              array.splice(index, 1);
            that.setData({
              productList: array
            })
          })
        }
      }
    })
  },
  // 修改数量
  numberChange({
    detail
  }) {
    this.setData({
      quantum: detail.value
    })
  },
  setNumber(event) {
    this.setData({
      [`productList[${event.target.id}].quantum`]: this.data.quantum
    })
  },
  getAllProduct() {
    var that = this;
    let page = {
      pageNo: '0',
    }
    app.toEncryption(page);
    wx.request({
      url: 'https://www.hyegm.com/cra/product/getList.do',
      data: page,
      method: 'POST',
      success: function(res) {
        console.log(res)
        res.data.result.forEach((v, i, arr) => {
          v.statues = '0';
        })
        let productArr = res.data.result;
        // productArr.unshift({ name: '全部', code: '325' });
        that.setData({
          chooseList: res.data.result,
          productTypeList: productArr
        })
      }
    })
  },
  handleMessage() {
    $Toast({
      content: '申请成功！',
      type: 'success',
      duration: 1
    });
  },
  javaMessage(mes) {
    $Toast({
      content: mes,
      type: 'error',
      duration: 1
    });
  },
  toApply() {
    var that = this;
    that.data.productList.forEach((v, i, arr) => {
      arr[i] = JSON.stringify(v);
    })
    let applyArr = {
      
      jsonArray: that.data.productList,
    }
    app.toEncryption(applyArr);
    wx.request({
      url: 'https://www.hyegm.com/cra/product/productApply.do',
      data: applyArr,
      method: 'POST',
      success: function(res) {
        if (res.data.code == '200') {
          that.saveNew(res.data.result)
          that.data.productList.length = 0;
          that.data.chooseList.forEach((v) => {
            v.statues = 0;
          })
          that.setData({
            productList: that.data.productList,
            chooseList: that.data.chooseList
          })
          that.handleMessage()
          that.setData({
            currentTab: '0',
            changeType: '0',
          })
          that.getApplyList('325', that.data.timeType);
        }
      }
    })
  },
  saveNew(num){
    var that = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前时间：" + Y + '年' + M + '月' + D + '日');
    that.today = Y + '-' + M + '-' + D
    console.log(that.today)
    let page = {
      batchCode:num,
      type:'6',
      craCode: wx.getStorageSync('user').code,
      craName:wx.getStorageSync('user').name,
      createTime:that.today
    }
    app.toEncryption(page);
    wx.request({
      url: 'https://www.hyegm.com/cra/news/saveNews.do',
      data: page,
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
  },
  // 全选
  allChange({
    detail = {}
  }) {
    this.setData({
      checked: detail.current
    });
  },
  // 记录时间筛选
  applyTimeChange: function(e) {
    this.setData({
      timeIndex: e.detail.value
    })
    switch (e.detail.value){
      case '0':
        this.setData({
          timeType: '1'
        })
        break;
      case '1':
        this.setData({
          timeType: '7'
        })
        break;
      case '2':
        this.setData({
          timeType: '10'
        })
        break;
    }
    this.getApplyList(this.data.nameCode, this.data.timeType)
  },
  // 记录名称筛选
  productNameChange: function(e) {
    this.setData({
      nameIndex: e.detail.value,
      nameCode: this.data.productTypeList[e.detail.value].code
    })
    this.getApplyList(this.data.nameCode, this.data.timeType)
  },
  getApplyList(code,time){
    var that = this;
    let page = {
      craCode: wx.getStorageSync('user').code,
      pageNo: '-1',
    }
    if (time!=='10'){
      page.type = time
    }
    if (code!=='325'){
      page.productCode = code
    }
    app.toEncryption(page);
    wx.request({
      url: 'https://www.hyegm.com/cra/product/getApplyList.do',
      data: page,
      method: 'POST',
      success: function (res) {
        if (res.data.code== '200'){
        res.data.result.forEach((v, i, arr) => {
          switch (v.status){
            case '0':
              v.tip = '督导审核中';
              break;
            case '1':
              v.tip = '物流部审核中';
              break;
            case '2':
              v.tip = '待发货';
              break;
            case '3':
              v.tip = '已发货';
              break;
            case '4':
              v.tip = '已签收';
              break;
          }
        })
        that.setData({
          recordList: res.data.result
          })
        }else{
          that.javaMessage(res.data.msg)
          that.data.recordList.length = 0;
          that.setData({
            recordList: that.data.recordList
          })
        }
      }
    })
  },
  saveNews() {
    var that = this;
    let news = {
      batchCode: that.data.orderNum,
      type: '6',
      craCode:wx.getStorageSync('user').code,
      craName: wx.getStorageSync('user').name,
    }
    app.toEncryption(news);
    wx.request({
      url: 'https://www.hyegm.com/cra/news/saveNews.do',
      data: news,
      method: 'POST',
      success: function (res) {
        console.log('消息', res)
      }
    })
  },
})
