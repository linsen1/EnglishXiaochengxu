//index.js
//获取应用实例
const app = getApp()
var self;

Page({
  data: {
    'pic': '',
    'chineseWord': '',
    'englishWord': '',
    'xiaobian': '',
    'id':''
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
        'id': res.data[0].id
      })
      console.log(res.data[0].pic);
    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  })
}