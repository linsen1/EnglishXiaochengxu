const app = getApp()
var self;
const util = require('../../utils/util.js')

Page({
  data: {
    'picUrl': '',
    'chineseContent': '',
    'englishContent': '',
    'note': '',
    'id': '',
    'title':'',
    'mp3URL': '',
    'progress': '0',
    'playimg': '/images/control/play.png',
    'currentTime': '00:00',
    'duration': '00:00',
    'words': '',
    favImg: '/images/control/fav.png',
    yinbiaoMp3Img: '/images/control/laba1.png',
    hidden: false,
    sentence: '',
    sentenceHidden: true
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
  sentencePlayMp3: function (e) {
    this.sentenceaudioMp3 = wx.createAudioContext('sentenceAudio' + e.currentTarget.dataset.id);
    this.sentenceaudioMp3.play();
    console.log(e.currentTarget.dataset.id);
    this.sentenceaudioMp3 = null;
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
  sentenceplayMp3End: function () {
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
      url: util.getCurrentUrl()+'/api/english/showArticle/' + options.id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        self.setData({
          'picUrl': res.data.picUrl,
          'chineseContent': res.data.chineseContent,
          'englishContent': res.data.englishContent,
          'note': res.data.note,
          'mp3URL': res.data.mp3URL,
          'id': res.data.id,
          'title': res.data.title
        });
        wx.setNavigationBarTitle({
          title: res.data.title
        });
        wx.request({
          url: util.getCurrentUrl()+'/api/english/getArticleWord/' + options.id,
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
        });
        wx.request({
          url: util.getCurrentUrl() + '/api/english/getSentence/refID/' + options.id + '/type/2',
          success: function (res2) {
            if (res2.data === undefined || res2.data.length == 0) {
              self.setData({
                sentenceHidden: true
              });

            }
            else {
              self.setData({
                sentenceHidden: false,
                sentence: res2.data
              });

            }
            console.log('短语区域：' + self.data['sentenceHidden']);
          }
        });
        if (wx.getStorageSync('openid') != '') {
          wx.request({
            url: util.getCurrentUrl()+'/api/english/checkMyMotto/',
            data: {
              'openId': wx.getStorageSync('openid'),
              'mottos_id': self.data['id'],
              type:1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: 'POST',
            success: function (res) {
              if (res.data.result == '1') {
                self.setData({
                  favImg: '/images/control/fav1.png'
                })
              }

              console.log("来自收藏:" + res.data.result);
            }
          })
        }
      }
    })

  },
  addfav: function (e) {
    if (self.data['favImg'] == '/images/control/fav.png') {
      if (wx.getStorageSync('openid') != '') {
        console.log('请求接口');
        wx.request({
          url: util.getCurrentUrl()+'/api/english/addMyMotto/', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            openId: wx.getStorageSync('openid'),
            mottos_id: e.currentTarget.dataset.id,
            type:1
          },
          method: 'POST',
          success: function (res) {
            self.setData({
              favImg: '/images/control/fav1.png',
            });
            console.log(res.data.result)
          }
        });
      }
      else {
        console.log('未授权，获取授权');
        util.getNewLogin();
      }
    }
    else {
      wx.request({
        url: util.getCurrentUrl()+'/api/english/DelMyMotto/', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          openId: wx.getStorageSync('openid'),
          mottos_id: e.currentTarget.dataset.id,
          type:1
        },
        method: 'POST',
        success: function (res) {
          self.setData({
            favImg: '/images/control/fav.png',
          });
          console.log(res.data)
        }
      });
    }

  },
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: self.data['title'],
      success: function (res) {

        // 转发成功
      },
      fail: function (res) {
        console.log('失败');
        // 转发失败
      }
    }
  }
})
