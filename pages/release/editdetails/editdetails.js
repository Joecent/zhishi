// pages/release/editdetails/editdetails.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    describelist: ['九成新', '八成新', '有标注', '无标注'],
    labellist: ['文学艺术', '科技商业', '教材教辅', '儿童读物', '技能爱好', '计算机', '外文书', '其他'],
    gifttuijian: '(推荐)',
    describe: '',
    label: '',
    bid: '',
    list: {},
    init_price: '',
    recommend_price: '',
    newsoursedescribe: [],
    newsourselabel: [],
    latitude: '',
    longitude: '',
    exp_strategy: '',
    miles: '',
    freeshipsh: '',
    freeshipzq: '',
  },
  /**
   * 点击描述
   */
  binddescribe: function (e) {
    var that = this;
    that.data.newsoursedescribe.push('#' + e.currentTarget.dataset.item)
    that.setData({
      describe: that.data.newsoursedescribe.toString().replace(/,/g, '')
    })
  },
  /**
   * 输入售价
   */
  bindprice: function () {
    var that = this;
    that.setData({
      gifttuijian: ''
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
  * 点击赠送
  */
  bindgift: function () {
    var that = this;
    that.setData({
      recommend_price: '0.01',
      gifttuijian: '(赠送)'
    })
  },
  /**
   * 点击填写卖书规则
   */
  bindrule: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/release/rule/rule'
    })
  },
  /**
   * 点击标签
   */
  bindlabel: function (e) {
    var that = this;
    // that.data.newsourselabel.push(e.currentTarget.dataset.item + ' | ')
    that.setData({
      // label: that.data.newsourselabel.join('')
      label: e.currentTarget.dataset.item
    })
    var index = e.currentTarget.dataset.index;
    that.setData({
      'currentItem': index
    })
  },
  /**
   * 输入标签
   */
  bindlabelinput: function (e) {
    var that = this;
    that.setData({
      newsourselabel: e.detail.value.split(" \\| "),
    })
  },
  /**
  * 点击放弃发布
  */
  bindfangqi: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 点击确认卖书
   */
  formSubmit: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.price == "") {
      warn = "售价不能为空！";
    } else if (e.detail.value.price < 0.01) {
      warn = "售价必须大于或等于0.01";
    } else if (e.detail.value.number == "") {
      warn = "数量不能为空";
    } else if (e.detail.value.number < 1) {
      warn = "数量必须大于等于1";
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
      request('book.post.edit', {
        bid: that.data.list.bid,
        real_price: e.detail.value.price * 100,
        stock: e.detail.value.number,
        tags: e.detail.value.label,
        description: e.detail.value.describe,
        remark: e.detail.value.shelfnumber,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
      }, function (response) {
        if (response.data.success == true) {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.navigateBack({
              delta: 2
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
      share_uuid: options.uuid
    })
    request('book.post.detail', {
      uuid: that.data.share_uuid
    }, function (response) {
      if (response.data.success == true) {
        var label = response.data.data.tags;
        var index = '';
        var labellist = that.data.labellist;
        for (var i = 0; i < labellist.length; i++) {
          if (labellist[i] == label) {
            index = i;
            break;
          }
        }
        that.setData({
          list: response.data.data,
          init_price: response.data.data.init_price,
          recommend_price: response.data.data.real_price,
          describe: response.data.data.description,
          label: response.data.data.tags,
          'currentItem': index
        })
        if (that.data.recommend_price == 0.01){
          that.setData({
            gifttuijian: '(赠送)'
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
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
    that.rule()
  },
  /**
   * 卖书规则
   */
  rule: function () {
    var that = this;
    request('user.info.preview', {

    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          exp_strategy: response.data.data.userinfo.exp_strategy,
          miles: response.data.data.userinfo.free_radius,
          freeshipsh: response.data.data.userinfo.free_amount,
          freeshipzq: response.data.data.userinfo.free_amount,
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
    this.rule()
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