// pages/books/search/search.js
const request = require('../../../utils/request');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    none: true,
    keywords: '',
    inquirylist: [],
    loadall: true,
    page: 1,
    pageCount: 5,
  },
  /**
   * 点击列表详情 
   */
  bindschoolname: function (e) {
    wx.navigateBack({
      delta: 1
    })
    wx.setStorage({
      key: "schoolname",
      data: e.currentTarget.dataset
    })
  },
  /**
   * 点击输入框搜索
   */
  searchitemInput: function (e){
    var that = this;
    that.setData({
      inquirylist: [],
      page: 1,
    })
    request('book.search.univ', {
      name: e.detail.value,
      page: 1
    }, function (response) {
      if (response.data.success == true){
        that.setData({
          inquirylist: response.data.data
        })
        that.setData({
          keywords: e.detail.value
        })
        if (that.data.inquirylist.length == 0){
          that.setData({
            none: false
          })
          that.setData({
            loadall: true
          })
        }else{
          that.setData({
            none: true
          })
          that.setData({
            loadall: false
          });
        }
      }else{
        that.setData({
          none: true
        })
        // wx.showLoading({
        //   title: response.data.msg,
        // })
        // setTimeout(function () {
        //   wx.hideLoading()
        // }, 1000)
      }
    });
  },
  /**
   * getInquireList分页方法
   */
  getInquireList: function (page) {
    var that = this;
    request('book.search.univ', {
      keywords: that.data.keywords,
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
        
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
      none: true
    });
    if (that.data.page < that.data.pageCount) {
      that.getInquireList(that.data.page + 1);
      that.setData({
        keywords: that.data.keywords,
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