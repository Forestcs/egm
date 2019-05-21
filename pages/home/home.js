// pages/home/home.js
var util = require('../../utils/md5.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    spinShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if (!wx.getStorageSync('user').code) {
    //   wx.redirectTo({
    //     url: '../../pages/login/login',
    //   })
    // } else {
    //   this.setData({
    //     userInfo: wx.getStorageSync('user'),
    //     spinShow: false
    //   })
    //   // 进行一次后台自动登录操作
    //   this.loginBackground();
    // }
  },

  // 后台自动登录验证
  // loginBackground() {

  //   let user = wx.getStorageSync('user');
  //   console.log('user:');
  //   console.log(user);

  //   let loginForm = {
  //     loginName: user.loginName,
  //     pwd: user.password,
  //   };
  //   app.toEncryption(loginForm);

  //   wx.request({
  //     url: `${require('../../utils/util').url}craftsman/login.do`,
  //     data: loginForm,
  //     method: 'POST',
  //     success: function(res) {
  //       if (res.data.code == '200') {
  //         // 登录成功，继续操作
  //         console.log('后台登录成功');
  //         wx.switchTab({
  //           url: '../../pages/order/order',
  //         })
  //       } else {
  //         // 登录失败，提示用户并进行重新登录
  //         console.log('后台自动登录失败');

  //         setTimeout(function() {
  //           wx.showModal({
  //             content: '您的账号存在异常，请重新登录',
  //           })
  //         }, 300)
  //         // 移除个人信息
  //         // wx.clearStorageSync('user');

  //         wx.redirectTo({
  //           url: '../../pages/login/login',
  //         })
  //       }
  //     }
  //   })
  // },

  onReady: function() {},

  onShow: function() {},
  toRouter(event) {
    switch (event.target.id) {
      case "1":
        wx.navigateTo({
          url: "../news/news"
        });
        break;
      case "2":
        wx.navigateTo({
          url: "../product/product"
        });
        break;
      case "3":
        wx.navigateTo({
          url: "../order/order"
        });
        break;
      case "4":
        wx.navigateTo({
          url: "../finance/finance"
        });
        break;
      case "5":
        wx.navigateTo({
          url: "../time/time"
        });
        break;
      case "6":
        wx.navigateTo({
          url: "../vacation/vacation"
        });
        break;
      case "7":
        wx.navigateTo({
          url: "../return/return"
        });
        break;
      case "8":
        wx.navigateTo({
          url: "../connection/connection"
        });
        break;
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {}
});
