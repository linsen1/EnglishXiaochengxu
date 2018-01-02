//index.js
//获取应用实例
const util = require('../../utils/util.js');
var self;
Page({
  data: {
    avatarUrl: '/images/control/user.png',
    nickName: '点击头像登录'
  },
  //事件处理函数
  bindViewTap: function () {
    if (self.data.nickName == undefined) {
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
            self.setData({
              avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
              nickName: wx.getStorageSync('userInfo').nickName
            });
          } else {
            console.log('未授权');
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                console.log('授权成功');
                util.getUserInfo(wx.getStorageSync('openid'));
                self.setData({
                  avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
                  nickName: wx.getStorageSync('userInfo').nickName
                });
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
                            console.log('拒绝授权');
                            wx.getUserInfo({
                              withCredentials: true,
                              success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                var userInfo = res.userInfo;
                                userInfo.openId = wx.getStorageSync('openid');
                                wx.setStorageSync('userInfo', userInfo);
                                console.log(wx.getStorageSync('userInfo', userInfo));
                                self.setData({
                                  avatarUrl: res.userInfo.avatarUrl,
                                  nickName: res.userInfo.nickName
                                });
                                wx.request({
                                  url: 'https://www.guzhenshuo.cc/api/english/addUser',
                                  method: 'POST',
                                  data: {
                                    openId: wx.getStorageSync('openid'),
                                    nickName: userInfo.nickName,
                                    gender: userInfo.gender,
                                    language: userInfo.language,
                                    city: userInfo.city,
                                    province: userInfo.province,
                                    country: userInfo.country,
                                    avatarUrl: userInfo.avatarUrl
                                  },
                                  header: {
                                    'content-type': 'application/json' // 默认值
                                  },
                                  success: function (res) {
                                    console.log(res.data)
                                  }
                                });
                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (this.userInfoReadyCallback) {
                                  this.userInfoReadyCallback(res)
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
          }
        }
      })
    }
    else {
      console.log('不需要任何操作');
    }
  },
  onLoad: function () {
    self = this;
    self.setData({
      avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
      nickName: wx.getStorageSync('userInfo').nickName
    })
  }
})
