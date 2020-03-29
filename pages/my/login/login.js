// pages/my/login/login.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '',
    openid: '',
  },
  /**
   * 输入手机号
   */
  bindtel: function (e) {
    var that = this;
    that.setData({
      tel: e.detail.value
    })
  },
  /**
   * 点击忘记密码
   */
  bindforget:function(){
    wx.navigateTo({
      url: '/pages/my/forgotpassword/forgotpassword'
    })
  },
  /**
   * 点击立即注册
   */
  bindregister: function () {
    wx.navigateTo({
      url: '/pages/bindphone/bindphone'
    })
  },
  /**
   * 绑定手机号
   */
  formSubmit: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.phone == "") {
      warn = "手机号不能为空！";
    } else if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(e.detail.value.phone))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.password == "") {
      warn = "密码不能为空";
    } else if (!(/^[a-zA-Z0-9]{6,32}$/.test(e.detail.value.password))) {
      warn = "请输入6-32位数字、字母组合密码";
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
      request('user.auth.login', {
        uid: e.detail.value.phone,
        password: e.detail.value.password,
        openid: that.data.openid
      }, function (response) {
        if (response.data.success == true) {
          wx.setStorageSync('Auth-Apikey', response.data.apikey)
          wx.setStorageSync('Auth-Token', response.data.token)
          wx.showLoading({
            title: '登录成功',
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.switchTab({
              url: '/pages/books/index/index'
            })
          }, 1000)
        } else if (response.data.error_code == 3) {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.navigateTo({
              url: '/pages/bindphone/bindphone'
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
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        });
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

  },
})
