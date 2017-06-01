var util=require('../../../utils/util.js')
var app = getApp()
Page({
    data:{
        remind:'加载中',
        scrollHeight:0,
        seasonName:['班夫:春季','班夫:夏季','班夫:秋季','班夫:冬季'],
        seasonIndex:0,
        selectedSeason:[],
        season:[],
    },

    //初始化
    onLoad: function () {
        var that=this
        var selectedSeason
        this.getSeason(this.data.seasonIndex+1)
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              scrollHeight: res.windowHeight,
              selectedSeason: selectedSeason
            });
          }
        });
    },

    //转换季节
    seasonChange: function(e) {
        this.getSeason(parseInt(e.detail.value)+1)
        this.setData({
            seasonIndex:e.detail.value,
        })
    },

    kindToggle: function (e) {
        var id = e.currentTarget.id, selectedSeason = this.data.selectedSeason;
        for (var i = 0, len = selectedSeason.length; i < len; ++i) {
            if (selectedSeason[i].id == id) {
                selectedSeason[i].open = !selectedSeason[i].open
            }else {
                selectedSeason[i].open = false
            }


        }
        this.setData({
            selectedSeason: selectedSeason,
        });
        
    },


    

    getSeason: function(id){
      var that=this

      function seasonRender(info){
        var selectedSeason
        selectedSeason=info
        for (var i in selectedSeason){
          selectedSeason[i].open=false
        }
        that.setData({
          selectedSeason: selectedSeason
        })
      }

      wx.request({
        url: 'http://www.smallapp.cn/festival/festivals?festival_category_id='+id,
        success: function (res) {
          if (res.data) {
            var info = res.data;
            if (info) {
              seasonRender(info)
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