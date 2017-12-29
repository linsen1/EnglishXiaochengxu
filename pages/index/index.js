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
    'id':'',
    'audio':'',
    'progress':'0',
    'playimg':'/images/control/play.png',
    'currentTime':'00:00',
    'duration':'00:00',
    'words':''
  },
  onReady:function(e){
    this.audioCtx = wx.createAudioContext('audio');
    
  },
  audioPlay: function () {
    if (this.data.playimg =='/images/control/play.png')
    {
      this.audioCtx.play();
      self.setData({
      'playimg':'/images/control/stop.png'
      });
    }
    else
    {
      this.audioCtx.pause()
      self.setData({
        'playimg': '/images/control/play.png'
      });
    } 
  },
  playEnd:function(){
    self.setData({
      'playimg': '/images/control/play.png'
    });
  },
  MusicStart:function(e){
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    self.setData({
      progress: progress,
      currentTime: util.formatSecond(e.detail.currentTime.toString().split('.')[0]),
      duration: util.formatSecond(e.detail.duration.toString().split('.')[0])
    })
  },
  onLoad: function () {
    self=this;
    getinfo();
  },
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '每日一句英语名言',
      path: '/pages/info/info?id='+this.data.id,
     
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
})

function getinfo(){
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
        url: 'https://www.weipinpai.wang/api/english/getword/1',
        success:function(res1){
          self.setData({
            words:res1.data
          });
          console.log(res1.data);
        }
      })
      
    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  })
}