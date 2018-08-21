// pages/song/info/info.js
const util = require('../../../utils/util.js');
var self;
const backgroundAudioManager = util.backgroundAudioManager;
const obj = backgroundAudioManager;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songName: '',
    songImgBig: '',
    ENSong: '',
    CNSong: '',
    singerabout: '',
    songAbout: '',
    audio: '',
    singer: '',
    currentTime: '00:00',
    durationTime: '00:00',
    playimg: '/images/control/plays.png',
    xunhuan: '/images/control/xunhuan0.png',
    progress: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this;
    getSongInfo(options.id);
    getAudioStaus();
    pauseGoBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  playsingers: function() {
    if (self.data.xunhuan == '/images/control/xunhuan0.png') {
      self.setData({
        xunhuan: '/images/control/xunhuan1.png'
      });
    } else {
      self.setData({
        xunhuan: '/images/control/xunhuan0.png'
      });
    }
  },
  playmp3: function() {
    if (self.data.playimg == '/images/control/plays.png') {

      self.setData({
        playimg: '/images/control/stops.png'
      });
      if (backgroundAudioManager.src == '') {
        backgroundAudioManager.src = self.data.audio

      } else if (backgroundAudioManager.src == self.data.audio) {
        backgroundAudioManager.play();
        self.setData({
          playimg: '/images/control/stops.png'
        });
      } else {
        backgroundAudioManager.src = self.data.audio
        self.setData({
          playimg: '/images/control/stops.png'
        });
      }
    } else {
      backgroundAudioManager.pause();
      self.setData({
        playimg: '/images/control/plays.png'
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

//获取音乐详细信息
function getSongInfo(id) {
  wx.request({
    url: util.URLconfig.service.SongInfo + id,
    success: function(res) {
      self.setData({
        songName: res.data.songName,
        songImgBig: res.data.songImgBig,
        ENSong: res.data.ENSong,
        CNSong: res.data.CNSong,
        singerabout: res.data.singerabout,
        songAbout: res.data.songAbout,
        singer: res.data.singer
      });
      backgroundAudioManager.title = self.data.songName;
      backgroundAudioManager.epname = self.data.songName;
      backgroundAudioManager.singer = self.data.singer;
      backgroundAudioManager.coverImgUrl = self.data.songImgBig;

      wx.getNetworkType({
        success: function(res1) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res1.networkType;
          if (networkType == 'wifi') {
            self.setData({
              audio: res.data.songMp3HD
            });

          } else {
            self.setData({
              audio: res.data.songMp3
            });

          }
        }
      })

      wx.setNavigationBarTitle({
        title: res.data.songName
      });
    }
  })
}

function getAudioStaus() {
  obj.onTimeUpdate(() => {
    var progress = parseInt((obj.currentTime / obj.duration) * 100)
    self.setData({
      currentTime: util.formatSecond(obj.currentTime.toString().split('.')[0]),
      durationTime: util.formatSecond(obj.duration.toString().split('.')[0]),
      progress: progress,
      playimg: '/images/control/stops.png',
    });
  });
  obj.onEnded(() => {
    self.setData({
      progress: 0,
      currentTime: '00:00',
      playimg: '/images/control/plays.png'
    });
    if (self.data.xunhuan == '/images/control/xunhuan1.png') {
      obj.src = self.data.audio;
    }
  });
  obj.onPlay(() => {
    self.setData({
      playimg: '/images/control/stops.png'
    });
  });
}

function pauseGoBack() {
  if (obj.currentTime > 0) {
    var progress = parseInt((obj.currentTime / obj.duration) * 100)
    self.setData({
      currentTime: util.formatSecond(obj.currentTime.toString().split('.')[0]),
      durationTime: util.formatSecond(obj.duration.toString().split('.')[0]),
      playimg: '/images/control/plays.png',
      progress: progress

    })
  }
}