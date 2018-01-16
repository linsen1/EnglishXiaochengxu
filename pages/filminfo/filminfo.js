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
    video_content_height: '225'
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
  }
})

function getFilmInfo(id) {
  wx.request({
    url: 'https://www.guzhenshuo.cc/api/english/showVideo/' + id,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
     
      wx.getSystemInfo({
        success: function (res2) {
          self.setData({
            video_content_height: res2.windowHeight-225-40
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
        video_goldenSentence: res.data.video_goldenSentence
      });
      wx.setNavigationBarTitle({
        title: res.data.video_title
      })
    }
  });
}