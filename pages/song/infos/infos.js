// pages/song/infos/infos.js
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
    playimg: '/images/control/plays1.png',
    xunhuan: '/images/control/xh2.png',
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

  playsingers: function() {
    if (self.data.xunhuan == '/images/control/xh2.png') {
      self.setData({
        xunhuan: '/images/control/xh1.png'
      });
    } else {
      self.setData({
        xunhuan: '/images/control/xh2.png'
      });
    }
  },
  playmp3: function() {
    if (self.data.playimg == '/images/control/plays1.png') {

      self.setData({
        playimg: '/images/control/stop1.png'
      });
      if (backgroundAudioManager.src == '') {
        backgroundAudioManager.src = self.data.audio
        backgroundAudioManager.title = self.data.songName;
        backgroundAudioManager.epname = self.data.songName;
        backgroundAudioManager.singer = self.data.singer;
        backgroundAudioManager.coverImgUrl = self.data.songImgBig;
        
      } else if (backgroundAudioManager.src == self.data.audio) {
        backgroundAudioManager.play();
        self.setData({
          playimg: '/images/control/stop1.png'
        });
      } else {
        backgroundAudioManager.src = self.data.audio
        backgroundAudioManager.title = self.data.songName;
        backgroundAudioManager.epname = self.data.songName;
        backgroundAudioManager.singer = self.data.singer;
        backgroundAudioManager.coverImgUrl = self.data.songImgBig;
        self.setData({
          playimg: '/images/control/stop1.png'
        });
      }
    } else {
      backgroundAudioManager.pause();
      self.setData({
        playimg: '/images/control/plays1.png'
      });
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '英文歌曲:' + self.data.songName,
      success: function(res) {

        // 转发成功
      },
      fail: function(res) {
        console.log('失败');
        // 转发失败
      }
    }
  }
})

//获取音乐详细信息
function getSongInfo(id) {
  wx.request({
    url: util.URLconfig.service.SongInfo + id,
    success: function (res) {
      self.setData({
        songName: res.data.songName,
        songImgBig: res.data.songImgBig,
        ENSong: res.data.ENSong,
        CNSong: res.data.CNSong,
        singerabout: res.data.singerabout,
        songAbout: res.data.songAbout,
        singer: res.data.singer
      });
     

      wx.getNetworkType({
        success: function (res1) {
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
    if (obj.src == self.data.audio) {
      var progress = parseInt((obj.currentTime / obj.duration) * 100)
      self.setData({
        currentTime: util.formatSecond(obj.currentTime.toString().split('.')[0]),
        durationTime: util.formatSecond(obj.duration.toString().split('.')[0]),
        progress: progress,
        playimg: '/images/control/stop1.png',
      });
    }
  });
  obj.onEnded(() => {
    self.setData({
      progress: 0,
      currentTime: '00:00',
      playimg: '/images/control/plays1.png'
    });
    if (self.data.xunhuan == '/images/control/xh1.png') {
      obj.src = self.data.audio;
    }else{
      wx.stopBackgroundAudio();
    }
  });
  obj.onPlay(() => {
    self.setData({
      playimg: '/images/control/stop1.png'
    });
  });
}

function pauseGoBack() {
  if (obj.src == self.data.audio) {
    var progress = parseInt((obj.currentTime / obj.duration) * 100)
    self.setData({
      currentTime: util.formatSecond(obj.currentTime.toString().split('.')[0]),
      durationTime: util.formatSecond((obj.duration == undefined? 0 : obj.duration).toString().split('.')[0]),
      playimg: '/images/control/plays1.png',
      progress: progress
    })
  }
}