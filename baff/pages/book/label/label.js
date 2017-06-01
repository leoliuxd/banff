var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    remind:'加载中',
    scrollHeight:0,
    label:[],
    page:1,
    title:''
  },
  
  onLoad: function () {
    var that=this
    this.getLabel()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },

  getLabel:function(){
    var that=this

    //渲染标示页
    function labelRender(info){
      that.setData({
        label: info,
      })
    } 

    //获取标示页数据
    wx.request({
      url: 'http://www.smallapp.cn/sign/signs?size=12',
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info) {
            console.log(info)
            labelRender(info)
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

  //动态加载内容
  lower:function(){
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
  },

  nextLoad: function () {
    var that = this
    var page = this.data.page
    page = page + 1
    this.setData({
      page: page
    })

    this.getLabelNext(parseInt(page))
  },

  getLabelNext:function(page){
    var that=this
    function labelNextRender(info){
      var label = that.data.label.concat(info)
      that.setData({
        label: label,
        isMoreData: '加载成功！'
      })

    }

    wx.request({
      url: 'http://www.smallapp.cn/sign/signs?size=12&page='+page,
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            labelNextRender(info)
          }else{
            console.log('已经没有数据了！')
            that.setData({
              isMoreData: '已经没有数据了！'
            })
          }
        }
      },
      complete: function () {
        setTimeout(function () {
          wx.showToast({
            title: that.data.isMoreData,
            icon: 'success',
            duration: 1000
          })
        }, 1000)
      }
    })

  },
})