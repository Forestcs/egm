var app= getApp();
Page({

  data: {
    arrayType: ['订单消息', '请假消息', '产品消息'],
    arrayTime: ['今天', '最近7天', '全部'],
    typeIndex:'0',
    timeIndex:'0',
    newsList:[]
  },

  onLoad: function (options) {
    this.getNewsList()
  },
  getNewsList() {
    var that = this;
    let time = {
      craCode: wx.getStorageSync('user').code,
      // craCode:11,
      type: that.data.typeIndex,
      pageNo:'-1'
    }
    if (that.data.timeIndex=='0'){
      time.typeForTime='1'
    } else if (that.data.timeIndex == '1'){
      time.typeForTime = '7'
    }
    app.toEncryption(time);
    wx.request({
      url: 'https://www.hyegm.com/cra/news/getList.do',
      data: time,
      method: 'POST',
      success: function (res) {
        // debugger
        if (res.data.code == '200') {
          res.data.result.forEach((v)=>{
              switch(v.type){
                case '0':
                v.status = '订单';
                break;
                case '1':
                  v.status = '请假';
                  break;
                case '2':
                  v.status = '产品';
                  break;
              }
          })
          that.setData({
            newsList: res.data.result
          })
        } else if (!res.data.result){
          that.setData({
            newsList: []
          })
        }
      }
    })
  },

  onShow: function () {

  },
  typeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
    this.getNewsList()
  },
  timeChange: function (e) {
    this.setData({
      timeIndex: e.detail.value
    })
    this.getNewsList()
  },
  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },
})
