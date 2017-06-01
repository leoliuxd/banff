var util=require('../../../utils/util.js')
var app = getApp()
Page({
    data: {
        remind:'加载中',
        list: [],
        scenery:{},
        advention:{},
    },

    onLoad:function(){
        console.log('onLoad') 
        this.getAdvention()
    },

    kindToggle: function (e) {
        var id = e.currentTarget.id
        this.data[id].open = !this.data[id].open 
        this.setData({
          [id]: this.data[id]
         });
    },

    //获取探险数据
    getAdvention: function(){
      var that=this


      function sceneryRender(info){
        var scenery={
          id:'',
          name:'',
          open:true,
          pages:[]
        }
        scenery.id = "scenery"
        scenery.name ="景点"
        scenery.pages=info
        that.setData({
          scenery:scenery
        })
      }

      var loadsum=0
      loadsum++
      wx.request({
        url: 'http://www.smallapp.cn/place/allplaces?category_id=7',
        success: function (res) {
          if (res.data) {
            var info = res.data;
            if (info) {
              sceneryRender(info)
            }
          }
        },
        complete:function(){
          loadsum--
          if(!loadsum){
            that.setData({
              remind:''
            })
          }
        }
      })

      function adventionRender(info){
        var advention={
          id:'',
          name:'',
          open:true,
          pages:[]
        }
        advention.id ="advention"
        advention.name="探险"
        advention.pages=info

        that.setData({
          advention:advention
        })
      }
      
      loadsum++
      wx.request({
        url: 'http://www.smallapp.cn/live/twocategories?id=6',
        success: function (res) {
          if (res.data) {
            var info = res.data;
            if (info) {
              adventionRender(info)
            }
          }
        },
        complete:function(){
          loadsum--
          if(!loadsum){
            that.setData({
              remind:''
            })
          }
        }
      })
  },
});
