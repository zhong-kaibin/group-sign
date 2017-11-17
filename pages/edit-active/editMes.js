// pages/edit-active/editMes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: "../../resource/image/voice.png",
    phoneIcon: "../../resource/image/phone.png",
    real_name:"",
    phone:"",
    extras:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"load钟的option")
    console.log(options.su_id, "load钟的option钟的id值")
    this.setData({
      su_id: options.su_id
    });
    this.getJSON()
  },
  //通过id获取详情页面的数据信息
  getJSON:function () {
    var self = this;
    var su_id = this.data.su_id;
    getApp().getLoginKey(function (key) {
      console.log(self.data.su_id,"这是id值 " )
      wx.request({
        url: getApp().data.url + "/sign_up/detail?su_id=" + self.data.su_id + '&login_key=' + key,
        method: "GET",
        success: function (res) {
          console.log(res, "报名页面钟返回的活动信息")
          self.setData({
            info: res.data.data,
            require_extra: res.data.data.require_extra,
          })
          if (self.data.require_extra.length > 0) {
            self.setData({
              phoneStatus: 0,
              realNameStatus: 0,
            })
            for (var i = 0; i < self.data.require_extra.length; i++) {
              if (self.data.require_extra[i] == "real_name") {
                self.setData({
                  realNameStatus: 1
                })
              } else if (self.data.require_extra[i] == "phone") {
                self.setData({
                  phoneStatus: 1
                })
              }
            }
          } else {
            self.setData({
              switchStatus2: false,
              with_extra: 0
            })
          }
        }
      })
    });
    
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
  
  },
  nameComfirm:function(e){
    var that = this;
    that.setData({
      real_name: e.detail.value
    })
  },
  nameComfirm1:function(e){
    if (/^\s*$/.test(this.data.real_name) || this.data.real_name == ""){
      wx.showToast({
        title: '姓名不能为空'
      })
      return false
    }else if (this.data.real_name.length > 6) {
      wx.showToast({
        title: '姓名应小于6位'
      })
      return false
    } else{
      return true
    }
  },
  phoneComfirm:function(e){
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  phoneComfirm1:function(e){
    if (!this.data.phone) {
      wx.showToast({
        title: '手机号不能为空'
      })
      return false
    } else if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(this.data.phone)){
      wx.showToast({
        title: '手机号码有误'
      })
      return false
    }else{
      return true
    }
  },
  submitSign:function(e){
    console.log(e,"报名")
    var self = this;
    var formValid, nameChecked, phoneChecked;
    phoneChecked = this.data.phoneStatus == 1 ? this.phoneComfirm1() : true;
    nameChecked = this.data.realNameStatus == 1 ? this.nameComfirm1() : true;
    formValid = nameChecked && phoneChecked;
    if (formValid){
      //填完信息后报名
      getApp().getLoginKey(function (key) {
        wx.request({
          url: getApp().data.url + "/sign_up/sign_up?login_key=" + key,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            su_id: self.data.su_id,
            extras: JSON.stringify({
              real_name: self.data.real_name,
              phone: self.data.phone
            })
          },
          dataType: "json",
          success: function (res) {
            console.log(res, "填完信息后报名信息")
            if (res.data.code == 0) {
              wx.showToast({
                title: "报名成功"
              })
              wx.redirectTo({
                url: '/pages/messages/mes?su_id=' + self.data.su_id,
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
   else{
      return false;
    }        
  }
})