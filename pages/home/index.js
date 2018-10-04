// pages/home/index.js
const app = getApp()
var self;
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mottos:'',
    articles:'',
    articles2:'',
    songs:'',
    films:'',
    banners:'',
    showFilm:true,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self=this;
    getinfos();
    getBanner();
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
    getinfos();
    getBanner();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  articleClick: function (e){
    wx.navigateTo({
      url: '../articleinfo/articleinfo?id=' + e.currentTarget.dataset.id
    })
  },
  articletxtClick: function (e) {
    wx.navigateTo({
      url: '../articleinfo/articleinfo?id=' + e.currentTarget.dataset.id
    })
  },
  filmClick:function(e){
    wx.navigateTo({
      url: '../filminfo/filminfo?id=' + e.currentTarget.dataset.id
    })
  },
  filmtxtClick:function(e){
    wx.navigateTo({
      url: '../filminfo/filminfo?id=' + e.currentTarget.dataset.id
    })
  },
  bannerClick:function(e){
    var types = e.currentTarget.dataset.id.split('_')[0];
    var typeID = e.currentTarget.dataset.id.split('_')[1];
    console.log(typeID);
    if (types==1){
      wx.navigateTo({
        url: '../info/info?id='+typeID
      })
    }
    else if(types==0){
      wx.navigateTo({
        url: '../sitenews/info/info?id=' + typeID
      })
    }
    else if(types==2){
      wx.navigateTo({
        url: '../articleinfo/articleinfo?id=' + typeID
      })
    }
    else if(types==3){
      wx.navigateTo({
        url: '../filminfo/filminfo?id=' + typeID
      })
    }
    else if(types==4){
      wx.navigateTo({
        url: '../song/infos/infos?id=' + typeID
      })
    }
  }
})

function getinfos(){
  wx.showNavigationBarLoading();
  wx.request({
    url: util.URLconfig.service.homeinfos,
    success: function (res) {
      self.setData({
        mottos: res.data.mottos,
        articles: res.data.Articles,
        songs: res.data.songs,
        films: res.data.films,
        showFilm: res.data.showFilm
      });
    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  })
}

function getBanner(){
  wx.request({
    url: util.URLconfig.service.homebanner,
    success: function (res) {
      self.setData({
        banners: res.data
      });
    }
  })
}