// pages/sitenews/info/info.js
const util = require('../../../utils/util.js');
var self;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    author:'每天读些英文',
    newstype:'站点公告',
    contents:'',
    created_at:'',
    types:'0',
    bannerUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    getNewsInfo(options.id);
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
  onShareAppMessage: function () {

  }
})

function getNewsInfo(id) {
  wx.request({
    url: util.URLconfig.service.siteNewsInfo+id,
    success: function (res) {
      self.setData({
        title: res.data.title,
        contents: res.data.contents,
        created_at: res.data.created_at,
        types: res.data.type,
        bannerUrl: res.data.bannerUrl
      })
      wx.setNavigationBarTitle({
        title: res.data.title
      });
    }
  })
}