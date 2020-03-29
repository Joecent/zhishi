// pages/my/codelogin/codelogin.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    tel: '',
    second: 60,
    selected: false,
    selected1: true,
    avatar_url: ''
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
  bindwxsqdl: function (e) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            wx.setStorage({
              key: "userInfo",
              data: userInfo, nickName, avatarUrl, gender
            })
            // 下面开始调用注册接口
            request('user.auth.wxOAuth2Login', {
              code: code
            }, function (response) {
              if (response.data.success == true) {
                wx.setStorageSync('Auth-Apikey', response.data.apikey)
                wx.setStorageSync('Auth-Token', response.data.token)
                wx.showLoading({
                  title: "微信授权成功",
                })
                setTimeout(function () {
                  wx.hideLoading()
                  wx.switchTab({
                    url: '/pages/books/index/index'
                  })
                }, 1000)
              } else if (response.data.error_code == 2) {
                wx.setStorage({
                  key: "openid",
                  data: response.data.openid
                })
              } else {

              }
            });
          },
          fail: function (res) {

          }
        })
      }
    });
  },
  /**
   * 获取验证码
   */
  bindphone: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (that.data.tel == "") {
      warn = "手机号不能为空！";
    } else if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(that.data.tel))) {
      warn = "手机号格式不正确";
    } else {
      flag = false;
      that.setData({
        selected: true,
        selected1: false,
      });
      countdown(this);
    }
    if (flag == true) {
      wx.showLoading({
        title: warn,
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    } else {
      request('user.auth.sendCode', {
        phone: that.data.tel,
        template_id: 'SMS_62840211'
      }, function (response) {
        if (response.data.success == true) {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
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
   * 点击账密登录
   */
  bindlogin: function () {
    wx.navigateTo({
      url: '/pages/my/login/login'
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
    } else if (e.detail.value.sendcode == "") {
      warn = "验证码不能为空";
    } else if (!(/^\d{6}$/.test(e.detail.value.sendcode))) {
      warn = "验证码格式不正确";
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
      request('user.auth.smscodeLogin', {
        phone: e.detail.value.phone,
        code: e.detail.value.sendcode,
        openid: that.data.openid,
        avatar_url: that.data.avatar_url,
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
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          avatar_url: res.data.avatarUrl,
        })
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
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000)
}