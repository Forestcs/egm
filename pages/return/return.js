// pages/return/return.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnObj:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReturnList();
  },

  getReturnList() {
    var that = this;
    let time = {
      craCode: wx.getStorageSync('user').code,
    }
    app.toEncryption(time);
    wx.request({
      url: `${require('../../utils/util').url}craftsman/getReturnRate.do`,
      data: time,
      method: 'POST',
      success: function (res) {
        if (res.data.code == '200') {
          // res.data.result.returnRateOne = res.data.result.returnRateOne;
          // res.data.result.returnRateTwo = res.data.result.returnRateTwo;
          // res.data.result.returnRateThree = res.data.result.returnRateThree;
          that.setData({
            returnObj: res.data.result
          })
        } else if (!res.data.result) {
          that.setData({
            returnObj: { returnRateOne: '0', returnRateTwo: '0', returnRateThree:'0'}
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
