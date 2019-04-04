// pages/home/home.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: '',
        spinShow: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (!wx.getStorageSync('user').code) {
            wx.redirectTo({
                url: '../../pages/login/login',
            })
        } else {
            this.setData({
                userInfo: wx.getStorageSync('user'),
                spinShow: false
            })
        }
    },
    onReady: function() {},

    onShow: function() {},
    toRouter(event) {
        switch (event.target.id) {
            case '1':
                wx.navigateTo({
                    url: '../news/news',
                });
                break;
            case '2':
                wx.navigateTo({
                    url: '../product/product',
                });
                break;
            case '3':
                wx.navigateTo({
                    url: '../order/order',
                });
                break;
            case '4':
                wx.navigateTo({
                    url: '../finance/finance',
                });
                break;
            case '5':
                wx.navigateTo({
                    url: '../time/time',
                });
                break;
            case '6':
                wx.navigateTo({
                    url: '../vacation/vacation',
                });
                break;
            case '7':
                wx.navigateTo({
                    url: '../return/return',
                });
                break;
            case '8':
                wx.navigateTo({
                    url: '../connection/connection',
                });
                break;
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

})