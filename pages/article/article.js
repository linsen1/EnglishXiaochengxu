// pages/his/his.js
var self, page = 1;
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function getlistMore() {
  self.setData({ 'loadingMore': '加载中...' });
  self.setData({ 'loadingMoreHidden': false });
  wx.showNavigationBarLoading();
  wx.request({
    url: 'https://www.guzhenshuo.cc/api/english/getArticleList?page=' + page,
    method: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
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
    url: 'https://www.guzhenshuo.cc/api/english/getArticleList?page=' + page,
    method: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      self.setData({ 'info': res.data.data });
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
