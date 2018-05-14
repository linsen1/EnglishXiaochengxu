// pages/filminfo/filminfo.js
const app = getApp()
var self;
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    favImg: '/images/control/fav.png',
    video_title: '',
    video_poster: '',
    video_SDdataSize: '',
    video_HDdataSize: '',
    video_FHDdataSize: '',
    video_SDURL: '',
    video_HDURL: '',
    video_FHDURL: '',
    video_introduce: '',
    video_dialog_bg: '',
    video_dialog_english: '',
    video_dialog_chinese: '',
    video_goldenSentence: '',
    video_URL: '',
    video_size: '0MB',
    video_Mode: '标清',
    video_content_height: '225',
    id: '',
    hidden: false,
    sentence: '',
    sentenceHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    getFilmInfo(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  addfav: function (e) {
    if (self.data['favImg'] == '/images/control/fav.png') {
      if (wx.getStorageSync('openid') != '') {
        console.log('请求接口');
        wx.request({
          url: util.getCurrentUrl() + '/api/english/addMyMotto/', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            openId: wx.getStorageSync('openid'),
            mottos_id: e.currentTarget.dataset.id,
            type: 2
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
        url: util.getCurrentUrl() + '/api/english/DelMyMotto/', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          openId: wx.getStorageSync('openid'),
          mottos_id: e.currentTarget.dataset.id,
          type: 2
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: self.data['video_title'],
      success: function (res) {
       
        // 转发成功
      },
      fail: function (res) {
        console.log('失败');
        // 转发失败
      }
    }
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
  sentenceplayMp3End: function () {
    self.setData({
      'yinbiaoMp3Img': '/images/control/laba1.png'
    });
  },
  playMp3End: function () {
    self.setData({
      'yinbiaoMp3Img': '/images/control/laba1.png'
    });
  }
})

function getFilmInfo(id) {
  wx.request({
    url: util.getCurrentUrl()+'/api/english/showVideo/' + id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      wx.request({
        url: util.getCurrentUrl() + '/api/english/getSentence/refID/' +id+ '/type/1',
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
      wx.getSystemInfo({
        success: function (res3) {
          self.setData({
            video_content_height: res3.windowHeight-225-40
          })
        }
      })
      wx.getNetworkType({
        success: function (res1) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res1.networkType;
          if (networkType == 'wifi') {
            self.setData({
              video_URL: res.data.video_FHDURL,
              video_size: res.data.video_FHDdataSize,
              video_Mode: '超清'
            });

          }
          else {
            self.setData({
              video_URL: res.data.video_SDURL,
              video_size: res.data.video_SDdataSize,
              video_Mode: '标清'
            });
          }
        }
      })
      self.setData({
        video_title: res.data.video_title,
        video_poster: res.data.video_poster,
        video_SDdataSize: res.data.video_SDdataSize,
        video_HDdataSize: res.data.video_HDdataSize,
        video_FHDdataSize: res.data.video_FHDdataSize,
        video_SDURL: res.data.video_SDURL,
        video_HDURL: res.data.video_HDURL,
        video_FHDURL: res.data.video_FHDURL,
        video_introduce: res.data.video_introduce,
        video_dialog_bg: res.data.video_dialog_bg,
        video_dialog_english: res.data.video_dialog_english,
        video_dialog_chinese: res.data.video_dialog_chinese,
        video_goldenSentence: res.data.video_goldenSentence,
        id: res.data.id
      });
      wx.setNavigationBarTitle({
        title: res.data.video_title
      });
      wx.request({
        url: util.getCurrentUrl()+'/api/english/getVideoWord/' + res.data.id,
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
      if (wx.getStorageSync('openid') != '') {
        wx.request({
          url: util.getCurrentUrl() + '/api/english/checkMyMotto/',
          data: {
            'openId': wx.getStorageSync('openid'),
            'mottos_id': self.data['id'],
            type: 2
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
  });
}