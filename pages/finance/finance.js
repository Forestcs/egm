// pages/finance/finance.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    financeData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getFinance();
  },

  getFinance() {
    var that = this;
    let page = {
      loginName: wx.getStorageSync('user').loginName,
    }
    app.toEncryption(page);
    wx.request({
      url: 'https://www.hyegm.com/cra/finance/findFinance.do',
      // url: 'http://192.168.1.48:8080/finance/findFinance.do',
      data: page,
      method: 'POST',
      success: function (res) {
        if(res.data.code == '200'){
          that.setData({
            financeData: res.data.result
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
