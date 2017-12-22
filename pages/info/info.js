// pages/info/info.js
//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    'pic': '',
    'chineseWord': '',
    'englishWord': '',
    'xiaobian': ''
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.guzhenshuo.cc/api/show/'+options.id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          'pic': res.data.pic,
          'chineseWord': res.data.chineseWord,
          'englishWord': res.data.englishWord,
          'xiaobian': res.data.xiaobian
        })
        console.log(res.data.pic)
      }
    })

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
  }
})
