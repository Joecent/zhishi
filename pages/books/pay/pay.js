// pages/books/pay/pay.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  bindsubmit:function(){
    var that = this;
    let order = {
      "8": [
        {
          uuid: '2DED0C73-AD59-60BE-6054-E2AAD719B52E', 
          count: 1
        }
      ],
      "2927": [
        {
          uuid: 'E7141DCC-E41A-0D93-E33A-1889043CC82F',
          count: 1
        },
        {
          uuid: '5AC41210-2FC2-E300-B118-A91B4C1BD167',
          count: 2
        }
      ]
    };
    request('book.order.create', {
      phone: 15189433673,
      address: "上海市闵行区",
      order: JSON.stringify(order)
    }, function (response) {
      if (response.data.success == true) {
        wx.requestPayment({
          'timeStamp': '',
          'nonceStr': '',
          'package': '',
          'signType': 'MD5',
          'paySign': '',
          'success': function (res) {
            console.log("1111")
          },
          'fail': function (res) {
            console.log("2222")
          }
        })
      } else {

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