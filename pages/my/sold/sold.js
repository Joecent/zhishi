// pages/my/sold/sold.js
const request = require('../../../utils/request');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    // timg: false,
    none: true,
    keywords: '',
    status: '',
    inquirylist: [],
    loadall: true,
    page: 1,
    pageCount: 5,
    winWidth:  0,
    winHeight: 0,
    currentTab:  0,
  },
  /**
   * getInquireList分页方法
   */
  getInquireList: function (page) {
    var that = this;
    if (that.data.currentTab == 0) {
      request('book.order.mySold', {
        status: 'not-post',
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
          var goods = 0;
          var datalist = that.data.inquirylist;
          for (var i = 0; i < datalist.length; i++) {
            var goodslist = datalist[i].goods;
            goods += goodslist.length
          }
          that.setData({
            winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
    } else if (that.data.currentTab == 1) {
      request('book.order.mySold', {
        status: 'not-receive',
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
          var goods = 0;
          var datalist = that.data.inquirylist;
          for (var i = 0; i < datalist.length; i++) {
            var goodslist = datalist[i].goods;
            goods += goodslist.length
          }
          that.setData({
            winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
    } else if (that.data.currentTab == 2) {
      request('book.order.mySold', {
        status: 'finish',
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
          var goods = 0;
          var datalist = that.data.inquirylist;
          for (var i = 0; i < datalist.length; i++) {
            var goodslist = datalist[i].goods;
            goods += goodslist.length
          }
          that.setData({
            winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
    } else if (that.data.currentTab == 3) {
      request('book.order.mySold', {
        status: 'refund',
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
          var goods = 0;
          var datalist = that.data.inquirylist;
          for (var i = 0; i < datalist.length; i++) {
            var goodslist = datalist[i].goods;
            goods += goodslist.length
          }
          that.setData({
            winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
  * 点击查看订单详情
  */
  bindlogistics: function (e) {
    wx.navigateTo({
      url: '/pages/mine/orderdetails/orderdetails?uuid=' + e.currentTarget.dataset.order_uuid
    })
  },
  /**
  * 点击取消订单
  */
  bindcancel:function(e){
    wx.redirectTo({
      url: '/pages/my/cancelcause/cancelcause?uuid=' + e.currentTarget.dataset.order_uuid
    })
  },
  /**
   * 待发货方法
   */
  notpay: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.setData({
      inquirylist: [],
      page: 1,
    })
    request('book.order.mySold', {
      status: 'not-post',
      page: 1,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          inquirylist: response.data.data
        })
        var goods = 0;
        var datalist = that.data.inquirylist;
        for (var i = 0; i < datalist.length; i++) {
          var goodslist = datalist[i].goods;
          goods += goodslist.length
        }
        that.setData({
          winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
   * 已发货方法
   */
  notreceive: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.setData({
      inquirylist: [],
      page: 1,
    })
    request('book.order.mySold', {
      status: 'not-receive',
      page: 1,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          inquirylist: response.data.data
        })
        var goods = 0;
        var datalist = that.data.inquirylist;
        for (var i = 0; i < datalist.length; i++) {
          var goodslist = datalist[i].goods;
          goods += goodslist.length
        }
        that.setData({
          winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
   * 已完成方法
   */
  finish: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.setData({
      inquirylist: [],
      page: 1,
    })
    request('book.order.mySold', {
      status: 'finish',
      page: 1,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          inquirylist: response.data.data
        })
        var goods = 0;
        var datalist = that.data.inquirylist;
        for (var i = 0; i < datalist.length; i++) {
          var goodslist = datalist[i].goods;
          goods += goodslist.length
        }
        that.setData({
          winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
   * 退款方法
   */
  refund: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.setData({
      inquirylist: [],
      page: 1,
    })
    request('book.order.mySold', {
      status: 'refund',
      page: 1,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          inquirylist: response.data.data
        })
        var goods = 0;
        var datalist = that.data.inquirylist;
        for (var i = 0; i < datalist.length; i++) {
          var goodslist = datalist[i].goods;
          goods += goodslist.length
        }
        that.setData({
          winHeight: goods * 119.4 + that.data.inquirylist.length * 52 + 40,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.notpay()
  },
  /**
   * 点击提醒发货
   */
  bindConsignment:function(e){
    var that = this;
    if (e.currentTarget.dataset.trade_mode == 'offline'){
      wx.showModal({
        title: '提示',
        content: '是否确认发货？',
        success: function (res) {
          if (res.confirm) {
            request('book.order.savePost', {
              order_uuid: e.currentTarget.dataset.order_uuid,
              exp_number: '',
              exp_code: ''
            }, function (response) {
              if (response.data.success == true) {
                wx.showLoading({
                  title: response.data.msg,
                })
                setTimeout(function () {
                  wx.hideLoading()
                  that.setData({
                    currentTab: 1,
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
          } else if (res.cancel) {

          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/my/shipment/shipment?uuid=' + e.currentTarget.dataset.order_uuid
      })
    }
  },
  /**
   * 点击同意退款
   */
  bindagreerefund: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否同意退款？',
      success: function (res) {
        if (res.confirm) {
          request('book.refund.solve', {
            order_uuid: e.currentTarget.dataset.order_uuid,
            reply: 'approve'
          }, function (response) {
            if (response.data.success == true) {
              wx.showLoading({
                title: response.data.msg,
              })
              setTimeout(function () {
                wx.hideLoading()
                wx.switchTab({
                  url: '/pages/books/index/index'
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
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 点击拒绝退款
   */
  bindrefuserefund: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否拒绝退款？',
      success: function (res) {
        if (res.confirm) {
          request('book.refund.solve', {
            order_uuid: e.currentTarget.dataset.order_uuid,
            reply: 'reject'
          }, function (response) {
            if (response.data.success == true) {
              wx.showLoading({
                title: response.data.msg,
              })
              setTimeout(function () {
                wx.hideLoading()
                wx.switchTab({
                  url: '/pages/books/index/index'
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
        } else if (res.cancel) {

        }
      }
    })
  },
  /** 
   * 滑动切换tab 
    */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (that.data.currentTab == 0) {
      that.notpay()
    } else if (that.data.currentTab == 1) {
      that.notreceive()
    } else if (that.data.currentTab == 2) {
      that.finish()
    } else if (that.data.currentTab == 3) {
      that.refund()
    }
  },
  /** 
   * 点击tab切换 
    */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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
        status: that.data.status,
        page: that.data.page + 1
      });
    } else if (that.data.page = that.data.pageCount) {
      that.setData({
        loadall: false,
        // timg: true,
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})