//app.js
var util = require('utils/md5.js')
var aes = require('utils/aes.js')
//十六位十六进制数作为秘钥
var key = aes.CryptoJS.enc.Utf8.parse('2017082817430823');
//十六位十六进制数作为秘钥偏移量
var iv = aes.CryptoJS.enc.Utf8.parse('3280347182807102');

App({
  onLaunch: function () {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.os = res.system;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // if (res.authSetting['scope.userInfo']) {
        //   // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //   wx.getUserInfo({
        //     success: res => {
        //       // 可以将 res 发送给后台解码出 unionId
        //       this.globalData.userInfo = res.userInfo

        //       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //       // 所以此处加入 callback 以防止这种情况
        //       if (this.userInfoReadyCallback) {
        //         this.userInfoReadyCallback(res)
        //       }
        //     }
        //   })
        // }
      }
    })
  },

  globalData: {
    userInfo: null,
    os:''
  },
  // aes加密
  Encrypt: function (word) {
    var srcs = aes.CryptoJS.enc.Utf8.parse(word);
    var encrypted = aes.CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: aes.CryptoJS.mode.CBC,
      padding: aes.CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  // 对象属性按字母排序
  objKeySort(obj) {
    var newkey = Object.keys(obj).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
      newObj[newkey[i]] = obj[newkey[i]];
    }
    // obj = newObj
    return newObj;
  },
  // MD5+key加密处理对象
  toEncryption(obj) {
    let that = this;
    let mdData = '';
    let sortObject = this.objKeySort(obj);
    for (let x in sortObject) {
      mdData = mdData + x + "=" + sortObject[x] + '&';
    }
    mdData = mdData + 'key=E02353AF68EBE70D507EB8BF362460B5';
    // console.log('md5', mdData),
    obj.sign = util.md5(mdData);
    // console.log('md5加密完', obj.sign)
    let listDataString = JSON.stringify(obj);
    obj.arguments = that.Encrypt(listDataString);
    let listDataJson = JSON.stringify(obj);
    return listDataJson;
  },
})