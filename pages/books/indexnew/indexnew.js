//index.js
//获取应用实例
const request = require('../../../utils/request');

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/images/index/banner1.jpg',
      '/images/index/banner2.jpg',
      '/images/index/banner3.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    image_hide: false,
    none: true,
    companionship: [],
    loadall: true,
    load: false,
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    list: [],
    inquirylist: [],
    cation: ['文学艺术', '科技商业', '教材教辅', '儿童读物', '技能爱好', '计算机', '外文书', '其他'],
    name: '文学艺术',
    page: 1,
    pageCount: 20,
  },
  /**
   * 点击查看附近的书友
   */
  bindcompanionship: function (e) {
    wx.navigateTo({
      url: '/pages/books/companionship/companionship'
    })
  },
  /**
   * 默认第一次加载
   */
  defaultonLoad: function () {
    var that = this;
    request('book.search.cat', {
      name: '文学艺术',
      limit: 10,
      page: 1
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          inquirylist: response.data.data,
          load: true
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
   * 加载附近的书友
   */
  companionship: function () {
    var that = this;
    request('book.search.nearbyFriend', {
      limit: 10,
      page: 1,
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          companionship: response.data.data
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
  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      inquirylist: [],
      page: 1,
      load: false,
      none: true,
      name: that.data.cation[e.detail.current],
    });
    if (e.detail.current == 0){
      that.setData({
        image_hide: false,
      });
    }else{
      that.setData({
        image_hide: true,
      });
    }
    that.checkCor();
    that.switchload()
    // setTimeout(function () {
    //   that.switchload()
    // }, 1000)
  },
  // 滚动切换加载数据
  switchload:function(){
    var that = this;
    request('book.search.cat', {
    name: that.data.name,
    limit: 10,
    page: 1
  }, function (response) {
    if (response.data.success == true) {
      that.setData({
        inquirylist: response.data.data,
        name: that.data.name,
        load: true
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
      wx.showLoading({
        title: response.data.msg,
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    }
  });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var that = this;
    var cur = e.target.dataset.current;
    if (that.data.currentTaB == cur) { return false; }
    else {
      that.setData({
        currentTab: cur,
        page: 1
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    var that = this;
    if (that.data.currentTab > 2) {
      that.setData({
        scrollLeft: 300
      })
    } else {
      that.setData({
        scrollLeft: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.setData({
      inquirylist: [],
      page: 1,
      load: false
    })
    // 获取用户定位
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.setStorage({
          key: "latitudelongitude",
          data: res
        })
        setTimeout(function () {
          that.defaultonLoad()
          that.companionship()
        }, 1000)
      }
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 166;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  /**
   * 下拉加载方法
   */
  moviePageScroll: function (event) {
    var that = this;
    that.setData({
      none: true,
      loadall: true
    });
    if (that.data.page < that.data.pageCount) {
      that.getInquireList(that.data.page + 1);
      that.setData({
        name: that.data.name,
        limit: 15,
        page: that.data.page + 1
      });
    } else if (that.data.page = that.data.pageCount) {
      that.setData({
        loadall: false
      });
    }
  },
  /**
   * getInquireList分页方法
   */
  getInquireList: function (page) {
    var that = this;
    request('book.search.cat', {
      name: that.data.name,
      limit: 15,
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
   * 点击输入框搜索
   */
  bindsearch: function () {
    wx.navigateTo({
      url: '/pages/books/search/search'
    })
  },
  /**
   * 查看书籍详情
   */
  bindbookdetails: function (e) {
    wx.navigateTo({
      url: '/pages/books/bookdetails/bookdetails?share_uuid=' + e.currentTarget.dataset.share_uuid + '&share_uid=' + e.currentTarget.dataset.share_uid
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
})
