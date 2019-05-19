// app.js
const api = require('utils/api.js');
App({
  onLaunch: function () {
    //检查更新
    checkUpdateVersion();
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (data) {
          //从本地存储获取openid
          let openid = wx.getStorageSync("openid");
          //没有获取到openid则请求服务器获取openid
          if (openid == "") {
            wx.request({
              url: api.user_openid,
              data: {
                "appid": that.globalData.appid,
                "code": data.code
              },
              method: 'GET',
              success: response => {
                wx.setStorageSync("openid", response.data.openid);
              }
            })
          }
        }
      });
    }

  },
  onHide: function () {
    wx.pauseBackgroundAudio();
  },
  onShow: function () {
    wx.playBackgroundAudio()
  },
  globalData: {
    userInfo: null,
    appid: "wx7facf6fca0a9d72e",
    main_info: [],
    server: 'http://127.0.0.1:8080',
  }
});

/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
function checkUpdateVersion() {
  //判断微信版本是否 兼容小程序更新机制API的使用
  if (wx.canIUse('getUpdateManager')) {
    //创建 UpdateManager 实例
    const updateManager = wx.getUpdateManager();
    //检测版本更新
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //监听小程序有版本更新事件
        updateManager.onUpdateReady(function () {
          //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
          updateManager.applyUpdate();
        })
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showModal({
            title: '已经有新版本喽~',
            content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
          })
        })
      }
    })
  } else {
    //TODO 此时微信版本太低（一般而言版本都是支持的）
    wx.showModal({
      title: '溫馨提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}