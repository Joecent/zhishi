// pages/mine/orderdetails/orderdetails.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid: '',
    details: {},
    list: [],
    customer_addr: '',
    seller_addr: '',
    ishide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      uuid: options.uuid
    })
    request('book.order.detail', {
      uuid: that.data.uuid
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          details: response.data.data,
          list: response.data.data.goods,
          customer_addr: response.data.data.customer_addr,
          seller_addr: response.data.data.seller_addr,
        })
        if (that.data.seller_addr == undefined){
          that.setData({
            ishide: true
          })
        }else{
          that.setData({
            ishide: false
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
   * 点击查看物流详情
   */
  bindlooklogistics: function (e) {
    wx.navigateTo({
      url: '/pages/mine/looklogistics/looklogistics?uuid=' + e.currentTarget.dataset.uuid
    })
  },
  /**
   * 拨打手机号码
   */
  bindmakePhoneCall: function (e) {
    wx.showModal({
      title: '点击电话拨打',
      content: e.currentTarget.dataset.phone ,
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone 
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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