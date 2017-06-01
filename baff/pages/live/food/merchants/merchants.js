var util = require('../../../../utils/util.js')
var WxParse = require('../../../../wxParse/wxParse.js');
var app = getApp()
Page({
  data:{
    article_id:0,
    remind:'加载中',
    scrollHeight:0,
    imgs:[],
    title:'',
    profile:'',
    address:'',
    telphone:'',
    email:'',
    website:'',
    content:'',
  },

  onLoad:function(options){
    var that=this
    this.getMechant(options.id)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          article_id: options.id
        });
      }
    });
  },

  //分享
  onShareAppMessage: function () {
    var id = this.data.article_id
    var path='page/live/food/merchants/merchants?id='+id
    return {
      title: '转发',
      path: path
    }
  },



  
  getMechant: function (id) {
    var that=this
    
    function mechantRender(info){
      console.log(info)
      var merchants_tips=info.content
      WxParse.wxParse('merchants_tips', 'html', merchants_tips, that, 5);
      var imgs=[]
      if (info.gallery.length > 0){
        imgs.push(info.gallery)  
      }
      
      that.setData({
        imgs:imgs,
        title:info.title,
        profile:info.intro,
        address: info.location,
        telphone: info.contacts,
        email:info.email,
        website:info.website,
        content:info.content,
      })
    }

    wx.request({
      url: 'http://www.smallapp.cn/place/detail?place_id='+id,
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            mechantRender(info)
          }
        }
      },
      complete:function(){
        that.setData({
          remind:''
        })
      }
    })
  },

})