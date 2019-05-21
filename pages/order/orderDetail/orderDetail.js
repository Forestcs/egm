// pages/me/order/orderDetail/orderDetail.js
const { $Toast } = require('../../../dist/base/index');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    projectName: '',
    orderDetail: '',
    orderNum: '',
    payTime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDetail(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getDetail(num) {
    let that = this;
    let user = {
      orderNum: num,
    }
    app.toEncryption(user);
    wx.request({
        url: `${require('../../utils/util').url}order/orderDetail.do`,
      data: user,
      method: 'POST',
      success: function(res) {
        if (res.data.result.addressType == '0') {
          res.data.result.addressType = '到店服务'
        } else {
          res.data.result.addressType = '上门服务'
        };
        switch (res.data.result.status) {
          case 'NOTPAY':
            res.data.result.status = 0;
            break;
          case 'WAITSERVICE':
            res.data.result.status = 1;
            break;
          case 'SERVICE':
            res.data.result.status = 2;
            break;
          case 'CLOSED':
            res.data.result.status = 3;
            break;
          case 'FINISH':
            res.data.result.status = 4;
            break;
          case 'ASSESS':
            res.data.result.status = 5;
            break;
        }
        that.setData({
          orderDetail: res.data.result,
          id: res.data.result.projectId,
          projectName: res.data.result.projectName,
          craId: res.data.result.craId,
          craName: res.data.result.craName,
          orderNum: res.data.result.orderNum,
        })
      }
    })
  },
  toConfirm(event) {
    // debugger
    let that = this;
    let user = {
      order: that.data.orderDetail.orderNum,
      tradeState: 'ASSESS'
    }
    switch (event.currentTarget.id){
      case '1':
        user.tradeState ='SERVICE';
        break;
      case '2':
        user.tradeState = 'ASSESS';
        break;
      case '5':
        user.tradeState = 'FINISH';
        break;
    }
    app.toEncryption(user);
    wx.request({
      url: `${require('../../utils/util').url}order/updateByOrderNum.do`,
      data: user,
      method: 'POST',
      success: function(res) {
        console.log(res)
        if(res.data.code== '200'){
          that.getDetail(that.data.orderNum)
          that.handleSuccess(res.data.msg);
          // setTimeout(that.toOrder(), 1300);
        }else{
          that.handleSuccess(res.data.msg)
        }
      }
    })
  },
  handleSuccess(msg) {
    $Toast({
      content: msg,
      type: 'success',
      duration: 1,
    });
  },
  toOrder() {
    wx.navigateTo({
      url: '../order'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
