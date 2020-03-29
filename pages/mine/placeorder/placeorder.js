// pages/mine/placeorder/placeorder.js
const request = require('../../../utils/request');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 1,  
    sharers: {},
    totalPrice: 0.00,
    totalPrice_express: 0.00,
    express: 0.00,
    union_uuid: '',
    editaddress: '',
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    share_uuid: '',
    share_uid: ''
  },
  //计算合计方法
  totalPrice_express: function (e) {
    var that = this;
    that.setData({
      totalPrice_express: (that.data.count * that.data.sharers.real_price + that.data.express).toFixed(2)
    });
  },
  //计算商品总额方法
  totalPrice: function (e) {
    var that = this;
    that.setData({
      totalPrice: (that.data.count * that.data.sharers.real_price).toFixed(2)
    }); 
  },
  //输入数量
  importCount: function (e) {
    var that = this;
    var count = e.detail.value; 
    that.setData({
      count: count
    });
    if (that.data.count > that.data.sharers.stock) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      that.setData({
        count: that.data.sharers.stock,
      });
    }
    that.totalPrice()
    that.totalPrice_express()
    that.editaddress()
  },
  //减少数量
  importCountjian:function(e){
    var that = this;
    var count = that.data.count; 
    if (count > 1)  {
      count--;
    } 
    that.setData({
      count: count,
    });  
    that.totalPrice()
    that.totalPrice_express()
    that.editaddress()
  },
  //增加数量
  importCountjia: function (e) {
    var that = this;
    var count = that.data.count;
    count++;
    that.setData({
      count: count,
    });  
    if (that.data.count > that.data.sharers.stock) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      that.setData({
        count: that.data.sharers.stock,
      });
    }
    that.totalPrice()
    that.totalPrice_express()
    that.editaddress()
  },
  /**
   * 修改收货地址
   */
  bindmodifyaddress:function(){
    wx.navigateTo({
      url: '/pages/mine/address/address'
    })
  },
  /**
   * 点击提交订单
   */
  formSubmit: function (e) {
    var that = this;
    wx.getStorage({
      key: 'placeorder',
      success: function (res) {
        that.setData({
          sharers: res.data[0]
        })
        var uid = that.data.share_uid
        let order = {};
        order[uid] = [{
          uuid: that.data.share_uuid,
          count: that.data.count
        }];
        let receiver = {};
        receiver = {
          addr: that.data.editaddress.addr,
          city: that.data.editaddress.city,
          phone: that.data.editaddress.phone,
          detail: that.data.editaddress.detail,
          latitude: that.data.editaddress.latitude,
          province: that.data.editaddress.province,
          receiver: that.data.editaddress.receiver,
          longitude: that.data.editaddress.longitude,
        };
        if (that.data.editaddress == ''){
          wx.showLoading({
            title: '请选择或添加收货地址',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }else{
          request('book.order.create', {
            receiver: JSON.stringify(receiver),
            order: JSON.stringify(order)
          }, function (response) {
            if (response.data.success == true) {
              that.setData({
                union_uuid: response.data.order_detail.union_uuid
              })
              that.orderpay()
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
      }
    })
    that.editaddress()
  },
  /**
   * 支付
   */
  orderpay:function(){
    var that = this;
    request('book.order.pay', {
      union_uuid: that.data.union_uuid,
      paytype: 'wxpay',
      gateway: 'miniapp',
      detail: 'test'
    }, function (response) {
      if (response.data.success == true) {
        console.log(response.data,'4984156165')
        wx.requestPayment({
          'appId': response.data.pay_params.appId,
          'timeStamp': response.data.pay_params.timeStamp + '',
          'nonceStr': response.data.pay_params.nonceStr,
          'package': response.data.pay_params.package,
          'signType': response.data.pay_params.signType,
          'paySign': response.data.pay_params.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '/pages/my/alreadybought/alreadybought'
            })
          },
          'fail': function (res) {
          }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.onShow()
    wx.getStorage({
      key: 'placeorder',
      success: function (res) {
        that.setData({
          sharers: res.data[0],
          share_uuid: res.data[1],
          share_uid: res.data[2],
        })
        that.totalPrice_express()
        that.totalPrice()
      }
    })
    if (that.data.editaddress == ''){
      request('user.info.preview', {

      }, function (response) {
        if (response.data.success == true) {
          if (response.data.data.userinfo.address == '{}' || response.data.data.userinfo.address == '[]') {
            wx.showLoading({
              title: '请选择或添加收货地址',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
          } else {
            that.setData({
              editaddress: response.data.data.userinfo.address.detail
            })
            wx.setStorage({
              key: "editaddress",
              data: that.data.editaddress
            })
            that.editaddressjs()
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
    }else{

    }
    that.editaddress()
  },
  /**
   * 计算物流接口
   */
  editaddressjs: function () {
    var that = this;
    let sellers = {};
    let seller_id = that.data.share_uid;
    // sellers[seller_id] = that.data.count;
    sellers[seller_id] = {
      total_cost: that.data.totalPrice * 100,
      count: that.data.count
    };
    request('book.order.expFee', {
      city: that.data.editaddress.city,
      latitude: that.data.editaddress.latitude,
      longitude: that.data.editaddress.longitude,
      sellers: JSON.stringify(sellers)
    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          express: parseFloat(response.data.data[seller_id]),
        })
        that.totalPrice_express()
        that.totalPrice()
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
   * 请求物流接口
   */
  editaddress: function () {
    var that = this;
    wx.getStorage({
      key: 'editaddress',
      success: function (res) {
        that.setData({
          editaddress: res.data,
        })
        that.setData({
          province: res.data.province,
        })
        that.setData({
          city: res.data.city,
        })
        if (that.data.editaddress !== '') {
          let sellers = {};
          let seller_id = that.data.share_uid;
          // sellers[seller_id] = that.data.count;
          sellers[seller_id] = {
            total_cost: that.data.totalPrice * 100,
            count: that.data.count
          };
          request('book.order.expFee', {
            city: that.data.city,
            latitude: that.data.editaddress.latitude,
            longitude: that.data.editaddress.longitude,
            sellers: JSON.stringify(sellers)
          }, function (response) {
            if (response.data.success == true) {
              that.setData({
                express: parseFloat(response.data.data[seller_id]),                
              })
              that.totalPrice_express()
              that.totalPrice()
            } else {
              wx.showLoading({
                title: response.data.msg,
              })
              setTimeout(function () {
                wx.hideLoading()
              }, 1000)
            }
          });
        } else {

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