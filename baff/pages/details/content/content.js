
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
      var content =unescape(info.content)
      console.log(content)
      WxParse.wxParse('content', 'html', content, that, 12.5);
      that.setData({
        img:info.img,
        title:info.title,
        author: info.author + ' ' + info.created_time,
        id:info.place_id,
      })
      wx.setNavigationBarTitle({
        title: info.title
      })
    }
    //获取文章数据
    wx.request({
      url: 'https://smallapp.dragontrail.cn/article/detail?appid=banfu123&id='+id,
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


  },

  //图片加载错误处理
  errImg: function () {
    this.setData({
      img:'../../../image/default.png'
    })
  }, 

})