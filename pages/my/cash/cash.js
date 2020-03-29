// pages/my/cash/cash.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '微信', value: '微信', checked: 'true' },
    ],
    preview: '',
    disabled:false
  },
  /**
   * 选中微信
   */
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    request('user.info.preview', {

    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          preview: response.data.data,
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
   * 点击确认提现
   */
  formSubmit:function(){
    request('user.money.regain1',{},function(response){
      wx.showLoading({
        title: response,
      })
      setTimeout(function(){
        wx.hideLoading()
      },4000)
    })
  },
  // formSubmit: function (e) {
  //   var that = this;
  //   that.setData({
  //     disabled: true
  //   })
  //   var warn = "";//弹框时提示的内容
  //   var flag = true;//判断信息输入是否完整
  //   if (e.detail.value.cash == "") {
  //     warn = "提现金额不能为空";
  //   } else {
  //     flag = false;
  //   }
  //   if (flag == true) {
  //     wx.showLoading({
  //       title: warn,
  //     })
  //     setTimeout(function () {
  //       wx.hideLoading()
  //     }, 2000)
  //   } else {
  //     request('user.money.regain', {
  //       paytype: 'wxpay',
  //       amount: e.detail.value.cash * 100
  //     }, function (response) {
  //       if (response.data.success == true) {
  //         wx.showLoading({
  //           title: response.data.msg,
  //         })
  //         setTimeout(function () {
  //           wx.hideLoading()
  //           wx.navigateBack({
  //             delta: 2
  //           })
  //         }, 1000)
  //       } else {
  //         wx.showLoading({
  //           title: response.data.msg,
  //         })
  //         setTimeout(function () {
  //           wx.hideLoading()
  //           that.setData({
  //             disabled: false
  //           })
  //         }, 1000)
  //       }
  //     });
  //   }
  // },
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