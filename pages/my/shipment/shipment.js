// pages/my/shipment/shipment.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid: '',
    details: {},
    courier: '',
    array: ['中通快递', '圆通', '申通', '百世汇通', '韵达', '顺丰', '宅急送', '德邦', '全峰', '中铁快运', '天天', 'EMS', '如风达', '京东快递'],
    objectArray: [
      {
        id: 1,
        name: '中通快递',
        code: 'zhongtong'
      },
      {
        id: 3,
        name: '圆通',
        code: 'yuantong'
      },
      {
        id: 4,
        name: '申通',
        code: 'shentong'
      },
      {
        id: 5,
        name: '百世汇通',
        code: 'huitong'
      },
      {
        id: 6,
        name: '韵达',
        code: 'yunda'
      },
      {
        id: 7,
        name: '顺丰',
        code: 'shunfeng'
      },
      {
        id: 8,
        name: '宅急送',
        code: 'zjs'
      },
      {
        id: 9,
        name: '德邦',
        code: 'debang'
      },
      {
        id: 10,
        name: '全峰',
        code: 'quanfeng'
      },
      {
        id: 11,
        name: '中铁快运',
        code: 'zhongtie'
      },
      {
        id: 12,
        name: '天天',
        code: 'tiantian'
      },
      {
        id: 13,
        name: 'EMS',
        code: 'ems'
      },
      {
        id: 17,
        name: '如风达',
        code: 'rufengda'
      },
      {
        id: 18,
        name: '京东快递',
        code: 'jingdong'
      }
    ],
    code: '',
    index: 0,
  },
  /**
   * 选择物流公司
   */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
    })
  },
  /**
   * 点击差号删除当前内容
   */
  binddeletecourier: function (e) {
    this.setData({
      courier: ''
    })
  },
  /**
   * 点击扫快递单号
   */
  bindscancode:function(){
    // 允许从相机和相册扫码
    var that = this;
    wx.scanCode({
      success: (res) => {    
        that.setData({
          courier: res.result
        })
      }
    })
  },
  /**
    * 点击保存个人信息
    */
  formSubmit: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.courier == "") {
      warn = "快递单号不能为空";
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
      request('book.order.savePost', {
        order_uuid: that.data.uuid,
        exp_number: e.detail.value.courier,
        exp_code: e.detail.value.code
      }, function (response) {
        if (response.data.success == true) {
          wx.showLoading({
            title: response.data.msg,
          })
          setTimeout(function () {
            wx.hideLoading()
            wx.switchTab({
              url: '/pages/books/index/index'
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
      uuid: options.uuid
    })
    request('book.order.receiver', {
      order_uuid: that.data.uuid
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          details: response.data.receiver
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