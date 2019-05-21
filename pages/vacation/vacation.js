const app = getApp()
const {
  $Toast
} = require('../../dist/base/index');
const {
  $Message
} = require('../../dist/base/index');

Page({

  data: {
    clientHeight: '0',
    currentTab: '0',
    typeIndex: '0',
    applyTypeIndex: '0',
    typeList: ['全部', '事假', '病假', '婚假', '年假'],
    leaveList: [],
    indexType: '0',
    applyIndexType: '0',
    typeArray: [{
      name: '事假',
      type: '0'
    }, {
      name: '病假',
      type: '1'
    }, {
      name: '婚假',
      type: '2'
    }, {
      name: '年假',
      type: '3'
    }],
    startDate: '',
    startDatePick: '',
    endDatePick: '',
    startTime: [0, 0],
    startTimeArray: [
      ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
      ['00', '30']
    ], //二维数组，长度是多少是几列,
    startHourIndex: '0',
    startMinuteIndex: '0',
    startHour: '10',
    startMinute: '00',
    endDate: '',
    endTime: [0, 0],
    endTimeArray: [
      ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
      ['00', '30']
    ], //二维数组，长度是多少是几列,
    endHourIndex: '0',
    endMinuteIndex: '0',
    endHour: '10',
    endMinute: '00',
    textarea: '未说明事由'
  },

  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    that.getLeaveList();
    that.getServiceTime();
  },
  // tab
  handleChange({
    detail
  }) {
    this.setData({
      currentTab: detail.key,
    });
  },
  // 请假类型筛选
  typeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
    this.getLeaveList(e.detail.value)
  },
  applyTypeChange: function (e) {
    this.setData({
      applyTypeIndex: e.detail.value
    })
  },
  // 休假记录
  getLeaveList(num) {
    var that = this;
    let page = {
      craCode: wx.getStorageSync('user').code,
      pageNo: '-1'
    }
    if (num) {
      page.type = num - 1;
    }
    app.toEncryption(page);
    wx.request({
      url: `${require('../../utils/util').url}craftsman/getList.do`,
      data: page,
      method: 'POST',
      success: function(res) {
        if (res.data.result) {
          res.data.result.forEach((v) => {
            switch (v.type) {
              case '0':
                v.leaveType = '事假';
                break;
              case '1':
                v.leaveType = '病假';
                break;
              case '2':
                v.leaveType = '婚假';
                break;
              case '3':
                v.leaveType = '年假';
                break;
            }
            switch (v.status) {
              case '0':
                v.leaveStatus = '店长审批中';
                break;
              case '1':
                v.leaveStatus = '总部审批中';
                break;
              case '2':
                v.leaveStatus = '已通过';
                break;
              case '3':
                v.leaveStatus = '已拒绝';
                break;
            }
          })
          that.setData({
            leaveList: res.data.result
          })
        } else {
          that.setData({
            leaveList: []
          })
          // that.handleWarning();
        }
      }
    })
  },
  handleWarning() {
    $Message({
      content: '暂时没有休假记录',
      type: 'warning'
    })
  },
  // 我要休假
  startDateChange: function(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  startTimeChange: function(e) {
    let arrHour = e.detail.value[0],
      minuteHour = e.detail.value[1],
      arr1 = this.data.startTimeArray[0],
      arr2 = this.data.startTimeArray[1]
    this.setData({
      startTime: e.detail.value,
      startHourIndex: e.detail.value[0],
      startMinuteIndex: e.detail.value[1],
      startHour: arr1[arrHour],
      startMinute: arr2[minuteHour],
    })
  },
  // startTimeColumnChange: function (e) {
  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  // },
  endDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  endTimeChange: function(e) {
    let arrHour = e.detail.value[0],
      minuteHour = e.detail.value[1],
      arr1 = this.data.endTimeArray[0],
      arr2 = this.data.endTimeArray[1]
    this.setData({
      endTime: e.detail.value,
      endHourIndex: e.detail.value[0],
      endMinuteIndex: e.detail.value[1],
      endHour: arr1[arrHour],
      endMinute: arr2[minuteHour],
    })
  },
  bindTextAreaBlur: function(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  Appendzero(obj) {
    if (obj < 10) return "0" + "" + obj;
    else return obj;
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
          startDatePick: startDate,
          startDate: startDate,
          endDate: startDate,
          endDatePick: end
        })
      }
    })
  },
  toLeaveApply() {
    var that = this;
    that.data.startDate = that.data.startDate.replace(/\//g, '-')
    that.data.endDate = that.data.endDate.replace(/\//g, '-')
    let startTime = that.data.startDate + ' ' + that.data.startHour + ':' + that.data.startMinute + ':00';
    let endTime = that.data.endDate + ' ' + that.data.endHour + ':' + that.data.endMinute + ':00';
    let d1 = new Date(startTime);
    let d2 = new Date(endTime);

    if (d1 < d2) {
      let page = {
        craCode: wx.getStorageSync('user').code,
        craName: wx.getStorageSync('user').name,
        beginTime: startTime,
        endTime: endTime,
        'type': that.data.indexType.toString(),
        cause: that.data.textarea
      }
      app.toEncryption(page);

      wx.request({
        url: `${require('../../utils/util').url}craftsman/leaveApply.do`,
        data: page,
        method: 'POST',
        success: function(res) {
          console.log(res)
          if (res.data.code == '200') {
            that.saveNews(res.data.result);
            that.handleSuccess()
          } else {
            that.handleError(res.data.msg)
          }
        }
      })
    } else if (d1 > d2) {
      that.handleError('开始时间大于结束时间');
    }
  },
  handleSuccess() {
    $Toast({
      content: '休假申请已发送~',
      type: 'success'
    });
  },
  handleError(msg) {
    $Toast({
      content: msg,
      type: 'error'
    });
  },
  // handleError() {
  //   $Message({
  //     content: '结束时间大于开始时间！',
  //     type: 'error'
  //   });
  // },
  onShow: function() {

  },
  saveNews(num) {
    var that = this;
    let news = {
      type: '1',
      leaveId:num,
      craCode: wx.getStorageSync('user').code,
      craName: wx.getStorageSync('user').name,
      beginTime: that.data.startDate + ' ' + that.data.startHour + ':' + that.data.startMinute,
      endTime: that.data.endDate + ' ' + that.data.endHour + ':' + that.data.endMinute,
      hType: that.data.typeArray[that.data.applyTypeIndex].name
    }
    app.toEncryption(news);
    wx.request({
      url: `${require('../../utils/util').url}news/saveNews.do`,
      data: news,
      method: 'POST',
      success: function (res) {
        console.log('消息', res)
      }
    })
  },
})
