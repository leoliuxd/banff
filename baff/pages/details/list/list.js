var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    remind:'加载中',
    list_title:'',
    list_img:'',
    scrollHeight:0,
    detail_list:[],
  },

  onLoad:function(option){
    console.log(option.id)
    var that=this
    var list_title=option.title
    var list_img=option.img
    this.getList(option.id)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          list_title:list_title,
          list_img:list_img
        });
      }
    });
  },

  //获取专题列表数据
  getList: function (id) {
    var that=this

    function listRender(info){
      var detail_list=info
      console.log('info: ')
      console.log(info)
      for(var i in info){
        detail_list[i].name=info[i].title
        detail_list[i].img=info[i].img
        detail_list[i].url ='../content/content?id='+info[i].id
      }
      that.setData({
        detail_list:detail_list
      })
    }

    wx.request({
      url: 'http://www.smallapp.cn/article/theme?theme_id='+id,
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            listRender(info)
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