// pages/symbols/info/info.js

const util = require('../../../utils/util.js');
var self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    speakVideo:'',
    speakImgUrl:'',
    speakAbout:'',
    speakWordImg:'',
    speakWord:'',
    speakWordChinese:'',
    speakWordMp3:'',
    WordGroup:'',
    WordsList:'',
    symbolPhraseList:'',
    symbolSentenceList:'',
    symbolBasetitle:'',
    symbolSongList:'',
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self=this;
    getSymbolBaseinfo(options.id);
    getSymbolWordGroup(options.id);
    getSymbolWordsList(options.id);
    getsymbolPhraseList(options.id);
    getsymbolSentenceList(options.id);
    getSymbolBase(options.id);
    getsymbolSongList(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('audio');
  },
  PlayGroupMp3:function(e){
    this.audioMp3 = wx.createAudioContext('groupAudio' + e.currentTarget.dataset.id);
    this.audioMp3.play();
  },
  PlayWordsMp3:function(e){
    this.wordsMp3 = wx.createAudioContext('Words' + e.currentTarget.dataset.id);
    this.wordsMp3.play();
  },
  PlayPhraseMp3:function(e){
    this.PhraseMp3 = wx.createAudioContext('Phrase' + e.currentTarget.dataset.id);
    this.PhraseMp3.play();
  },
  PlaySentenceMp3: function (e) {
    this.SentenceMp3 = wx.createAudioContext('Sentence' + e.currentTarget.dataset.id);
    this.SentenceMp3.play();
  },
  goSongInfo:function(e){
    wx.navigateTo({
      url: '../../song/infos/infos?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  audioPlay:function(){
    this.audioCtx.play();
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
      title: '音标小课堂:' + self.data.symbolBasetitle,
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

//获取音标基础内容

function getSymbolBase(id) {
  wx.request({
    url: util.URLconfig.service.symbolBase + id,
    success: function (res) {
      self.setData({
        symbolBasetitle: res.data.title
      })
      wx.setNavigationBarTitle({
        title: res.data.title
      });
    }
  })
}

//获取音标基本内容
function getSymbolBaseinfo(id) {
  wx.request({
    url: util.URLconfig.service.symbolinfo+id,
    success: function (res) {
      self.setData({
        speakVideo: res.data.speakVideo,
        speakImgUrl: res.data.speakImgUrl,
        speakAbout: res.data.speakAbout,
        speakWordImg: res.data.speakWordImg,
        speakWord: res.data.speakWord,
        speakWordChinese: res.data.speakWordChinese,
        speakWordMp3: res.data.speakWordMp3
      });
    }
  })
}
//获取常见组合
function getSymbolWordGroup(id){
  wx.request({
    url: util.URLconfig.service.symbolwordgroup + id,
    success:function(res){
      self.setData({
        WordGroup: res.data
      })
    }
  })
}
//获取单词精读列表
function getSymbolWordsList(id){
  wx.request({
    url: util.URLconfig.service.symbolwordslist + id,
    success: function (res) {
      self.setData({
        WordsList: res.data
      })
    }
  })
}

//获取短语列表
function getsymbolPhraseList(id){
  wx.request({
    url: util.URLconfig.service.symbolPhraseList + id,
    success: function (res) {
      self.setData({
        symbolPhraseList: res.data
      })
    }
  })
}

//获取句子列表

function getsymbolSentenceList(id) {
  wx.request({
    url: util.URLconfig.service.symbolSentenceList + id,
    success: function (res) {
      self.setData({
        symbolSentenceList: res.data
      })
    }
  })
}

function getsymbolSongList(id) {
  wx.request({
    url: util.URLconfig.service.symbolSongList + id,
    success: function (res) {
      self.setData({
        symbolSongList: res.data
      })
    }
  })
}