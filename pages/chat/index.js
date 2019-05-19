// pages/chat/index.js
const api = require('../../utils/api.js');
const app = getApp()
var server = app.globalData.server;
var appid = app.globalData.appid;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        inputValue: '',
        auth: false,
        msgSta: false,
        signSta: false,
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

        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                auth: true,
                userInfo: userInfo
            })
        }
        wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
            title: '加载中',
            icon: 'loading',
        });
        wx.request({
            url: api.chat_list,
            method: 'GET',
            data: {
                'appid': appid
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.hideLoading();
                that.setData({
                    chatList: res.data.chat_list,
                    chatNum: res.data.chat_num
                });
            }
        })
    },
    leaveMsg: function () {
        this.setData({
            msgSta: true,
            signSta: false
        })
    },
    signIn: function () {
        this.setData({
            signSta: true,
            msgSta: false
        })
    },
    cancelMsg: function () {
        this.setData({
            signSta: false,
            msgSta: false
        })
    },

    formSubmit(event) {
        var that = this

        var userInfo = that.data.userInfo;
        var nickname = userInfo.nickName;
        var face = userInfo.avatarUrl;

        var name = event.detail.value.name;
        if (name == '') {
            wx.showToast({
                title: '请填写您的姓名',
                icon: 'none'
            })
            return;
        }
        var tel = event.detail.value.tel;
        if (tel == '') {
            wx.showToast({
                title: '请填写您的电话',
                icon: 'none'
            })
            return;
        }
        var reg_tel = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
        if (!reg_tel.test(tel)) {
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none'
            })
            return;
        }
        var plan = event.detail.value.plan;
        var extra = event.detail.value.extra;
        wx.request({
            url: api.attend,
            data: {
                'nickname': nickname,
                'face': face,
                'name': name,
                'tel': tel,
                'plan': plan,
                'extra': extra
            },
            header: {},
            method: "POST",
            dataType: "json",
            success: res => {
                // console.log(res.data);
                if (res.data.code == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '提交成功 欢迎您的到来',
                        showCancel: false
                    })
                    this.cancelMsg()
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
            }
        })
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
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })

    },
    bindgetuserinfo: function (e) {
        var that = this;
        if (e.detail.userInfo) {
            wx.setStorageSync('userInfo', e.detail.userInfo)
            that.setData({
                userInfo: e.detail.userInfo,
                auth: true
            })

        } else {
            wx.showToast({
                title: "为了您更好的体验,请先同意授权",
                icon: 'none',
                duration: 2000
            });
        }
    },
    foo: function () {
        var that = this
        if (that.data.inputValue) {
            //留言内容不是空值

            var userInfo = that.data.userInfo;
            var name = userInfo.nickName;
            var face = userInfo.avatarUrl;
            var words = that.data.inputValue;
            wx.request({
                url: api.chat_add,
                data: {
                    'openid': that.data.openid,
                    'nickname': name,
                    'face': face,
                    'words': words
                },
                header: {},
                method: "POST",
                dataType: "json",
                success: res => {
                    // console.log(res.data);
                    if (res.data.code == 0) {
                        // console.log(3,res.data.chat_list)
                        that.setData({
                            chatList: res.data.chat_list,
                            chatNum: res.data.chat_num
                        });
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: false
                        })
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
            //Catch Error
            wx.showToast({
                title: '您还没有填写内容',
                icon: 'none'
            })
            return;
        }
        that.setData({
            inputValue: '' //将data的inputValue清空
        });
        return;
    }
})