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

    if (self.data['nickName'] == '点击头像登录') {
      // 登录
      util.getlogin();
      // 获取用户信息
      util.getUsersAll(function () {
        self.setData({
          avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
          nickName: wx.getStorageSync('userInfo').nickName
        })
      });
    }
  },
  gomymotto: function () {
    if (self.data['nickName'] == '点击头像登录') {
      wx.showModal({
        title: '登录提示',
        content: '亲，点击上方头像授权登录才能使用此功能',
        showCancel: false,
        confirmText: "知道了",
        success: function (res) {}
      });
    } else {
      wx.navigateTo({
        url: '../mymotto/mymotto'
      })
    }
  },
  onLoad: function () {
    self = this;
    if (wx.getStorageSync('userInfo')) {
      self.setData({
        avatarUrl: wx.getStorageSync('userInfo').avatarUrl,
        nickName: wx.getStorageSync('userInfo').nickName
      })
    }
  }
})
