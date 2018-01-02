const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatSecond = second=>{
  
  return [parseInt(second/60 % 60), second % 60].join(":")
    .replace(/\b(\d)\b/g, "0$1");
}

const getUserInfo=function(openID){
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      // 可以将 res 发送给后台解码出 unionId
      var rawData = res.rawData;
      var signature = res.signature;
      var encryptedData = res.encryptedData;
      var iv = res.iv;
      var userInfo = res.userInfo;
      userInfo.openId = openID;
      wx.setStorageSync('userInfo', userInfo);
      console.log(wx.getStorageSync('userInfo', userInfo));
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(res)
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatSecond: formatSecond,
  getUserInfo: getUserInfo
}
