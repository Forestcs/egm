var app = getApp();
const { $Message } = require("../../dist/base/index");
const { $Toast } = require("../../dist/base/index");
var util = require("../../utils/md5.js");
Page({
  data: {},

  onLoad: function(options) {
    if (wx.getStorageSync("user").code) {
      this.toHome();
    }
  },

  handleErro(mes) {
    $Message({
      content: mes,
      type: "error",
      duration: 2
    });
  },
  handleMessage(mes) {
    $Toast({
      content: mes,
      type: "success",
      duration: 2
    });
  },
  handleJavaErro(mes) {
    $Toast({
      content: mes,
      type: "error",
      duration: 2
    });
  },
  formSubmit: function(e) {
    var that = this;
    let v = e.detail.value;
    console.log("提交");
    if (v.loginName == "") {
      console.log("用户名不能为空");
      that.handleErro("用户名不能为空!");
    } else if (v.password == "") {
      console.log("密码不能为空");
      that.handleErro("密码不能为空!");
    } else {
      console.log("tologin");
      that.toLogin(v);
    }
  },
  toLogin(ob) {
    var that = this;
    let loginForm = {
      loginName: ob.loginName,
      pwd: ob.password
    };
    loginForm.pwd = util.md5(loginForm.pwd);
    app.toEncryption(loginForm);

    wx.request({
      url: `${require("../../utils/util").url}craftsman/login.do`,
      data: loginForm,
      method: "POST",
      success: function(res) {
        console.log(res);
        if (res.data.code == "200") {
          that.handleMessage("登录成功");
          wx.setStorageSync("user", res.data.result);
          that.toHome();
        } else {
          that.handleJavaErro(res.data.msg);
        }
      }
    });
  },
  toHome() {
    wx.switchTab({
      url: "../order/order"
    });
  }
});
