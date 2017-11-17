// pages/active/active.js
var util = require('../../utils/util.js');  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    src:"../../resource/image/add-img.png",
    timeIcon:"../../resource/image/time-icon.png",
    signIcon:"../../resource/image/sign-icon.png",
    deleteSrc:"../../resource/image/delete-icon.png",
    switchStatus1:false,
    switchStatus2: false,
    _num1:1,
    _num2:1,
    _signAdd1:"real_name",
    _signAdd2:"phone",
    time:"",
    content: "",
    title:"",
    stop_number:"",
    image_urls:[],
    imageSrcNum:0,//上传图片个数
    auto_stop:0,
    require_extra: "",
    extra_status:true,
    editInfo:"",
    with_extra:1,
    real_name:1,
    phone:1,
    submitStatus:true,
    flag: true,
    loadSrc:"../../resource/image/loading.gif",
    loadStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var edit = options.su_id? true :false
    this.setData({
      edit: edit,
      time: util.nextWeekTime(),
      stop_number:""
    });  
    var self = this;
    
    console.log(options.su_id,"options.su_id")
    if (options.su_id){
      //getApp().su_id = options.su_id
      this.setData({
        su_id: options.su_id
      });
      wx.request({
        url: getApp().data.url + "/sign_up/detail?su_id=" + options.su_id,
        method: "GET",
        success: function (res) {
          var data = res.data.data;
          var switchStatus1 = data.auto_stop==0?false:true;
          var extraLen = data.require_extra.length > 0?true:false;
          var require_extra = data.require_extra;
         
          self.setData({
            switchStatus1: data.auto_stop == 0 ? false :true,
            title: data.title,
            content:data.content,
            image_urls: data.image_urls[0] == '' ? [] : data.image_urls,
            switchStatus1: switchStatus1,
            time: data.stop_datetime != '' ? data.stop_datetime : util.nextWeekTime() ,
            // stop_number: data.stop_number != '' ? data.stop_number : 0,
            stop_number: data.stop_number == 0 ? '': data.stop_number,
            with_extra: data.with_extra,
            switchStatus2: data.with_extra==0?false:true,
            imageSrcNum: data.image_urls.length,
            auto_stop: data.auto_stop
          })

          if (require_extra.length > 0) {
            self.setData({
              phone: 0,
              real_name: 0,
              _num1: 0,
              _num2: 0,
              with_extra: 0,
              switchStatus2: false
            })
            for (var i = 0; i < require_extra.length; i++) { 
              if (require_extra[i] == "real_name") {
                self.setData({
                  real_name: 1,
                  _num1: 1,
                  with_extra: 1,
                  switchStatus2: true
                })
              } else if (require_extra[i] == "phone") {
                self.setData({
                  phone: 1,
                  _num2: 1,
                  with_extra: 1,
                  switchStatus2: true
                })
              }
            }
          }else{
            self.setData({
              switchStatus2: false,
              with_extra: 0
            })
          }
          console.log(res, "活动信息")
        }
      })
    }
    getApp().login_key
    
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
  getImage:function(){
    if (this.data.image_urls.length>=4){
      wx.showToast({
        title: '图片应小于4张'
      })
      return false
    }else{
      var tempFilePaths;
      var self = this
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          tempFilePaths = res.tempFilePaths;
          console.log(res, "图片返回信息")
          self.setData({
            lala: 2,
            urls: tempFilePaths[0]
          })
          //图片上传
          self.setData({
            loadStatus:true
          })
          wx.uploadFile({
            //  url: getApp().data.url+'/sign_up/upload_image', 
            url: 'https://devapi.bjpio.com/sign_up/upload_image',
            method: "POST",
            filePath: tempFilePaths.join('|'),
            name: 'file',
            formData: {
              'file': 'test'
            },
            success: function (res) {
              console.log(res.data, "图片上传成功")
              var data = JSON.parse(res.data)
              // var srcNum = data.data.url.length;
              self.data.image_urls.push(data.data.url)
              self.setData({
                loadStatus: false,
                image_urls: self.data.image_urls,
                imageSrcNum: self.data.imageSrcNum + 1
              })
              //do something
            }
          })
        }
      })  
    }
    
  },
  cancel: function(e){
    var self =this;
    this.data.image_urls.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      image_urls: self.data.image_urls,
      imageSrcNum: self.data.imageSrcNum-1
    })
  },
  titleConfirm: function (e) {
    var that = this;
    if (e.detail.value.length > 20) {
      wx.showToast({
        title: '主题应小于20字'
      })
      that.setData({
        title: that.data.title  
      });
    }else{
      that.setData({
        title: e.detail.value
      });
    }
  },
  titleConfirm1:function(){
    if (this.data.title.length > 20) {
      wx.showToast({
        title: '主题应小于20字'
      })
      return false
    } else {
      return true
    }
  },
  contentConfirm: function (e) {
    var that = this;
    that.setData({
      content: e.detail.value
    })
  },
  stopNumConfirm: function (e) {
    var that = this;
    that.setData({
      stop_number: e.detail.value
    })
  },
  //主题校验
  
  // 校验截止人数
  stopNumComfirm1:function(val){
    var reg = /^[1-9]\d*$/;
    if (val==""){
      return true  
    }
    else if (val==0){
      wx.showToast({
        title: '截止人数有误'
      })
      return false     
    } else if(!reg.test(val)){   
      wx.showToast({
        title: '截止人数有误'
      })
      return false
    }else{
      return true
    }
  },
  // 校验补充信息
  contentComfirm1:function(){
    if (this.data.content.length > 2000) {
      wx.showToast({
        title: '补充描述最多为2000个字'
      })
      return false
    } else {
      return true
    }
  },
  formSubmit:function (e) {
    var formValid;
    var formId = e.detail.formId;
    getApp().sendModel(formId);
    formValid = this.data.auto_stop == 1 ? this.stopNumComfirm1(this.data.stop_number) :true
    formValid =formValid && this.titleConfirm1() && this.contentComfirm1();
    if (formValid){
      console.log('form发生了submit事件，携带数据为：', getApp().login_key)
      var self = this;
      //根据报名附加信息的状态值来拼接该字段传个后台的值
      if (!self.data.switchStatus2){
        self.setData({
          require_extra: "",
          with_extra: 0
        })
        }else if(this.data.real_name==0&&this.data.phone==0){
          wx.showToast({
            title: '请选择附加信息'
          })
          return false;
      } else if (this.data.real_name == 1 && this.data.phone == 0){
          self.setData({
            require_extra: "real_name",
            with_extra: 1
          })
      } else if (this.data.real_name == 0 && this.data.phone == 1){
          self.setData({
            require_extra: "phone",
            with_extra: 1
          })
      }else{
        self.setData({
          require_extra: "real_name|phone",
          with_extra: 1
        })
      }     
      //发送数据给后台 
      wx.request({
        url: getApp().data.url + '/sign_up/create?login_key=' + getApp().login_key,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          // ...e.detail.value,
          title: self.data.title,
          content: self.data.content,
          image_urls: self.data.image_urls.length != 0 ? self.data.image_urls.join("|") : [],
          auto_stop: self.data.auto_stop,
          stop_datetime: self.data.time,
          stop_number: self.data.stop_number,
          num: self.data._num1,
          require_extra: self.data.require_extra,
          with_extra: self.data.with_extra
        },
        dataType: "json",
        success: function (res) {
          console.log(res, "新建返回值")
          if (res.data.code == 0) {
            // wx.hideToast()
            self.setData({
              submitStatus:false
            })
            wx.redirectTo({
              url: '/pages/messages/mes?su_id=' + res.data.su_id,
            })
          } else {
            wx.showToast({
              title: res.data.msg
            })
          }
        }
      })
    }else{
    return formValid;
    }
    
    
  },
  formSave:function(){
    var formValid;
    formValid = this.data.auto_stop == 1 ? this.stopNumComfirm1(this.data.stop_number) : true
    formValid = formValid && this.titleConfirm1() && this.contentComfirm1();
    if (formValid){
      var self = this;
      var extraStr = "";
      console.log(self.data.require_extra, "保留")
      //根据报名附加信息的状态值来拼接该字段传个后台的值
      if (!self.data.switchStatus2) {
        self.setData({
          require_extra: "",
          with_extra: 0
        })
      } else if (this.data.real_name == 0 && this.data.phone == 0) {
        wx.showToast({
          title: '请选择附加信息'
        })
        return false;
      } else if (this.data.real_name == 1 && this.data.phone == 0) {
        self.setData({
          require_extra: "real_name",
          with_extra: 1
        })
      } else if (this.data.real_name == 0 && this.data.phone == 1) {
        self.setData({
          require_extra: "phone",
          with_extra: 1
        })
      } else {
        self.setData({
          require_extra: "real_name|phone",
          with_extra: 1
        })
      }
      wx.request({
        url: getApp().data.url + '/sign_up/modify?login_key=' + getApp().login_key,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          // ...e.detail.value,
          title: self.data.title,
          content: self.data.content,
          image_urls: self.data.image_urls.join("|"),
          auto_stop: self.data.auto_stop,
          stop_datetime: self.data.time,
          stop_number: self.data.stop_number,
          num: self.data._num1,
          //require_extra: self.data.switchStatus2?self.data.require_extra.join("\|") : "",
          require_extra: self.data.require_extra,
          su_id: self.data.su_id,
          with_extra: self.data.with_extra
        },
        dataType: "json",
        success: function (res) {
          console.log(res, "编辑返回值")
          if (res.data.code == 0) {
            // wx.hideToast()
            wx.redirectTo({
              url: '../messages/mes?su_id=' + self.data.su_id,
            })
          } else {
            wx.showToast({
              title: res.data.msg
            })
          }
        }
      })
      }else{
      return formValid;
    }
    
  },
  //日期选择
  bindDateChange:function(e){
    this.setData({ //再set值
      time:e.detail.value
    })
    // event.detail = { value: value }
  },
  switch1Change:function(e){
    if (e.detail.value){
      this.setData({ //再set值
        switchStatus1: true,
        auto_stop:1
      })
      //this.data.switchStatus1=true不能修改
    }
    else{
      this.setData({ //再set值
        switchStatus1: false,
        auto_stop: 0
      })
    }
  },
  switch2Change:function(e){
    if (e.detail.value) {
      this.setData({ //再set值
        switchStatus2: true,
        with_extra:1,
        extras: ["real_name","phone"]
      })
    }
    else {
      //开关关闭时两个都不选
      this.setData({ //再set值
        switchStatus2: false,
        _num1: 0,
        _num2: 0,
        real_name:0,
        phone:0,
        with_extra: 0,
        extras: []
      })
    }
  },
  chooseItem1: function(e){
    if(this.data._num1==1){ 
      this.data.real_name=1
      //this.data.require_extra[0]="";
      this.setData({
        _num1: 0,
        _signAdd1: "",
        real_name:0,
      })  
    }else{
      //this.data.require_extra[0] ="real_name";
      this.setData({
        _num1: 1,
        _signAdd1: "real_name",
        real_name: 1,
      }) 
    };
    if (this.data.real_name ==0 && this.data.phone==0){
      this.setData({
        switchStatus2:false,
        with_extra:0
      })
    }else{
      this.setData({
        switchStatus2: true,
        with_extra: 1
      })
    } 

  },
  chooseItem2: function (e) {
    if (this.data._num2 == 1) {
      //this.data.require_extra[1] = "";
      this.setData({
        _num2: 0,
        _signAdd2: "",
        phone:0
      })
    } else {
      //this.data.require_extra[1] = "phone";
      this.setData({
        _num2: 1,
        _signAdd2: "phone",
        phone:1
      })
    };
    if (this.data.real_name == 0 && this.data.phone == 0) {
      this.setData({
        switchStatus2: false,
        with_extra: 0
      })
    } else {
      this.setData({
        switchStatus2: true,
        with_extra: 1
      })
    } 
  },
  formOver:function(){
    var self =this;
    wx.request({
      url: getApp().data.url + '/sign_up/stop?login_key=' + getApp().login_key,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        // ...e.detail.value,
        su_id:self.data.su_id
      },
      dataType: "json",
      success: function (res) {
        console.log(res, "结束返回值")
        if (res.data.code == 0) {
          // wx.hideToast()
          wx.reLaunch({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })
  },
  formDel:function(){
    var self = this;
    wx.request({
      url: getApp().data.url + '/sign_up/delete?login_key=' + getApp().login_key,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        // ...e.detail.value,
        su_id: self.data.su_id
      },
      dataType: "json",
      success: function (res) {
        console.log(res, "结束返回值")
        if (res.data.code == 0) {
          // wx.hideToast()
          wx.showToast({
            title: '刪除成功',
            icon: "success",
            duration: 2000,
            success: function(res) {
              wx.redirectTo({
                url: '../index/index',  
              })
            },
            fail: function(res) {},
            complete: function(res) {},
          })
          
        } else {
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })
  },
  /**
 * 弹出层函数
 */
  //出现
  show: function () {
    this.setData({ flag: false })

  },
  //消失
  hide: function () {
    this.setData({ flag: true })
  }
})