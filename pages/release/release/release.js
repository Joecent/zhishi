// pages/release/release/release.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**
   * 点击书籍上门回收
   */
  bindrecovery:function(){
    wx.navigateTo({
      url: '/pages/release/recovery/recovery'
    })
  },
  /**
   * 点击扫条形码分享
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
                wx.navigateTo({
                  url: '/pages/my/personal/personal'
                })
              }, 1000)
            }else{
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
                      wx.navigateTo({
                        url: '/pages/release/adddetails/adddetails?isbn=' + res.result
                      })
                    }, 500)
                  } else {
                    wx.navigateTo({
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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