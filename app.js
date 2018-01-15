//app.js
const util = require('/utils/util.js');

App({

  onLaunch: function () {
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    util.getlogin();
    // 获取用户信息
    util.getUsersAll();
  }
})