const request = require('./utils/request');
//app.js
App({
	onLaunch: function () {
		// let order = {
		// 	"8": [
		// 		{
		// 			uuid: '2DED0C73-AD59-60BE-6054-E2AAD719B52E',
		// 			count: 1
		// 		}
		// 	],
		// 	"2927": [
		// 		{
		// 			uuid: 'E7141DCC-E41A-0D93-E33A-1889043CC82F',
		// 			count: 1
		// 		},
		// 		{
		// 			uuid: '5AC41210-2FC2-E300-B118-A91B4C1BD167',
		// 			count: 2
		// 		}
		// 	]
		// };
		// request('book.order.create', {
		// 	phone: 13122037580,
		// 	address: '闵行区辛庄镇',
		// 	order: JSON.stringify(order)
		// }, function(response) {
		// 	console.log(response.data);
		// });

		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);

		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            var userInfo = res.userInfo
            var nickName = userInfo.nickName
            var avatarUrl = userInfo.avatarUrl
            var gender = userInfo.gender //性别 0：未知、1：男、2：女
            wx.setStorage({
              key: "userInfo",
              data: userInfo, nickName, avatarUrl, gender
            })
            // 下面开始调用注册接口
            request('user.auth.wxOAuth2Login', {
              code: code
            }, function (response) {
              if (response.data.success == true) {
                wx.setStorageSync('Auth-Apikey', response.data.apikey)
                wx.setStorageSync('Auth-Token', response.data.token)
              } else if (response.data.error_code == 2){
                // wx.showLoading({
                //   title: response.data.msg,
                // })
                // setTimeout(function () {
                //   wx.hideLoading()
                //   // wx.redirectTo({
                //   //   url: '/pages/bindphone/bindphone'
                //   // })
                // }, 1000)
                wx.setStorage({
                  key: "openid",
                  data: response.data.openid
                })
              } else {

              }
            });
          },
          fail: function (res) {

          }
        })
			}
		});
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo;

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res);
							}
						}
					});
				}
			}
		});
    // 获取用户定位
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.setStorage({
          key: "latitudelongitude",
          data: res
        })
      }
    })
	},
	globalData: {
		userInfo: null
	}
});