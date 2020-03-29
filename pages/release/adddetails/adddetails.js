// pages/release/adddetails/adddetails.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: '',
    hidephoto: false,
    showphoto: true,
    isbn: '',
    small: '',
    medium: '',
    large: ''
  },
  /**
   * 点击拍照或者相册选择图片
   */
  bindphoto:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: tempFilePaths,
          hidephoto: true,
          showphoto: false,
        })
        wx.uploadFile({
          url: 'https://api.zhi10book.com/book/post/wxUploadImage',
          header: {
            'Auth-Apikey': wx.getStorageSync('Auth-Apikey'),
            'Auth-Token': wx.getStorageSync('Auth-Token'),
            'Client-Type': 'miniapp',
          },
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            that.setData({
              small: data.data.small,
              medium: data.data.medium,
              large: data.data.large,
            })
            //do something
          }
        });
      }
    });
  },
  /**
   * 点击放弃发布
   */
  bindfangqi: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 点击确认卖书
   */
  formSubmit: function (e) {
    var that = this;
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.name == "") {
      warn = "书名不能为空！";
    } else if (e.detail.value.author == "") {
      warn = "作者不能为空！";
    } else if (e.detail.value.press == "") {
      warn = "出版社不能为空！";
    } else if (e.detail.value.init_price == "") {
      warn = "原价不能为空";
    } else if (e.detail.value.isbn == "") {
      warn = "ISBN不能为空";
    } else if (that.data.tempFilePaths == "") {
      warn = "图片不能为空";
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
      request('book.post.saveInfoToLibrary', {
        name: e.detail.value.name,
        author: e.detail.value.author,
        press: e.detail.value.press,
        init_price: e.detail.value.init_price * 100,
        isbn: e.detail.value.isbn,
        small: that.data.small,
        medium: that.data.medium,
        large: that.data.large,
        introduction: e.detail.value.introduction
      }, function (response) {
        if (response.data.success == true) {
          wx.redirectTo({
            url: '/pages/release/details/details?bid=' + response.data.data.id
          })
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      isbn: options.isbn
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
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

  }
})