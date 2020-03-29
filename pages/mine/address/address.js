// pages/mine/address/address.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },
  /**
   * 点击设为默认
   */
  bindradioChange:function(e){
    var that = this;
    request('user.info.setDefaultAddress', {
      key: e.currentTarget.dataset.index
    }, function (response) {
      if (response.data.success == true) {
        wx.showLoading({
          title: response.data.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        that.onShow()
        wx.navigateBack({
          delta: 1
        })
        wx.setStorage({
          key: "editaddress",
          data: e.currentTarget.dataset
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
   * 点击设为默认
   */
  radioChange: function (e) {
    var that = this;
    request('user.info.setDefaultAddress', {
      key: e.currentTarget.dataset.index
    }, function (response) {
      if (response.data.success == true) {
        wx.showLoading({
          title: response.data.msg,
        })
        setTimeout(function () {
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
        that.onShow()
        wx.setStorage({
          key: "editaddress",
          data: e.currentTarget.dataset
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
   * 选择地址
   */
  bindaddreeChange: function (e) {
    wx.navigateBack({
      delta: 1
    })
    wx.setStorage({
      key: "editaddress",
      data: e.currentTarget.dataset
    })
  },
  /**
   * 添加新地址
   */
  bindaddnewaddress:function(){
    wx.navigateTo({
      url: '/pages/mine/aadaddress/aadaddress'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    request('user.info.address', {
      
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
   * 点击删除收货地址
   */
  binddelete:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除此收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          request('user.info.deleteAddress', {
            key: e.currentTarget.dataset.index
          }, function (response) {
            if (response.data.success == true) {
              wx.showLoading({
                title: response.data.msg,
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
              that.onShow()
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
   * 点击编辑收货地址
   */
  bindedit:function(e){
    wx.navigateTo({
      url: '/pages/mine/edit/edit'
    })
    wx.setStorage({
      key: "editaddress",
      data: e.currentTarget.dataset
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})