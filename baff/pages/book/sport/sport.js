var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    remind:'加载中',
    scrollHeight:0,
    id:'',
    name:'',
    swiper_img:[],
    profile:'',
    details:[],
  },

  onLoad:function(option){
    var that=this
    this.getSport(option.id)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          name:option.name
        });
      }
    });
  },

 
  getSport: function (id) {
    var that=this

    function sportRender(info){
      var swiper_img = info.live.gallery
      var profile=info.intro
      var details = info.places

      that.setData({
        swiper_img: swiper_img,
        profile:profile,
        details: details

      })
    }

    wx.request({
      url: 'http://www.smallapp.cn/place/explore?id=6&category_id='+id,
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info) {
            sportRender(info)
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