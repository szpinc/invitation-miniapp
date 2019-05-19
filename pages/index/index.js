// pages/invitation/index.js
// import api from '/utils/api.js'
const api = require('../../utils/api.js');
const app = getApp()
var server = app.globalData.server;
var appid = app.globalData.appid;
var touchDot = 0; //触摸时的原点  
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = ""; // 记录/清理时间记录 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: "",
    userInfo: {},
    music_url: '',
    isPlayingMusic: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    //创建动画
    var animation = wx.createAnimation({
      duration: 3600,
      timingFunction: "ease",
      delay: 600,
      transformOrigin: "50% 50%",
    })

    animation.scale(0.9).translate(10, 10).step(); //边旋转边放大

    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData: animation.export(),
    })

    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });

    wx.request({
      url: api.info_url,
      method: 'GET',
      data: {
        'user_id': 1
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        //console.log(res.data)
        wx.hideLoading();
        wx.playBackgroundAudio({
          dataUrl: res.data.main_info.music,
          title: '',
          coverImgUrl: ''
        })

        that.setData({
          mainInfo: res.data.main_info,
          music_url: res.data.main_info.music
        });

        app.globalData.main_info = that.data.mainInfo;
        app.globalData.music_url = that.data.mainInfo.music;
      }
    })



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
    var that = this;
    //console.log(that.data);
    return {
      title: that.data.mainInfo.share,
      imageUrl: that.data.mainInfo.thumb,
      path: 'pages/index/index',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },
  callhe: function (event) {
    console.log(this.data.mainInfo.he_tel)
    wx.makePhoneCall({
      phoneNumber: this.data.mainInfo.he_tel
    })
  },
  callshe: function (event) {
    wx.makePhoneCall({
      phoneNumber: this.data.mainInfo.she_tel
    })
  },
  play: function (event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.mainInfo.music,
        title: '',
        coverImgUrl: ''
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
})