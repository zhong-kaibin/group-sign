//index.js
//获取应用实例
const app = getApp()
import unit from '../../utils/util.js'
Page({
  data: {
    motto: '群组工具最便捷的报名接龙工具',
    src:'../../resource/image/index-bg.png',
    userInfo: {},
    dataStatus:true,//判断是否已发布过信息
    hasUserInfo: false,
    item:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log(getCurrentPages(), 'getCurrentPages')
    wx.showLoading({
      title: '正在加载',
    })
    if (getCurrentPages().length >1){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  onShow:function(){
    this.btn =false
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var self = this;
    getApp().getLoginKey(function (key) {
      wx.request({
        url: getApp().data.url + "/sign_up/index_list?login_key=" + key,
        method: "GET",
        success: function (res) {
          wx.stopPullDownRefresh()
          self.data.arr = res.data.data
          self.setData({
            arr: res.data.data
          });
          if (self.data.arr.length > 0) {
            self.setData({
              dataStatus: true
            });
            wx.hideLoading()
          } else {
            self.setData({
              dataStatus: false
            });
            wx.hideLoading()
          }
        }
      })
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  btn:false,//控制按钮点击次数
  getActives:function(e){
    if (this.btn) return
    this.btn = true
    var self = this;
    var su_id =e.currentTarget.dataset.id;
    this.setData({
      su_id: su_id,
      stoped: e.currentTarget.dataset.stoped
    })
    //请求活动详情
    wx.request({
      url: getApp().data.url + "/sign_up/detail?su_id=" + su_id,
      method: "GET",
      data:{
        // su_id: su_id
      },
      success: function (res) {
        getApp().mesArr = res.data.data;
        //设置全局的单条数据id值
        getApp().mesId = su_id; 
        if (res.data.code==0) {
          wx.navigateTo({
            url: '../messages/mes?su_id=' + su_id + "&stoped=" + self.data.stoped,
            // 
          });
          
        } else {       
        }
      }
    })
  },
  onPullDownRefresh:function(){
    this.onShow();
  },
  formSubmit(e){
    var formId = e.detail.formId;
    if (this.btn) return
    this.btn = true
    getApp().sendModel(formId);
    wx.navigateTo({
      url: '/pages/add-active/active',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var self = this;
    return {
      title: '群组工具',
      path: '/pages/index/index',
    }
  },

})
