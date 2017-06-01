var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp()
Page({
  data:{
    remind:'加载中',
    id:0,
    img:'',
    title:'',
    author:'',
  },

  onLoad: function (option) {
    var that = this
    this.getContent(option.id)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },

  skip:function(){
    wx.navigateTo({
      url: '../../live/food/merchants/merchants?id='+this.data.id
    })
  },

  getContent:function(id){
    var that=this
    function contentRender(info){
      var content=info.content
      WxParse.wxParse('content', 'html', content, that, 5);
      that.setData({
        img:info.img,
        title:info.title,
        author: info.author + ' ' + info.created_time,
        id:info.id,
      })
    }
    //获取文章数据
    wx.request({
      url: 'http://www.smallapp.cn/article/detail?id='+id,
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            contentRender(info)
          }
        }
      },
      complete:function(){
        that.setData({
          remind:''
        })
      }
    })


  }

})