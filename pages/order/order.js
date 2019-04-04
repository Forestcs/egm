// pages/order/order.js
const app = getApp();
const {
  $Message
} = require('../../dist/base/index');

Page({
  data: {
    currentTab: '0',
    orderList: [],
    pageNumber: 1, // 页码
  },

  onLoad: function(options) {

  },

  onShow: function() {
    // 页码
    this.data.pageNumber = 1;
    this.setData({
      orderList: []
    })

    this.getOrderList();
  },

  // tab
  handleChange({
    detail
  }) {
    this.setData({
      currentTab: detail.key,
    });

    // 重置页码和列表数据
    this.data.pageNumber = 1;
    this.setData({
      orderList: []
    })

    this.getOrderList(detail.key);
  },

  // 上拉加载
  onReachBottom: function() {

    this.getOrderList(this.data.currentTab, true);
  },

  getOrderList(num, loadMore) {
    var that = this;
    let user = {
      craId: wx.getStorageSync('user').id.toString(),
      pageNo: this.data.pageNumber
    }
    if (num) {
      switch (num) {
        case '1':
          user.status = 'WAITSERVICE';
          break;
        case '2':
          user.status = 'FINISH';
          break;
      }
    }
    app.toEncryption(user);
    wx.request({
      url: 'https://www.hyegm.com/cra/order/getList.do',
      data: user,
      method: 'POST',
      success: function(res) {
        if (res.data.code == '200') {
          res.data.result.forEach(function(e, index) {
            switch (e.status) {
              case 'CLOSED':
                e.statusCode = '1'
                e.status = '已关闭'
                // 已关闭
                break;
              case 'NOTPAY':
                e.statusCode = '2'
                e.status = '未支付'
                // 未支付
                break;
              case 'WAITSERVICE':
                e.statusCode = '3'
                e.status = '待服务'
                // 待服务
                break;
              case 'SERVICE':
                e.statusCode = '4'
                e.status = '服务中'
                // 服务中
                break;
              case 'ASSESS':
                e.statusCode = '5'
                e.status = '待评价'
                // 待评价
                break;
              case 'FINISH':
                e.statusCode = '6'
                e.status = '已完成'
                // 已完成
                break;
              case 'REFUNDING':
                e.statusCode = '7'
                e.status = '退款中'
                // 退款中
                break;
              case 'REFUND':
                e.statusCode = '8 '
                e.status = '已退款'
                // 已退款
                break;
              case 'PAYERROR':
                e.statusCode = '9'
                e.status = '支付失败'
                // 支付失败
                break;
            }
          });

          let newDataList = that.data.orderList.concat(res.data.result);
          that.setData({
            orderList: newDataList,
          })
          that.data.pageNumber = that.data.pageNumber + 1;

          console.log(res.data.result);
          
        } else {
          if (loadMore == true) {
            // 无更多数据
            wx.showToast({
              title: '无更多数据',
              icon: 'none',
              duration: 1000
            })
          }
        }
      }
    })
  },

  handleWarning() {
    $Message({
      content: '暂时没有订单',
      type: 'warning',
      duration: 1
    });
  },
  toOrderDetail(event) {
    wx.navigateTo({
      url: 'orderDetail/orderDetail?id=' + event.currentTarget.id,
    })
  },
  // 改变订单状态
  toConfirm(x) {
    let that = this;
    let user = {
      order: that.data.orderDetail.orderNum,
      // tradeState: 'ASSESS'
    }
    app.toEncryption(user);
    wx.request({
      url: 'https://www.hyegm.com/cra/order/updateByOrderNum.do',
      data: user,
      method: 'POST',
      success: function(res) {
        that.toEvaluate();
      }
    })
  },
  onReady: function() {

  }
})