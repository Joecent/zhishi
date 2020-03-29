// pages/my/cancelcause/cancelcause.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    describelist: ['非常抱歉', '库存填错了', '我有点不想卖了', '书已经送给朋友了', '搬家时书被处理了', '你会原谅我的对嘛~'],
    describe: '',
    order_uuid: '',
    newsoursedescribe: [],
  },
  /**
   * 点击描述
   */
  binddescribe: function (e) {
    var that = this;
    that.data.newsoursedescribe.push(e.currentTarget.dataset.item)
    that.setData({
      describe: that.data.newsoursedescribe
    })
  },
  /**
   * 输入描述
   */
  binddescribeinput: function (e) {
    var that = this;
    that.setData({
      newsoursedescribe: e.detail.value.split(","),
    })
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
   * 点击确认
   */
  formSubmit: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.describe == "") {
      warn = "原因不能为空！";
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
      request('book.order.cancel', {
        order_uuid: that.data.order_uuid,
        reason: e.detail.value.describe
      }, function (response) {
        if (response.data.success == true) {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.redirectTo({
              url: '/pages/my/sold/sold'
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
    that.setData({
      order_uuid: options.uuid
    })
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