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
    'favid': '',
    'audio': '',
    'progress': '0',
    'playimg': '/images/control/play.png',
    'currentTime': '00:00',
    'duration': '00:00',
    xiaobianHidden:true,
    progress1: '0',
    playimg1: '/images/control/play.png',
    currentTime1: '00:00',
    duration1: '00:00',
    'words': '',
    favImg: '/images/control/fav.png',
    yinbiaoMp3Img: '/images/control/laba1.png',
    hidden: false,
    hidden1: false,
    ArticleWordHidden: false,
    words1: '',
    NavHidden: false,
    NavHidden1: true,
    NavHidden2: true,
    nav2: 'nav2',
    nav3: 'nav1',
    nav1: 'nav1',
    loadFilm: false,
    loadArticle: false,
    videoID: '',
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
    video_content_height: '324',
    favHidden: false,
    picUrl: '',
    chineseContent: '',
    englishContent: '',
    note: '',
    articlID: '',
    title: '',
    mp3URL: '',
    words2: '',
    sentence: '',
    sentenceHidden: true,
    Articlesentence: '',
    ArticlesentenceHidden: true,
    Filmsentence: '',
    FilmsentenceHidden: true,
  },
  onReady: function (e) {
    this.audioCtx = wx.createAudioContext('audio');
    this.audioCtx1 = wx.createAudioContext('audio1');

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
    this.audioMp3 = null;
    console.log(e.currentTarget.dataset.id + '_1');
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
  audioPlay: function () {
    if (this.data.playimg == '/images/control/play.png') {
      this.audioCtx.play();
      self.setData({
        'playimg': '/images/control/stop.png'
      });
      this.audioCtx1.pause()
      self.setData({
        'playimg1': '/images/control/play.png'
      });
    }
    else {
      this.audioCtx.pause()
      self.setData({
        'playimg': '/images/control/play.png'
      });
    }
  },
  audioPlay1: function () {
    if (this.data.playimg1 == '/images/control/play.png') {
      this.audioCtx1.play();
      self.setData({
        playimg1: '/images/control/stop.png'
      });
      this.audioCtx.pause()
      self.setData({
        'playimg': '/images/control/play.png'
      });
    }
    else {
      this.audioCtx1.pause()
      self.setData({
        'playimg1': '/images/control/play.png'
      });
    }
  },
  playEnd: function () {
    self.setData({
      'playimg': '/images/control/play.png'
    });
  },
  playEnd1: function () {
    self.setData({
      playimg1: '/images/control/play.png'
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
  MusicStart1: function (e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    self.setData({
      progress1: progress,
      currentTime1: util.formatSecond(e.detail.currentTime.toString().split('.')[0]),
      duration1: util.formatSecond(e.detail.duration.toString().split('.')[0])
    })
  },
  onLoad: function () {
    self = this;
    getinfo();
    
  },
  changeNav: function () {
    getinfo();
    if (self.data['NavHidden'] == true) {
      self.setData({
        NavHidden: false,
        NavHidden1: true,
        NavHidden2: true,
        nav2: 'nav2',
        nav1: 'nav1',
        nav3: 'nav1',
        favHidden: false
      })
    }
  },
  changeNav2: function () {
    getArticleInfo();
    if (self.data['NavHidden2'] == true) {
      self.setData({
        NavHidden: true,
        NavHidden2: false,
        NavHidden1: true,
        nav2: 'nav1',
        nav3: 'nav2',
        nav1: 'nav1',
        favHidden: false
      })
    }

  },
  changeNav1: function () {
    getNewsInfo();
    if (self.data['NavHidden1'] == true) {
      self.setData({
        NavHidden: true,
        NavHidden1: false,
        NavHidden2: true,
        nav2: 'nav1',
        nav1: 'nav2',
        nav3: 'nav1',
        favHidden: false
      })
    }

  },
  addfav: function (e) {
    var type = 0;
    if (this.data.NavHidden == false) {
      type = 0;
    }
    else if (this.data.NavHidden1 == false) {
      type = 2;
    }
    else if (this.data.NavHidden2 == false) {
      type = 1;
    }
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
            type: type
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
          type: type
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
    var that = this;
    var shareTitle = '每天读些英文';
    var shareUrl = '/pages/info/info?id=' + this.data.id;
    if (this.data.NavHidden == false) {
      shareTitle = '每天读些英文';
      shareUrl = '/pages/info/info?id=' + this.data.id;
    }
    else if (this.data.NavHidden1 == false) {
      shareTitle = this.data.video_title;;
      shareUrl = '/pages/filminfo/filminfo?id=' + this.data.videoID;
    }
    else if (this.data.NavHidden2 == false) {
      shareTitle = this.data.title;
      shareUrl = '/pages/articleinfo/articleinfo?id=' + this.data.articlID;
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {

      title: shareTitle,
      path: shareUrl,
      success: function (res) {

        console.log(that.data.id);
        // 转发成功
      },
      fail: function (res) {
        console.log('失败');
        // 转发失败
      }
    }
  },
  onPullDownRefresh: function () {
    getinfo();
  }
});

function getNewsInfo() {

    wx.request({
      url: util.getCurrentUrl() + '/api/english/newVideo',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.getSystemInfo({
          success: function (res2) {
            self.setData({
              video_content_height: res2.windowHeight - 34 - 225 - 40
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
                video_URL: res.data[0].video_FHDURL,
                video_size: res.data[0].video_FHDdataSize,
                video_Mode: '超清'
              });

            }
            else {
              self.setData({
                video_URL: res.data[0].video_SDURL,
                video_size: res.data[0].video_SDdataSize,
                video_Mode: '标清'
              });
            }
          }
        })
        console.log(res.data)
        self.setData({
          video_title: res.data[0].video_title,
          videoID: res.data[0].id,
          favid: res.data[0].id,
          video_poster: res.data[0].video_poster,
          video_SDdataSize: res.data[0].video_SDdataSize,
          video_HDdataSize: res.data[0].video_HDdataSize,
          video_FHDdataSize: res.data[0].video_FHDdataSize,
          video_SDURL: res.data[0].video_SDURL,
          video_HDURL: res.data[0].video_HDURL,
          video_FHDURL: res.data[0].video_FHDURL,
          video_introduce: res.data[0].video_introduce,
          video_dialog_bg: res.data[0].video_dialog_bg,
          video_dialog_english: res.data[0].video_dialog_english,
          video_dialog_chinese: res.data[0].video_dialog_chinese,
          video_goldenSentence: res.data[0].video_goldenSentence
        });
        wx.request({
          url: util.getCurrentUrl() + '/api/english/getSentence/refID/' + res.data[0].id + '/type/1',
          success: function (res2) {
            if (res2.data === undefined || res2.data.length == 0) {
              self.setData({
                FilmsentenceHidden: true
              });

            }
            else {
              self.setData({
                FilmsentenceHidden: false,
                Filmsentence: res2.data
              });

            }
            console.log('短语区域：' + self.data['FilmsentenceHidden']);
          }
        });
        if (wx.getStorageSync('openid') != '') {
          wx.request({
            url: util.getCurrentUrl() + '/api/english/checkMyMotto/',
            data: {
              'openId': wx.getStorageSync('openid'),
              'mottos_id': self.data['videoID'],
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
              } else {
                self.setData({
                  favImg: '/images/control/fav.png'
                })
              }
              console.log("来自收藏:" + res.data.result)
            }
          })
        }
        wx.request({
          url: util.getCurrentUrl() + '/api/english/getVideoWord/' + res.data[0].id,
          success: function (res1) {
            if (res1.data === undefined || res1.data.length == 0) {
              self.setData({
                hidden1: true
              });
            }
            else {
              self.setData({
                hidden1: false,
                words1: res1.data
              });
              console.log(res1.data);
            }
          }
        });
        self.setData({
          loadFilm: true
        });
      }
    });
}


function getArticleInfo() {
  
    wx.request({
      url: util.getCurrentUrl() + '/api/english/NewArticle', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        self.setData({
          'picUrl': res.data[0].picUrl,
          'chineseContent': res.data[0].chineseContent,
          'englishContent': res.data[0].englishContent,
          'note': res.data[0].note,
          'mp3URL': res.data[0].mp3URL,
          'articlID': res.data[0].id,
          'favid': res.data[0].id,
          'title': res.data[0].title
        });
        wx.request({
          url: util.getCurrentUrl() + '/api/english/getSentence/refID/' + res.data[0].id + '/type/2',
          success: function (res2) {
            if (res2.data === undefined || res2.data.length == 0) {
              self.setData({
                ArticlesentenceHidden: true
              });

            }
            else {
              self.setData({
                ArticlesentenceHidden: false,
                Articlesentence: res2.data
              });

            }
            console.log('短语区域：' + self.data['ArticlesentenceHidden']);
          }
        });
        if (wx.getStorageSync('openid') != '') {
          wx.request({
            url: util.getCurrentUrl() + '/api/english/checkMyMotto/',
            data: {
              'openId': wx.getStorageSync('openid'),
              'mottos_id': self.data['articlID'],
              type: 1
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
              } else {
                self.setData({

                  favImg: '/images/control/fav.png'
                })
              }
              console.log("来自收藏:" + res.data.result)
            }
          })
        }
        wx.request({
          url: util.getCurrentUrl() + '/api/english/getArticleWord/' + res.data[0].id,
          success: function (res1) {
            if (res1.data === undefined || res1.data.length == 0) {
              self.setData({
                ArticleWordHidden: true
              });

            }
            else {
              self.setData({
                ArticleWordHidden: false,
                words2: res1.data
              });
              console.log(res1.data);
            }
          }
        });
        self.setData({
          loadArticle: true
        });
      }
    })
}


function getinfo() {
  wx.showNavigationBarLoading();
  wx.request({
    url: util.getCurrentUrl() + '/api/new/', //仅为示例，并非真实的接口地址
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.data[0].xiaobian){
        self.setData({
          xiaobianHidden:false
        });
      }
      self.setData({
        'pic': res.data[0].pic,
        'chineseWord': res.data[0].chineseWord,
        'englishWord': res.data[0].englishWord,
        'xiaobian': res.data[0].xiaobian,
        'id': res.data[0].id,
        favid: res.data[0].id,
        'audio': res.data[0].audio
      });
      wx.request({
        url: util.getCurrentUrl() + '/api/english/getword/' + res.data[0].id,
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
        url: util.getCurrentUrl() + '/api/english/getSentence/refID/' + res.data[0].id + '/type/0',
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
          url: util.getCurrentUrl() + '/api/english/checkMyMotto/',
          data: {
            'openId': wx.getStorageSync('openid'),
            'mottos_id': self.data['id'],
            type: 0
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
            } else {
              self.setData({
                favImg: '/images/control/fav.png'
              })
            }
            console.log("来自收藏:" + res.data.result)
          }
        })
      }
    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  })
}
