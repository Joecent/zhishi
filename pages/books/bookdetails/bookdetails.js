// pages/books/bookdetails/bookdetails.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    other_share: [],
    list: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    share_uuid: '',
    share_uid: '',
    introductionmore: '',
    morenone: ''
  },
  /**
   * 点击列表详情 
   */
  bindbookdetails: function (e) {
    wx.redirectTo({
      url: '/pages/books/bookdetails/bookdetails?share_uuid=' + e.currentTarget.dataset.share_uuid + '&share_uid=' + e.currentTarget.dataset.share_uid
    })
  },
  /**
   * 点击首页
   */
  bindindex:function(){
    wx.switchTab({
      url: '/pages/books/index/index'
    })
  },
  /**
   * 点击购物车
   */
  bindcart:function(){
    wx.redirectTo({
      url: '/pages/mine/cart/cart'
    })
  },
  /**
   * 点击查看更多
   */
  bindintroductionmore:function(){
    var that = this;
    that.setData({
      introductionmore: 'introductionmore',
      morenone: 'morenone'
    })
  },
  /**
   * 点击加入购物车
   */
  bindjoincart:function(e){
    var that = this;
    request('user.cart.add', {
      share_uuid: that.data.share_uuid,
    }, function (response) {
      if (response.data.success == true) {
        wx.showLoading({
          title: response.data.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
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
  },
  /**
   * 点击立即购买
   */
  bindbuy:function(e){
    var that = this;
    wx.redirectTo({
      url: '/pages/mine/placeorder/placeorder'
    })
    wx.setStorage({
      key: "placeorder",
      data: [
        that.data.detail, 
        that.data.share_uuid,
        that.data.share_uid,
      ]
    })
    wx.removeStorage({
      key: 'editaddress',
      success: function (res) {

      }
    })
  },
  /**
   * 评价
   */
  bindevaluate: function (e) {
    wx.navigateTo({
      url: '/pages/books/evaluate/evaluate?share_uid=' + e.currentTarget.dataset.share_uid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      share_uuid: options.share_uuid,
      share_uid: options.share_uid
    })
    request('book.preview.detail', {
      share_uuid: that.data.share_uuid
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          detail: response.data.data
        })
      } else {
        wx.showLoading({
          title: response.data.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    });
    request('book.preview.otherShare', {
      share_uuid: that.data.share_uuid,
      share_uid: that.data.share_uid,
      limit: 20,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          other_share: response.data.data
        })
      } else {
        wx.showLoading({
          title: response.data.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    });
    request('book.preview.comment', {
      share_uid: that.data.share_uid,
      limit: 3,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          list: response.data.data
        })
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