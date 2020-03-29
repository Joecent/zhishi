// pages/mine/cart/cart.js
const request = require('../../../utils/request');

var app = getApp()
Page({
  data: {
    saveHidden: true,
    // totalP: 0,
    allSelect: false,
    noSelect: false,
    tempFilePaths: "",
    allPrice: 0,
    imageUrl: "",
    imageUrlPrefix: "",
    delBtnWidth: 120,    //删除按钮宽度单位（rpx）
    infofrominput: {},
    inputPrice: true,
    addlist: [],
    list: []
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
      if (curItem.active){
        total += parseFloat(curItem.real_price) * curItem.count;
      }
    }
    total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度
    return total;
  },
  //输入数量
  importCount: function (e) {
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    addlist[index].count = e.detail.value;
    if (addlist[index].count > addlist[index].stock) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      addlist[index].count = addlist[index].stock
    }
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
  },
  //点击减少数量
  importCountjian: function (e) {
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    var count = addlist[index].count; 
    if (count > 1) {
      count--;
    }
    addlist[index].count = count
    this.setData({
      list: addlist,
    })
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
  },
  //点击增加数量
  importCountjia: function(e) {
    var addlist = this.data.list;
    var index = e.currentTarget.dataset.index;
    var count = addlist[index].count; 
    count++;
    addlist[index].count = count
    if (addlist[index].count > addlist[index].stock) {
      wx.showLoading({
        title: '库存不足',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      addlist[index].count = addlist[index].stock
    }
    this.setData({
      list: addlist,
    })
    if (addlist[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
  },
  onShow: function () {
    var that = this;
    request('user.cart', {

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
    that.setData({
      allPrice: 0,
      allSelect: false,
      noSelect: true,
    });
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.list;
      if (index !== "" && index != null) {
        list[parseInt(index)].left = left;
        this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);

      }
    }
  },
  delItem: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list.splice(index, 1);
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    request('user.cart.delete', {
      uuid: e.currentTarget.dataset.uuid
    }, function (response) {
      if (response.data.success == true) {
        that.bindAllSelect()
        if (list.length == 0) {
          that.setData({
            allPrice: 0,
          })
        }
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
    that.setData({
      allSelect: true,
      noSelect: true,
    });
  },
  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if (index !== "" && index != null) {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
    }
    var count = list[index].count;
    list[index].count = count
    this.setData({
      list: list,
    })
    if (list[index].real_price != "") {
      var totalPrice = this.totalPrice();
      this.setData({
        allPrice: totalPrice,
        inputPrice: false,
      })
    }
    var id = e.currentTarget.dataset.id
  },

  // totalPrice: function () {
  //   var list = this.data.list;
  //   var total = 0;
  //   for (var i = 0; i < list.length; i++) {
  //     var curItem = list[i];
  //     if (curItem.active) {
  //       total += parseFloat(curItem.price) * curItem.number;
  //     }
  //   }
  //   total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度
  //   return total;
  // },
  allSelect: function () {
    var list = this.data.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        allSelect = true;
      } else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  noSelect: function () {
    var list = this.data.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (!curItem.active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  setGoodsList: function (saveHidden, total, allSelect, noSelect, list) {
    this.setData({
      saveHidden: saveHidden,
      totalPrice: total,
      allSelect: allSelect,
      noSelect: noSelect,
      list: list
    });
    var shopCarInfo = {};
    var tempNumber = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNumber = tempNumber + list[i].number
    }
    shopCarInfo.shopNum = tempNumber;
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  },
  bindAllSelect: function () {
    var currentAllSelect = this.data.allSelect;
    var list = this.data.list;
    if (currentAllSelect) {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = false;
        var count = list[i].count;
        list[i].count = count
        this.setData({
          list: list,
        })
        if (list[i].real_price != "") {
          var totalPrice = this.totalPrice();
          this.setData({
            allPrice: totalPrice,
            inputPrice: false,
          })
        }
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        var curItem = list[i];
        curItem.active = true;
        var count = list[i].count;
        list[i].count = count
        this.setData({
          list: list,
        })
        if (list[i].real_price != "") {
          var totalPrice = this.totalPrice();
          this.setData({
            allPrice: totalPrice,
            inputPrice: false,
          })
        }
      }
    }
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect(), list);
  },
  editTap: function () {
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = false;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  saveTap: function () {
    var list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      curItem.active = true;
    }
    this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  getSaveHide: function () {
    var saveHidden = this.data.saveHidden;
    return saveHidden;
  },
  deleteSelected: function (e) {
    var that = this;
    var itemlist = that.data.list
    var newsourse = []
    for (var i = 0; i < itemlist.length; i++) {
      if (itemlist[i].active == true) {
        newsourse.push(itemlist[i].id)
      }
    }
    var ob = {};
    ob.ids = newsourse
    wx.request({
      method: 'POST',
      url: app.globalData.etoolsUrl + '/cart/delete',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-token': wx.getStorageSync('token')
      },
      data: {
        data: JSON.stringify(ob)
      },
      success(res) {
        if (res.data.meta.code == app.apiCode.SUCCESS) {
        } else {
          //处理错误信息
          var exception = res.data.meta;
          app.handleException(exception, true);
        }
      }
    })
    var list = this.data.list;
    list = list.filter(function (curGoods) {
      return !curGoods.active;
    });
    this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
  },
  toPayOrder: function (e) {
    var that = this;
    // var itemlist = this.data.list
    // let order = {};
    // var newsourse = []
    // for (var i = 0; i < itemlist.length; i++) {
    //   if (itemlist[i].active == true) {
    //     order[itemlist[i].seller] = [{
    //       uuid: itemlist[i].share_uuid,
    //       count: itemlist[i].count
    //     }]
    //     newsourse.push(JSON.stringify(order))
    //   } 
    // }
    var itemlist = this.data.list
    var newsourse = []
    for (var i = 0; i < itemlist.length; i++) {
      if (itemlist[i].active == true) {
        newsourse.push(itemlist[i])
      }
    }
    if (newsourse.length == 0){
      wx.showLoading({
        title: '请选择商品',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    }else{
      wx.navigateTo({
        url: '/pages/mine/placeordermore/placeordermore'
      })
    }
    wx.setStorage({
      key: "placeordermore",
      data: newsourse
    })
    wx.removeStorage({
      key: 'editaddress',
      success: function (res) {

      }
    })
  }
})