//index.js
//获取应用实例
const util = require('../../utils/util.js');
var self;
Page({
  data: {
    avatarUrl: '/images/control/user.png',
    nickName: '点击头像登录',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  gomymotto: function () {
    if (self.data['nickName'] == '点击头像登录') {
      wx.showModal({
        title: '登录提示',
        content: '亲，点击上方头像授权登录才能使用此功能',
        showCancel: false,
        confirmText: "知道了",
        success: function (res) { }
      });
    } else {
      wx.navigateTo({
        url: '../favlist/favlist'
      })
    }
  },
  gofilm: function () {
    if (self.data['nickName'] == '点击头像登录') {
      wx.showModal({
        title: '登录提示',
        content: '亲，点击上方头像授权登录才能使用此功能',
        showCancel: false,
        confirmText: "知道了",
        success: function (res) { }
      });
    } else {
      wx.navigateTo({
        url: '../find/find'
      })
    }
  },

  giveMoney:function(){
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: '/pages/apps/largess/detail?id=TkJYOGhToLY%3D',
      envVersion:'release',
      success(res){
        console.log('跳转打赏页面成功');
      }
    })
  },

  //从本地和服务端判断用户是否是新用户
  onLoad: function () {
    self = this;
    //先从本地缓存判断
    if (wx.getStorageSync('userInfo')) {
      self.setData({
        avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
        nickName: wx.getStorageSync('userInfo').nickName,
        hasUserInfo: true
      })
      util.getNewLogin();
    }
    //从服务器加载判断
    else if (wx.getStorageSync('openid')){
      wx.request({
        url: util.getCurrentUrl() + '/api/english/getUserInfo',
        method: 'POST',
        data: {
          openid: wx.getStorageSync('openid'),
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.nickName){
            self.setData({
              avatarUrl: res.data.avatarUrl,
              nickName: res.data.nickName,
              hasUserInfo: true
            })
            wx.setStorageSync('userInfo', res.data);
          }else{
            console.log('非注册用户，需要授权');
          }
        }
      })
      util.getNewLogin();
    }else{
      util.getNewLogin();
    }
  },

  //授权获取用户信息
  getUserInfo: function (e) {
    console.log(e);
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      self.setData({
        avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
        nickName: wx.getStorageSync('userInfo').nickName,
        hasUserInfo: true
      });
      //授权成功更新用户信息
      util.getNewLogin();
    } else {
      wx.showModal({
        title: '登录提示',
        content: '亲，只有授权才能使用个性化功能',
        showCancel: false,
        confirmText: "知道了",
        success: function (res) { 
          console.log("点击知道了");
        }
      });
      console.log('未授权');
    }
  }
})
