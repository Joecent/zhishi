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
    list: [],
    latitude:'',
    longitude:'',
    // cation: ['文化', '兴趣', '理工', '社科', '英语', '数学', '计算机', '社科', '数学', '理工'],
    cation: ['文学艺术', '科技商业', '教材教辅', '儿童读物', '技能爱好', '计算机', '外文书', '其他'],
    image_hide: false,
    currentItem: 0,
    none: true,
    inquirylist: [],
    companionship: [],
    loadall: true,
    page: 1,
    pageCount: 20,
    name: '文学艺术',
    load: false,
    scrollLeft: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onLoad()
    // this.onLoad()
    // this.setData({
    //   currentItem: 0,
    //   image_hide: false,
    //   scrollLeft: 0
    // })
  },
  /**
   * 点击查看附近的书友
   */
  bindcompanionship:function(e){
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
    limit: 15,
    page: 1,
    latitude:that.data.latitude,
    longitude:that.data.longitude
  }, function (response) {
    if (response.data.success == true) {
      that.setData({
        inquirylist: response.data.data,
        load: true
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
        that.data.latitude=res.latitude
        that.data.longitude=res.longitude
        setTimeout(function () {
          that.defaultonLoad()
        }, 1000)
      }
    })
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
  /**
   * 点击输入框搜索
   */
  bindsearch: function () {
    wx.navigateTo({
      url: '/pages/books/search/search'
    })
  },
  /**
   * getInquireList分页方法
   */
  getInquireList: function (page) {
    var that = this;
    request('book.search.cat', {
      name: that.data.name,
      limit: 15,
      page: page,
      latitude: that.data.latitude,
      longitude: that.data.longitude
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
   * 点击选择分类
   */
  bindcation:function(e){
    var that = this;
    if (e.currentTarget.dataset.index == 2){
      that.setData({
        scrollLeft: 180,
      })
    } else if (e.currentTarget.dataset.index == 4){
      that.setData({
        scrollLeft: 360,
      })
    }
    that.setData({
      inquirylist: [],
      page: 1,
      load: false
    })
    that.setData({
      image_hide: true,
      name: e.currentTarget.dataset.item
    })
    var index = e.currentTarget.dataset.index;
    that.setData({
      'currentItem': index
    })
    if (that.data.currentItem == 0){
      that.setData({
        image_hide: false,
      })
    }
    request('book.search.cat', {
      name: e.currentTarget.dataset.item,
      limit: 15,
      page: 1,
      latitude: that.data.latitude,
      longitude: that.data.longitude
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
   * 查看书籍详情
   */
  bindbookdetails:function(e){
    wx.navigateTo({
      url: '/pages/books/bookdetails/bookdetails?share_uuid=' + e.currentTarget.dataset.share_uuid + '&share_uid=' + e.currentTarget.dataset.share_uid
    })
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
   * 点击发布按钮
   */
  // bindrelease: function () {
  //   wx.navigateTo({
  //     url: '/pages/release/release/release'
  //   })
  // }
})
