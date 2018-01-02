//app.js
const util = require('/utils/util.js');

App({

  onLaunch: function () {
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'https://www.guzhenshuo.cc/weixin/onLogin/' + res.code,
            method: 'POST',
            success: function (res1) {
              wx.setStorageSync('openid', res1.data.openid);
              console.log(res1.data);
            }
          })
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权');
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("openid:" + wx.getStorageSync('openid'));
          util.getUserInfo(wx.getStorageSync('openid'));
        } else {
          console.log('未授权');
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              console.log('授权成功');
              util.getUserInfo(wx.getStorageSync('openid'));
              console.log("openid:" + wx.getStorageSync('openid'));
            },
            fail() {
              wx.showModal({
                title: '登录提示',
                content: '亲，需要您的授权才能提供更好的服务哟~',
                showCancel: false,
                confirmText: "知道了",
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting(
                      {
                        success: (res) => {
                          console.log(res.authSetting);
                          util.getUserInfo(wx.getStorageSync('openid'));
                          console.log("openid:" + wx.getStorageSync('openid'));
                        }
                      })
                  }
                }
              })
            }
          })
        }
      }
    })
  }
})