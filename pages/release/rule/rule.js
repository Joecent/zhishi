// pages/release/rule/rule.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: false,
    nostudent: true,
    items: [
      { name: '送书上门+快递', value: '送书上门+快递', checked: 'true' },
      { name: '自取+快递', value: '自取+快递' },
    ],
    miles: '3',
    freeshipsh: '68',
    freeshipzq: '68',
    freeship: '',
    exp_strategy: '1',
  },
  /**
   * 点击返回
   */
  bindfangqi: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 选择送书上门+快递或者自取+快递
   */
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == '送书上门+快递') {
      this.setData({
        student: false,
        nostudent: true,
        exp_strategy: 1,
        miles: '3',
        freeshipsh: '68',
      })
    } else {
      this.setData({
        student: true,
        nostudent: false,
        exp_strategy: 2,
        miles: '',
        freeshipzq: '68',
      })
    }
  },
  /**
    * 点击确认卖书规则
    */
  formSubmit: function (e) {
    var that = this;
    if (that.data.exp_strategy == '1'){
      that.setData({
        freeship: e.detail.value.freeshipsh
      })
    } else if (that.data.exp_strategy == '2'){
      that.setData({
        freeship: e.detail.value.freeshipzq
      })
    }
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.miles == "" && that.data.exp_strategy == '1') {
      warn = "距离不能为空";
    } else if (e.detail.value.freeshipsh == "" && that.data.exp_strategy == '1') {
      warn = "满包邮不能为空";
    } else if (e.detail.value.freeshipzq == "" && that.data.exp_strategy == '2') {
      warn = "满包邮不能为空";
    } else {
      flag = false;
    }
    if (flag == true) {
      wx.showLoading({
        title: warn,
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    } else {
      request('user.info.update', {
        free_radius: e.detail.value.miles,
        free_amount: that.data.freeship * 100,
        exp_strategy: that.data.exp_strategy
      }, function (response) {
        if (response.data.success == true) {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    request('user.info.preview', {
      
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          exp_strategy: response.data.data.userinfo.exp_strategy,
          miles: response.data.data.userinfo.free_radius,
        })
        if (response.data.data.userinfo.exp_strategy == 1) {
          that.setData({
            items: [
              { name: '送书上门+快递', value: '送书上门+快递', checked: 'true' },
              { name: '自取+快递', value: '自取+快递' },
            ],
            freeshipsh: response.data.data.userinfo.free_amount,
            student: false,
            nostudent: true,
          })
        } else {
          that.setData({
            items: [
              { name: '送书上门+快递', value: '送书上门+快递'},
              { name: '自取+快递', value: '自取+快递', checked: 'true' },
            ],
            freeshipzq: response.data.data.userinfo.free_amount,
            student: true,
            nostudent: false
          })
        }
      } else {
        wx.showLoading({
          title: response.data.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})