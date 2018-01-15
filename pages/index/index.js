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
    favImg: '/images/control/fav.png',
    yinbiaoMp3Img: '/images/control/laba1.png',
    hidden: false,
    NavHidden:false,
    NavHidden1: true,
    nav2:'nav2',
    nav1: 'nav1',
    loadFilm:false,
    video_title:'',
    video_poster:'',
    video_SDdataSize:'',
    video_HDdataSize:'',
    video_FHDdataSize:'',
    video_SDURL:'',
    video_HDURL:'',
    video_FHDURL:'',
    video_introduce:'',
    video_dialog_bg:'',
    video_dialog_english:'',
    video_dialog_chinese:'',
    video_goldenSentence:'',
    video_URL: '',
    video_size: '0MB',
    video_Mode: '标清'
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
    this.audioMp3 = null;
    console.log(e.currentTarget.dataset.id + '_1');
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
  onLoad: function () {
    self = this;
    getinfo();
  },
  changeNav:function(){
    if(self.data['NavHidden']==true){
      self.setData({
        NavHidden:false,
        NavHidden1:true,
        nav2: 'nav2',
        nav1: 'nav1'
      })
    }
    getNewsInfo();
  },
  changeNav1: function () {
    if (self.data['NavHidden1'] == true) {
      self.setData({
        NavHidden: true,
        NavHidden1: false,
        nav2: 'nav1',
        nav1: 'nav2'
      })
    }
    getNewsInfo();
  },
  addfav: function (e) {
    if (self.data['favImg'] == '/images/control/fav.png') {
      if (wx.getStorageSync('userInfo') != '') {
        console.log('请求接口');
        wx.request({
          url: 'https://www.guzhenshuo.cc/api/english/addMyMotto/', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            openId: wx.getStorageSync('openid'),
            mottos_id: e.currentTarget.dataset.id
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
        util.getlogin();
        util.getUsersAll();
      }
    }
    else {
      wx.request({
        url: 'https://www.guzhenshuo.cc/api/english/DelMyMotto/', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          openId: wx.getStorageSync('openid'),
          mottos_id: e.currentTarget.dataset.id
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '每日一句英语名言',
      path: '/pages/info/info?id=' + this.data.id,

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

function getNewsInfo(){
  if (self.data['loadFilm']==false)
  {
    wx.request({
      url: 'https://www.guzhenshuo.cc/api/english/newVideo',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        wx.getNetworkType({
          success: function (res1) {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res1.networkType;
            if (networkType == 'wifi') {
              self.setData({
                video_URL: res.data[0].video_FHDURL,
                video_size: res.data[0].video_FHDdataSize,
                video_Mode:'超清'
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
      
      }
    });
    self.setData({
      loadFilm:true
    });
 
  }
}


function getinfo() {
  wx.showNavigationBarLoading();
  wx.request({
    url: 'https://www.guzhenshuo.cc/api/new/', //仅为示例，并非真实的接口地址
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      self.setData({
        'pic': res.data[0].pic,
        'chineseWord': res.data[0].chineseWord,
        'englishWord': res.data[0].englishWord,
        'xiaobian': res.data[0].xiaobian,
        'id': res.data[0].id,
        'audio': res.data[0].audio
      });
      wx.request({
        url: 'https://www.guzhenshuo.cc/api/english/getword/' + res.data[0].id,
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
      if (wx.getStorageSync('userInfo') != '') {
        wx.request({
          url: 'https://www.guzhenshuo.cc/api/english/checkMyMotto/',
          data: {
            'openId': wx.getStorageSync('openid'),
            'mottos_id': self.data['id']
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
            console.log("来自收藏:"+res.data.result)
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
