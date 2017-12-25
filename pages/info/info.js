// pages/info/info.js
//index.js
//获取应用实例
const app = getApp()
var self;
const util = require('../../utils/util.js')

Page({
  data: {
    'pic': '',
    'chineseWord': '',
    'englishWord': '',
    'xiaobian': '',
    'id': '',
    'audio': '',
    'progress': '0',
    'playimg': '/images/control/play.png',
    'currentTime': '00:00',
    'duration': '00:00'
  },
  onReady: function (e) {
    this.audioCtx = wx.createAudioContext('audio');

  },
  audioPlay: function () {
    if (this.data.playimg == '/images/control/play.png') {
      this.audioCtx.play();
      self.setData({
        'playimg': '/images/control/stop.png'
      });
    }
    else {
      this.audioCtx.pause()
      self.setData({
        'playimg': '/images/control/play.png'
      });
    }
  },
  playEnd: function () {
    self.setData({
      'playimg': '/images/control/play.png'
    });
  },
  MusicStart: function (e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    self.setData({
      progress: progress,
      currentTime: util.formatSecond(e.detail.currentTime.toString().split('.')[0]),
      duration: util.formatSecond(e.detail.duration.toString().split('.')[0])
    })
  },
  onLoad: function (options) {
    self = this;
    wx.request({
      url: 'https://www.guzhenshuo.cc/api/show/'+options.id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        self.setData({
          'pic': res.data.pic,
          'chineseWord': res.data.chineseWord,
          'englishWord': res.data.englishWord,
          'xiaobian': res.data.xiaobian,
          'audio': res.data.audio
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
