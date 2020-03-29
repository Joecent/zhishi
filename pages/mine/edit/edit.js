// pages/mine/edit/edit.js
const request = require('../../../utils/request');

var model = require('../../../model/model.js')
var show = false;
var item = {};
Page({
  data: {
    item: {
      show: show,
      province: '',
      city: '',
      editaddress: {},
      latitude: '',
      longitude: '',
      name: '',
      address: '',
    }
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    var that = this;
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    var that = this;
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  /**
   * 点击选择所在地区
   */
  bindaddinput: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var name = res.name
        var address = res.address
        that.setData({
          latitude: latitude,
          longitude: longitude,
          name: name,
          address: address,
        });
      }
    })
  },
  /**
  * 点击添加收货地址
  */
  formSubmit: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.receiver == "") {
      warn = "收货人不能为空";
    } else if (e.detail.value.phone == "") {
      warn = "手机号码不能为空！";
    } else if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(e.detail.value.phone))) {
      warn = "手机号格式不正确";
    } else if (that.data.address == undefined) {
      warn = "所在地区不能为空";
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
      wx.getStorage({
        key: 'editaddress',
        success: function (res) {
          request('user.info.editAddress', {
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            addr: that.data.address,
            detail: e.detail.value.detail,
            phone: e.detail.value.phone,
            receiver: e.detail.value.receiver,
            key: res.data.index
          }, function (response) {
            if (response.data.success == true) {
              wx.showLoading({
                title: response.data.msg,
              })
              setTimeout(function () {
                wx.hideLoading()
                wx.navigateBack({
                  delta: 1
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
      })
    }
  },
  onLoad:function(){
    var that = this;
    wx.getStorage({
      key: 'editaddress',
      success: function (res) {
        that.setData({
          editaddress: res.data,
          address: res.data.addr,
          latitude: res.data.latitude,
          longitude: res.data.longitude,
        })
      }
    })
  }
})