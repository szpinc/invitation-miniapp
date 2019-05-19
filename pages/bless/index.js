// pages/bless/index.js
const api = require('../../utils/api.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        actionSheetHidden: true,
        painting: {},
        // shareImage: mainInfo.shareImage,
        // qrcode: mainInfo.qrcode,
        openid: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        let openid = wx.getStorageSync("openid")
        that.setData({
            openid: openid
        });
        wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
            title: '加载中',
            icon: 'loading',
        });
        wx.request({
            url: api.bless_list,
            method: 'GET',
            data: {
                'user_id': 1
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.hideLoading();
                // console.log(res.data)
                that.setData({
                    blessList: res.data.bless_list,
                    blessNum: res.data.bless_num,
                });
            }
        })
    },
    openActionsheet: function () {
        var self = this;
        self.setData({
            actionSheetHidden: !self.data.actionSheetHidden
        });
    },
    listenerActionSheet: function () {
        var self = this;
        self.setData({
            actionSheetHidden: !self.data.actionSheetHidden
        })
    },
    createPoster: function () {

        wx.navigateTo({
            url: '/pages/poster/index',
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
            title: app.globalData.main_info.share,
            imageUrl: app.globalData.main_info.thumb,
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
    bindgetuserinfo: function (e) {
        // console.log(e.detail.userInfo)
        var that = this;
        if (e.detail.userInfo) {
            that.setData({
                userInfo: e.detail.userInfo,
                authBtn: false
            })

            var userInfo = e.detail.userInfo;
            var name = userInfo.nickName;
            var face = userInfo.avatarUrl;
            var openid = that.data.openid;

            wx.request({
                url: api.bless_add,
                data: {
                    'nickname': name,
                    'face': face,
                    'openid': openid
                },
                header: {},
                method: "POST",
                dataType: "json",
                success: res => {

                    var userBless = {
                        'nickname': name,
                        'face': face,
                    }
                    // console.log(res.data);
                    if (res.data.code == 0) {
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: false
                        })
                        that.data.blessList.push(userBless);
                        this.setData({
                            blessList: that.data.blessList
                        });
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: false
                        })
                    }
                }
            })

        } else {
            wx.showToast({
                title: "为了您更好的体验,请先同意授权",
                icon: 'none',
                duration: 2000
            });
        }
    },
})