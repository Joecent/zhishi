// pages/books/companionshipbooks/companionshipbooks.js
const request = require('../../../utils/request');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    none: true,
    keywords: '',
    inquirylist: [],
    loadall: true,
    page: 1,
    pageCount: 10,
    uid: '',
    sellerInfo: '',
    mername: '',
    avatar_url: '',
    gender: '',
    name: ''
  },
  /**
   * 点击列表详情 
   */
  bindbookdetails: function (e) {
    wx.navigateTo({
      url: '/pages/books/bookdetails/bookdetails?share_uuid=' + e.currentTarget.dataset.share_uuid + '&share_uid=' + e.currentTarget.dataset.share_uid
    })
  },
  /**
   * 点击发布按钮
   */
  bindscancode: function () {
    // 允许从相机和相册扫码
    var that = this;
    wx.scanCode({
      success: (res) => {
        request('user.info.preview', {

        }, function (response) {
          if (response.data.success == true) {
            var userinfo = response.data.data.userinfo
            if (userinfo.address == '{}' || userinfo.address == '[]' || userinfo.type == '') {
              wx.showLoading({
                title: '请完善个人信息',
              })
              setTimeout(function () {
                wx.hideLoading()
                wx.redirectTo({
                  url: '/pages/my/personal/personal'
                })
              }, 1000)
            } else {
              request('book.post.info', {
                isbn: res.result
              }, function (response) {
                if (response.data.success == true) {
                  if (response.data.data == '') {
                    wx.showLoading({
                      title: '请填写书籍详情',
                    })
                    setTimeout(function () {
                      wx.hideLoading()
                      wx.redirectTo({
                        url: '/pages/release/adddetails/adddetails?isbn=' + res.result
                      })
                    }, 500)
                  } else {
                    wx.redirectTo({
                      url: '/pages/release/details/details?bid=' + response.data.data.id
                    })
                  }
                  wx.setStorage({
                    key: "releasebookdetails",
                    data: response.data.data
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
    if (e.detail.value == ''){
      request('user.shop', {
        uid: that.data.uid,
        limit: 10,
        page: 1,
      }, function (response) {
        if (response.data.success == true) {
          that.setData({
            inquirylist: response.data.data,
            keywords: ''
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
    }else{
      request('user.shop.search', {
        keywords: e.detail.value,
        uid: that.data.uid,
        limit: 10,
        page: 1,
      }, function (response) {
        if (response.data.success == true) {
          that.setData({
            inquirylist: response.data.data
          })
          that.setData({
            keywords: e.detail.value
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
   * getInquireList分页方法
   */
  getInquireList: function (page) {
    var that = this;
    console.log('131', that.data.keywords)
    if (that.data.keywords == ''){
      request('user.shop', {
        uid: that.data.uid,
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
    }else{
      request('user.shop.search', {
        keywords: that.data.keywords,
        uid: that.data.uid,
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.gender == 'male'){
      that.setData({
        mername: '他的书架'
      })
    } else if (options.gender == 'female'){
      that.setData({
        mername: '她的书架'
      })
    } else {
      that.setData({
        mername: 'TA的书架'
      })
    }
    wx.setNavigationBarTitle({
      title: that.data.mername//页面标题为路由参数
    })
    that.setData({
      uid: options.uid,
      inquirylist: [],
      page: 1,
    })
    request('user.info.preview', {

    }, function (response) {
      if (response.data.success == true) {
        var userinfo = response.data.data.userinfo
        that.setData({
          avatar_url: userinfo.avatar_url,
          gender: userinfo.gender,
          name: userinfo.name,
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
    request('user.shop.sellerInfo', {
      uid: that.data.uid,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          sellerInfo: response.data.data
        })
        var userinfo = response.data.data
        if (userinfo.avatar_url == that.data.avatar_url && userinfo.gender == that.data.gender && userinfo.name == that.data.name){
          that.setData({
            mername: '我的书架'
          })
          wx.setNavigationBarTitle({
            title: that.data.mername//页面标题为路由参数
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
    request('user.shop', {
      uid: that.data.uid,
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
        uid: that.data.uid,
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