// pages/messages/mes.js
const app = getApp()
import urlObj from '../../utils/url.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: "../../resource/image/index-bg.png",
    userIcon: "../../resource/image/user.png",
    phoneIcon: "../../resource/image/phone.png",
    arr:{},
    su_id:"",
    userInfo:{},
    loadStatus:false
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
    var su_id = options.su_id;
    getApp().su_id = su_id
    this.setData({
      su_id: su_id
    })
    this.getJSON()
  },
  //通过id获取详情页面的数据信息
  getJSON: function () {
    var self = this;
    var su_id = this.data.su_id;
    getApp().getToken(function (token) {
      wx.request({
        url: getApp().data.url + "/sign_up/detail"+ urlObj.url.params+"&su_id=" + su_id,
        method: "GET",
        header:{
          'content-type': 'application/json',
          'Authorization': 'AppletToken ' + getApp().token
        },
        success: function (res) {
          if(res.data.code==0){
            self.setData({
              info: res.data.data,
              userInfo: res.data.data.user_info,
              stop_number: res.data.data.stop_number,
              stop_datetime: res.data.data.stop_datetime,
              stoped: res.data.data.stoped,
              require_extra: res.data.data.require_extra,
              with_extra: res.data.data.with_extra,
              is_joined: res.data.data.user_info.is_joined,
              loadStatus:true//请求数据成功后才显示页面
            });

          } else if(res.data.code==-1){
              wx.showToast({
                title: '该活动已取消'
              })
              return false
          }
          wx.hideLoading()
        }
      })

      wx.request({
        url: getApp().data.url + "/sign_up/join_list" + urlObj.url.params +"&su_id=" + su_id ,
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken' + getApp().token
        },
        success: function (res) {
          if (res.data.code == 0){
            self.setData({
              activeArr: res.data.data,
              activeArrLength: res.data.data.length
            })
          } else if (res.data.code == -1){
            return false
          }
          
        }
      })
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
    console.log("下拉动作")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var self =this;
    return {
      title: self.data.info.title + '的群约',
      path: '/pages/messages/mes?su_id='+self.data.su_id,
    }  
  },
  formSubmit:function(e){
    var formId = e.detail.formId;
    getApp().sendModel(formId);
  },
  toSign:function(){
    var stringTime = this.data.stop_datetime + ' 23:59:59';
    var timestamp1 = Date.parse(stringTime);
    var timestamp = Date.parse(new Date());
    console.log(this.data.is_joined,"是否已参加")

    if (this.data.stop_number !=0 && this.data.stop_number <= this.data.activeArrLength){
        wx.showToast({
          title: '活动人数已满'
        })
    } else if(timestamp > timestamp1){          
        wx.showToast({
          title: '活动已过期'
        })
    } else if (this.data.is_joined==1){
        wx.showToast({
          title: '您已报名'
        })
    } else if(this.data.with_extra ==1){
      console.log("填信息立即报名信息" + this.data.is_joined)
      wx.redirectTo({
        url: '../edit-active/editMes?su_id=' + getApp().su_id,
      })
    } else if (this.data.stoped == 1){
      wx.showToast({
        title: '报名已结束'
      })
    }
    else{
        //不用填信息直接报名
        getApp().getToken(function (token) {
          wx.request({
            url: getApp().data.url + "/sign_up/sign_up" + urlObj.url.params,
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': 'AppletToken ' + getApp().token
            },
            data: {
              su_id: getApp().su_id
            },
            dataType: "json",
            success: function (res) {
              console.log(res, "立即报名信息")
              if (res.data.code == 0) {
                wx.redirectTo({
                  url: '/pages/messages/mes?su_id=' + getApp().su_id,
                })
              } else {
                wx.showToast({
                  title: res.data.msg
                })
              }

            }
          })

        })
      }      
  },
  bigImage:function(e){
    var self =this;
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      // urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
      urls: self.data.info.image_urls // 需要预览的图片http链接列表
    })
  },
  onPullDownRefresh: function () {
    this.getJSON();
    wx.stopPullDownRefresh()
  }
})