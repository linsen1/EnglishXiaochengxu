const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatSecond = second => {

  return [parseInt(second / 60 % 60), second % 60].join(":")
    .replace(/\b(\d)\b/g, "0$1");
}

const getlogin = function () {
  wx.login({
    success: res => {
      if (res.code) {
        wx.request({
          url: getCurrentUrl() + '/weixin/onLogin/' + res.code,
          method: 'POST',
          success: function (res1) {
            wx.setStorageSync('openid', res1.data.openid);
            console.log('log_openid:' + res1.data.openid);

          }
        })
      }
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  })
}

const getUserInfo = function (openID, callback) {
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      // 可以将 res 发送给后台解码出 unionId
      var rawData = res.rawData;
      var signature = res.signature;
      var encryptedData = res.encryptedData;
      var iv = res.iv;
      var userInfo = res.userInfo;
      wx.setStorageSync('userInfo', userInfo);
      if (callback != null) {
        callback();
      }
      wx.request({
        url: getCurrentUrl() + '/api/english/addUser',
        method: 'POST',
        data: {
          openId: openID,
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
      })
      console.log(wx.getStorageSync('userInfo', userInfo));
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      /*
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(res)
      }
      */
    }
  })
}

const getUsersAll = function (callback) {
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        console.log('已授权');
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        console.log("openid:" + wx.getStorageSync('openid'));
        getUserInfo(wx.getStorageSync('openid'));
      } else {
        console.log('未授权');
        wx.authorize({
          scope: 'scope.userInfo',
          success() {
            console.log('授权成功');
            getUserInfo(wx.getStorageSync('openid'));
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
                        if (callback != null) {
                          getUserInfo(wx.getStorageSync('openid'), callback);
                        }
                        else {
                          getUserInfo(wx.getStorageSync('openid'));
                        }
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

const getCurrentUrl = function () {
  var testURL = 'https://endemo.guzhenshuo.cc';
  var Url = 'https://www.guzhenshuo.cc';
  return testURL;
}

const getNewLogin = function () {
  wx.login({
    success: res => {
      if (res.code) {
        wx.request({
          url: getCurrentUrl() + '/weixin/Login/OnlyGetOpenid',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res1) {
            wx.setStorageSync('openid', res1.data.openid);
            console.log('appLoad加载获取OpenID:' + res1.data.openid);
            //向数据库写入用户信息OpenID
            wx.request({
              url: getCurrentUrl() + '/api/english/onlyAddUserOpenid',
              method: 'POST',
              data: {
                openId: res1.data.openid,
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res2) {
                console.log("根据openID更新用户登录信息：" + res2.data);
                getNewInfo(res1.data.openid);
              }
            });

          }
        })
      }
    }
  })
}

const getNewInfo=function(openID){
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            wx.setStorageSync('userInfo', res.userInfo);
            console.log("用户授权信息:"+wx.getStorageSync('userInfo'));
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
           // if (this.userInfoReadyCallback) {
             // this.userInfoReadyCallback(res)
            //}
            var userInfo = res.userInfo;
            wx.request({
              url: getCurrentUrl() + '/api/english/addUser',
              method: 'POST',
              data: {
                openId: openID,
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
                console.log("用户授权后更新详细用户信息："+res.data)
              }
            })
          }
        })
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatSecond: formatSecond,
  getUserInfo: getUserInfo,
  getlogin: getlogin,
  getUsersAll: getUsersAll,
  getCurrentUrl: getCurrentUrl,
  getNewLogin: getNewLogin,
  getNewInfo: getNewInfo
}