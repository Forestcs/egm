// pages/time/time.js
const { $Toast } = require('../../dist/base/index');


var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startDate: '',
        date: '',
        endDate: '',
        timeList: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
      
    },
    // 获取当前时间
    getServiceTime() {
        var that = this;
        let time = {
            pageNo: '1'
        }
        app.toEncryption(time);
        wx.request({
            url: `${require('../../utils/util').url}times/getTime.do`,
            data: time,
            method: 'POST',
            success: function(res) {
                let now = res.data.result;
                if (app.globalData.os.slice(0, 2) == 'iO') {
                    var startDate = now.substr(0, 10);
                    startDate = startDate.replace(/-/g, '/');
                } else {
                    var startDate = now.substr(0, 10);
                }
                let endNow = new Date(res.data.result);
                endNow.setFullYear(endNow.getFullYear() + 1);
                if (app.globalData.os.slice(0, 2) == 'iO') {
                    var end = endNow.getFullYear() + '-' + that.Appendzero((endNow.getMonth() + 1)) + '-' + that.Appendzero(endNow.getDate());
                } else {
                    var end = endNow.getFullYear() + '-' + that.Appendzero((endNow.getMonth() + 1)) + '-' + that.Appendzero(endNow.getDate());
                }
                that.setData({
                    startDate: startDate,
                    date: startDate,
                    endDate: end
                })
                that.getDayTime();
            }
        })
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
        this.getDayTime();
    },
    Appendzero(obj) {
        if (obj < 10) return "0" + "" + obj;
        else return obj;
    },
    getDayTime() {
        var that = this;
        that.data.date = that.data.date.replace(/\//g, '-');
        let time = {
            code: wx.getStorageSync('user').code,
            dates: that.data.date
        }
        app.toEncryption(time);
        wx.request({
            url: `${require('../../utils/util').url}craftsman/getListByDates.do`,
            data: time,
            method: 'POST',
            success: function(res) {
                if (res.data.code == '200') {
                    that.setData({
                        timeList: res.data.result[0]
                    })
                  // that.handleError(res.data.msg)
                }else{
                  that.handleError(res.data.msg)
                }
            }
        })
    },
  handleError(msg) {
    $Toast({
      content: msg,
      type: 'error'
    });
  },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getServiceTime();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
})
