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
    'duration': '00:00',
    'words': '',
     yinbiaoMp3Img: '/images/control/laba1.png',
     hidden: false
  },
  onReady: function (e) {
    this.audioCtx = wx.createAudioContext('audio');

  },
  PlayMp3: function (e) {
    this.audioMp3 = wx.createAudioContext('myAudio' + e.currentTarget.dataset.id);
    this.audioMp3.play();
    self.setData({
      yinbiaoMp3Img: '/images/control/laba.png'
    });
    this.audioMp3 = null;

  },
  PlayMp3_1: function (e) {
    this.audioMp3 = wx.createAudioContext('myAudio' + e.currentTarget.dataset.id + '_1');
    this.audioMp3.play();
    self.setData({
      yinbiaoMp3Img: '/images/control/laba.png'
    });
    console.log(e.currentTarget.dataset.id + '_1');
    this.audioMp3 = null;
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
  playMp3End: function () {
    self.setData({
      'yinbiaoMp3Img': '/images/control/laba1.png'
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
        });
        wx.request({
          url: 'https://www.guzhenshuo.cc/api/english/getword/' + options.id,
          success: function (res1) {
            if (res1.data === undefined || res1.data.length == 0) {
              self.setData({
                hidden: true
              });

            }
            else {
              self.setData({
                hidden: false,
                words: res1.data
              });
              console.log(res1.data);
            }
          }
        })        
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
