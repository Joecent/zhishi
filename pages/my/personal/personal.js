// pages/my/personal/personal.js
const request = require('../../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    name: '',
    gender: '',
    // phone: '',
    school: '',
    university_id: '',
    nametype: '',
    // college: '',
    tags: '',
    student: false,
    nostudent: true,
    item: {},
    address: {},
    urlname: '',
    colleage: '',
    impression: '',
    university: '',
    items: [
      { name: '在校生', value: '在校生', checked: 'true' },
      { name: '非在校生', value: '非在校生' },
    ]
  },
  /**
   * 选择在校生或者非在校生
   */
  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == '在校生'){
      this.setData({
        student: false,
        nostudent: true,
        school: '',
        colleage: '',
        impression: '',
        university_id: '',
        university: ''
      })
    }else{
      this.setData({
        student: true,
        nostudent: false,
        school: '',
        colleage: '',
        impression: '',
        university_id: '',
        university: ''
      })
    }
  },
  /**
   * 点击差号删除当前内容
   */
  binddeletename:function(e){
    this.setData({
      urlname: ''
    })
  },
  // binddeletephone: function (e) {
  //   this.setData({
  //     phone: ''
  //   })
  // },
  // binddeletecollege: function (e) {
  //   this.setData({
  //     colleage: ''
  //   })
  // },
  binddeletetags:function(e){
    this.setData({
      impression: ''
    })
  },
  /**
   * 点击选择学校
   */
  bindschoolname:function(){
    wx.navigateTo({
      url: '/pages/my/search/search'
    })
  },
  /**
   * 点击编辑收发货地址
   */
  bindeditaddree:function(){
    wx.navigateTo({
      url: '/pages/mine/address/address'
    })
  },
  /**
    * 点击保存个人信息
    */
  formSubmit: function (e) {
    var that = this;
    if (that.data.student == false) {
      that.setData({
        nametype: 'university'
      })
    } else {
      that.setData({
        nametype: 'non-university'
      })
    }
    if (that.data.gender == 1){
      that.setData({
        gender: 'male'
      })
    } else if ((that.data.gender == 2)){
      that.setData({
        gender: 'female'
      })
    }else{
      that.setData({
        gender: 'secret'
      })
    }
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    if (e.detail.value.name == "") {
      warn = "昵称不能为空";
    } else if (e.detail.value.school == "" && that.data.nametype == 'university') {
      warn = "学校不能为空";
    } else if (e.detail.value.tags == "" && that.data.nametype == 'non-university') {
      warn = "个性签名不能为空";
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
      request('user.info.update', {
        name: e.detail.value.name,
        type: that.data.nametype,
        gender: that.data.gender,
        impression: e.detail.value.tags,
        university: e.detail.value.school,
        // colleage: e.detail.value.college,
        // introduction: e.detail.value.introduction
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          name: res.data.nickName,
          avatarUrl: res.data.avatarUrl,
          gender: res.data.gender
        })
      }
    })
    request('user.info', {

    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          item: response.data.data,
          urlname: response.data.data.name,
          colleage: response.data.data.colleage,
          impression: response.data.data.impression,
          address: response.data.data.address,
          university: response.data.data.university
        })
        if (response.data.data.type == 'non-university') {
          that.setData({
            items: [
              { name: '在校生', value: '在校生' },
              { name: '非在校生', value: '非在校生', checked: 'true' },
            ],
            student: true,
            nostudent: false
          })
        } else {
          that.setData({
            items: [
              { name: '在校生', value: '在校生', checked: 'true' },
              { name: '非在校生', value: '非在校生' },
            ],
            student: false,
            nostudent: true
          })
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
    var that = this;
    wx.getStorage({
      key: 'schoolname',
      success: function (res) {
        that.setData({
          school: res.data.name,
          university_id: res.data.name
        })
      }
    })
    request('user.info', {

    }, function (response) {
      if (response.data.success == true) {
        that.setData({
          address: response.data.data.address,
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