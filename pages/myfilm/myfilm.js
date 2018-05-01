// pages/myfilm/myfilm.js
var self, page = 1;
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'info': '',
    'loadingMoreHidden': true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    getlist()

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
    getlist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    getlistMore();
  }

  /**
   * 用户点击右上角分享
   */
 
})

function getlistMore() {
  self.setData({ 'loadingMore': '加载中...' });
  self.setData({ 'loadingMoreHidden': false });
  wx.showNavigationBarLoading();
  wx.request({
    url: util.getCurrentUrl() + '/api/english/GetMyMottoList?page=' + page,
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      openId: wx.getStorageSync('openid'),
      type:2
    },
    success: function (res) {
      if (page > res.data.last_page) {
        console.log('没有更多页了');
        self.setData({ 'loadingMore': '我是有底线的' });
        return false;
      }
      var newList = self.data.info.concat(res.data.data);
      self.setData({ 'info': newList });
      page++;
      self.setData({ 'loadingMoreHidden': true });
    },
    fail: function () {

    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      console.log('page:' + page);
    }
  })
}

function getlist() {
  page = 1;
  wx.showNavigationBarLoading();
  wx.request({
    url: util.getCurrentUrl() + '/api/english/GetMyMottoList?page=' + page,
    method: 'POST',
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: {
      openId: wx.getStorageSync('openid'),
      type:2
    },
    success: function (res) {
      self.setData({ 'info': res.data.data });
      console.log(res.data.data.length)
      if (res.data.data.length == 0) {
        wx.showModal({
          title: '信息提示',
          content: '亲，您的收藏夹里还没有内容，赶紧收藏您喜欢的影视内容吧！',
          showCancel: false,
          confirmText: "知道了",
          success: function (res) { }
        });
      }
      page++;
    },
    fail: function () {

    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  })
}
