// pages/books/companionship/companionship.js
const request = require('../../../utils/request');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    none: true,
    inquirylist: [],
    loadall: true,
    page: 1,
    pageCount: 10,
  },
  /**
   * 点击列表详情 
   */
  bindbookdetails: function (e) {
    wx.redirectTo({
      url: '/pages/books/companionshipbooks/companionshipbooks?uid=' + e.currentTarget.dataset.uid + '&gender=' + e.currentTarget.dataset.gender
    })
  },
  /**
   * getInquireList分页方法
   */
  getInquireList: function (page) {
    var that = this;
    request('book.search.nearbyFriend', {
      limit: 10,
      page: page
    }, function (response) {
      if (response.data.success == true) {
        var list = response.data.data;
        var olist = that.data.inquirylist;
        for (var i = 0; i < list.length; i++) {
          olist.push(list[i]);
        }
        that.setData({
          inquirylist: olist,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      inquirylist: [],
      page: 1,
    })
    request('book.search.nearbyFriend', {
      limit: 10,
      page: 1,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          inquirylist: response.data.data
        })
        if (that.data.inquirylist.length == 0) {
          that.setData({
            none: false,
            loadall: true
          })
        } else {
          that.setData({
            none: true,
            loadall: true
          })
        }
      } else {
        that.setData({
          none: true
        })
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
    var that = this;
    that.setData({
      none: true,
      loadall: true
    });
    if (that.data.page < that.data.pageCount) {
      that.getInquireList(that.data.page + 1);
      that.setData({
        limit: 10,
        page: that.data.page + 1
      });
    } else if (that.data.page = that.data.pageCount) {
      that.setData({
        loadall: false
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})