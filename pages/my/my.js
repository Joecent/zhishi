// pages/my/my.js
const request = require('../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    avatarUrl: '',
    name: '',
    gender: '',
    preview: ''
  },
  /**
   * 点击已发布
   */
  bindpublished:function(){
    wx.navigateTo({
      url: '/pages/my/published/published'
    })
  },
  bindalreadysold:function(){
    wx.navigateTo({
      url: '/pages/my/sold/sold'
    })
  },
  /**
   * 点击已买到
   */
  bindalreadybought:function(){
    wx.navigateTo({
      url: '/pages/my/alreadybought/alreadybought'
    })
  },
  /**
   * 点击发布按钮
   */
  // bindrelease: function () {
  //   wx.navigateTo({
  //     url: '/pages/release/release/release'
  //   })
  // },
  /**
   * 点击余额
   */
  bindbalance:function(){
    wx.navigateTo({
      url: '/pages/my/balance/balance'
    })
  },
  /**
   * 点击密码设置
   */
  bindsetup:function(){
    wx.navigateTo({
      url: '/pages/my/modifysetup/modifysetup'
    })
  },
  /**
   * 点击交易须知
   */
  bindabout:function(){
    wx.navigateTo({
      url: '/pages/my/about/about'
    })
  },
  /**
   * 点击查看并编辑资料
   */
  bindpersonal: function () {
    wx.navigateTo({
      url: '/pages/my/personal/personal'
    })
    wx.removeStorage({
      key: 'schoolname',
      success: function (res) {
        
      }
    })
  },
  bindeditcart:function(){
    wx.navigateTo({
      url: '/pages/mine/cart/cart'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          name: res.data.nickName,
          avatarUrl: res.data.avatarUrl,
          gender: res.data.gender
        })
      }
    })
    request('user.info.preview', {

    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          preview: response.data.data,
        })
        if (that.data.preview.userinfo.avatar_url == '' || that.data.preview.userinfo.gender == 'secret') {
          request('user.info.update', {
            avatar_url: that.data.avatarUrl,
            gender: that.data.gender,
          }, function (response) {
            if (response.data.success == true) {

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