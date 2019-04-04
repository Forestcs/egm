// pages/me/connection/connection-order/connection-order.js
const app = getApp();
const {
  $Message
} = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    array: ['昨天', '最近2周', '最近3个月'],
    index: 0,
    timeData: '',
    personList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList('tab1')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  getList(tab) {
    var that = this;
    let timeObj = {
      loginName: wx.getStorageSync("user").loginName,
    };
    switch (tab) {
      case 'tab1':
        timeObj.type = '1';
        break;
      case 'tab2':
        timeObj.type = '2';
        break;
      case 'tab3':
        timeObj.type = '3';
        break;
    }
    app.toEncryption(timeObj);
    wx.request({
      url: 'https://www.hyegm.com/cra/craftsman/getPeople.do',
      data: timeObj,
      method: 'POST',
      success: function(res) {
        // debugger
        if (res.data.code == '18') {
          that.setData({
            personList: []
          })
          // that.handleWarning();
        } else {
          that.setData({
            personList: that.data.personList.concat(res.data.result)
          })
        }
      }
    })
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
    this.data.personList.length = 0;
    switch (detail.key) {
      case 'tab1':
        this.getList(detail.key);
        break;
      case 'tab2':
        this.getList(detail.key);
        break;
      case 'tab3':
        this.getList(detail.key);
        break;
    }
  },
  toConnectionDetail(event) {
    wx.navigateTo({
      url: '../connection-detail/connection-detail?id=' + event.currentTarget.id,
    })
  },
  handleWarning() {
    $Message({
      content: '暂时没有信息',
      type: 'warning',
      duration: 1
    });
  },
})
