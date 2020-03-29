// pages/my/published/published.js
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
    pageCount: 5,
    name:'',
    keywords: ''
  },
  /**
   * 点击编辑已发布详情
   */
  bindbookdetails: function (e) {
    wx.navigateTo({
      url: '/pages/release/editdetails/editdetails?uuid=' + e.currentTarget.dataset.uuid
    })
  },
  /**
   * 点击输入框搜索
   */
  searchitemInput: function (e) {
    var that = this;
    that.setData({
      inquirylist: [],
      page: 1,
    })
    if (e.detail.value == '') {
      request('book.post', {
        limit: 5,
        page: 1,
      }, function (response) {
        if (response.data.success == true) {
          that.setData({
            inquirylist: response.data.data,
            name: ''
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
    } else {
      request('book.post.search', {
        name: e.detail.value,
        limit: 5,
        page: 1,
      }, function (response) {
        if (response.data.success == true) {
          that.setData({
            inquirylist: response.data.data
          })
          that.setData({
            name: e.detail.value
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
    }
  },
  /**
   * 点击取消分享
   */
  bindcancelshare:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否取消分享？',
      success: function (res) {
        if (res.confirm) {
          request('book.post.delete', {
            share_uuid: e.currentTarget.dataset.uuid
          }, function (response) {
            if (response.data.success == true) {
              wx.showLoading({
                title: response.data.msg,
              })
              setTimeout(function () {
                wx.hideLoading()
                that.onShow()
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
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * getInquireList分页方法
   */
  getInquireList: function (page) {
    var that = this;
    if (that.data.name == '') {
      request('book.post', {
        page: page,
        limit: 5
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
    } else {
      request('book.post.search', {
        name: that.data.name,
        page: page,
        limit: 5
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      inquirylist: [],
      page: 1,
      keywords: ''
    })
    request('book.post', {
      page: 1,
      limit: 5
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
            loadall: false
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
    this.onLoad()
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
        page: that.data.page + 1,
        limit: 5
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