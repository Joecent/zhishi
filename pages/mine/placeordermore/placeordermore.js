// pages/mine/placeordermore/placeordermore.js
const request = require('../../../utils/request');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 1,
    list: [],
    // sharers: {},
    totalPriceunit: [],
    totalPrice_express: [],
    express: 0.00,
    expresstotal: 0.00,
    union_uuid: '',
    editaddress: '',
    allPrice: 0,
    province: '',
    city: '',
    inputPrice: true,
    expresslist: []
  },
  //计算合计方法
  totalPrice_express: function (e) {
    var that = this;
    var list = this.data.list;
    var totalPrice_express = []
    for (var i = 0; i < list.length; i++) {
      totalPrice_express.push((list[i].count * list[i].real_price).toFixed(2))
      // list[i].express_fee
      that.setData({
        totalPrice_express: totalPrice_express + this.data.expresstotal
      });
    }
  },
  //计算商品总额方法
  totalPriceunit: function (e) {
    var that = this;
    var list = this.data.list;
    var totalPriceunit = []
    for (var i = 0; i < list.length; i++) {
      totalPriceunit.push((list[i].count * list[i].real_price).toFixed(2))
      that.setData({
        totalPriceunit: totalPriceunit
      });
    }
  },
  //计算总价方法
  totalPrice: function () {
    var list = this.data.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.real_price == "") {
        curItem.real_price = 0;
      } else {
        curItem.real_price = curItem.real_price;
      }
      if (curItem.active) {
        total += parseFloat(curItem.real_price) * curItem.count;
      }
    }
    total = parseFloat(total + this.data.expresstotal).toFixed(2);//js浮点计算bug，取两位小数精度
    return total;
  },
  //输入数量
  importCount: function (e) {
    var that = this;
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    addlist[index].count = e.detail.value;
    this.totalPriceunit()
    this.totalPrice_express()
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
    that.editaddress()
  },
  //点击减少数量
  importCountjian: function (e) {
    var that = this;
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    var count = addlist[index].count;
    if (count > 1) {
      count--;
    }
    addlist[index].count = count
    this.setData({
      count: count,
      list: addlist,
    })
    this.totalPriceunit()
    this.totalPrice_express()
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
    that.editaddress()
  },
  //点击增加数量
  importCountjia: function (e) {
    var that = this;
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    var count = addlist[index].count;
    count++;
    addlist[index].count = count
    this.setData({
      count: count,
      list: addlist,
    })
    this.totalPriceunit()
    this.totalPrice_express()
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
    that.editaddress()
  },
  /**
   * 修改收货地址
   */
  bindmodifyaddress: function () {
    wx.navigateTo({
      url: '/pages/mine/address/address'
    })
  },
  /**
   * 点击提交订单
   */
  formSubmit: function (e) {
    var that = this;
    var itemlist = that.data.list
    let order = {};
    for (var i = 0; i < itemlist.length; i++) {
      if (itemlist[i].active == true) {
        let item = itemlist[i];
        let book = {
          uuid: item['share_uuid'],
          count: item['count']
        };
        if (order[item['seller']] === undefined)
          order[item['seller']] = [book];
        else
          order[item['seller']].push(book);
      }
    }
    let receiver = {};
    receiver = {
      addr: that.data.editaddress.addr,
      receiver: that.data.editaddress.receiver,
      phone: that.data.editaddress.phone,
      province: that.data.editaddress.province,
      city: that.data.editaddress.city,
      detail: that.data.editaddress.detail,
      latitude: that.data.editaddress.latitude,
      longitude: that.data.editaddress.longitude,
    };
    if (that.data.editaddress == '') {
      wx.showLoading({
        title: '请选择或添加收货地址',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    } else {
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
    that.editaddress()
  },
  /**
   * 支付
   */
  orderpay: function () {
    var that = this;
    request('book.order.pay', {
      union_uuid: that.data.union_uuid,
      paytype: 'wxpay',
      gateway: 'miniapp',
      detail: 'test'
    }, function (response) {
      if (response.data.success == true) {
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
    wx.getStorage({
      key: 'placeordermore',
      success: function (res) {
        that.setData({
          list: res.data
        })
        that.totalPriceunit()
        that.totalPrice_express()
        var totalPrice = that.totalPrice();
        that.setData({
          allPrice: totalPrice,
          inputPrice: false,
        })
        // that.setData({
        //   sharers: res.data.seller_detail
        // })
        // console.log('789', that.data.sharers)
        // that.totalPrice_express()
        // that.totalPrice()
      }
    })
    if (that.data.editaddress == '') {
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
    } else {

    }
    that.editaddress()
  },
  /**
   * 计算物流接口
   */
  editaddressjs: function () {
    var that = this;
    var itemlist = that.data.list
    /* 计算数量和总价 */
    let sellers = {};
    var pnewArr = {};
    var cnewArr = {};
    for (var i = 0; i < itemlist.length; i++) {
      if (typeof (pnewArr[itemlist[i].seller]) == 'undefined' || typeof (cnewArr[itemlist[i].seller]) == 'undefined') {
        pnewArr[itemlist[i].seller] = 0;
        cnewArr[itemlist[i].seller] = 0;
      }
      pnewArr[itemlist[i].seller] += Number(that.data.totalPriceunit[i]);
      cnewArr[itemlist[i].seller] += itemlist[i].count;
      let book = {
        total_cost: pnewArr[itemlist[i].seller],
        count: cnewArr[itemlist[i].seller]
      };
      sellers[itemlist[i].seller] = book
    }
    // for (var i = 0; i < itemlist.length; i++) {
    //   if (itemlist[i].active == true) {
    //     let item = itemlist[i];
    //     let book = {
    //       total_cost: item['total_price'],
    //       count: item['count']
    //     };
    //     if (sellers[item['seller']] === undefined)
    //       sellers[item['seller']] = book;
    //     // else
    //     //   sellers[item['seller']].push(book);
    //   }
    // }
    request('book.order.expFee', {
      city: that.data.editaddress.city,
      latitude: that.data.editaddress.latitude,
      longitude: that.data.editaddress.longitude,
      sellers: JSON.stringify(sellers)
    }, function (response) {
      if (response.data.success == true) {
        var expresslist = []
        for (var i = 0; i < itemlist.length; i++) {
          if (itemlist[i].active == true) {
            that.setData({
              express: response.data.data[itemlist[i].seller],
            })
          }
          expresslist.push(that.data.express)
        }
        var expresstotal = 0
        var obj = response.data.data
        var datalists = Object.keys(obj)
        for (var i = 0; i < datalists.length; i++) {
          that.setData({
            expresstotal: response.data.data[datalists[i]],
          })
          expresstotal += parseFloat(that.data.expresstotal);
        }
        that.setData({
          expresstotal: expresstotal
        })
        that.setData({
          expresslist: expresslist
        })
        var totalPrice = that.totalPrice();
        that.setData({
          allPrice: totalPrice,
          inputPrice: false,
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
          var itemlist = that.data.list
          /* 计算数量和总价 */
          let sellers = {};
          var pnewArr = {};
          var cnewArr = {};
          for (var i = 0; i < itemlist.length; i++) {
            if (typeof (pnewArr[itemlist[i].seller]) == 'undefined' || typeof (cnewArr[itemlist[i].seller]) == 'undefined') {
              pnewArr[itemlist[i].seller] = 0;
              cnewArr[itemlist[i].seller] = 0;
            }
            pnewArr[itemlist[i].seller] += Number(that.data.totalPriceunit[i]);
            cnewArr[itemlist[i].seller] += itemlist[i].count;
            let book = {
              total_cost: pnewArr[itemlist[i].seller],
              count: cnewArr[itemlist[i].seller]
            };
            sellers[itemlist[i].seller] = book
          }
          // for (var i = 0; i < itemlist.length; i++) {
          //   if (itemlist[i].active == true) {
          //     let item = itemlist[i];
          //     let book = {
          //       total_cost: item['total_price'],
          //       count: item['count']
          //     };
          //     if (sellers[item['seller']] === undefined)
          //       sellers[item['seller']] = book;
          //     // else
          //     //   sellers[item['seller']].push(book);
          //   }
          // }
          request('book.order.expFee', {
            city: that.data.city,
            latitude: that.data.editaddress.latitude,
            longitude: that.data.editaddress.longitude,
            sellers: JSON.stringify(sellers)
          }, function (response) {
            if (response.data.success == true) {
              var expresslist = []
              for (var i = 0; i < itemlist.length; i++) {
                if (itemlist[i].active == true) {
                  that.setData({
                    express: response.data.data[itemlist[i].seller],
                  })
                }
                expresslist.push(that.data.express)
              }
              var expresstotal = 0
              var obj = response.data.data
              var datalists = Object.keys(obj)
              for (var i = 0; i < datalists.length; i++) {
                that.setData({
                  expresstotal: response.data.data[datalists[i]],
                })
                expresstotal += parseFloat(that.data.expresstotal);
              }
              that.setData({
                expresstotal: expresstotal
              })
              that.setData({
                expresslist: expresslist
              })
              var totalPrice = that.totalPrice();
              that.setData({
                allPrice: totalPrice,
                inputPrice: false,
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