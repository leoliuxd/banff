var util=require('../../../utils/util.js')
var app = getApp()
Page({
    data:{

        //地图
        markers: [
          {
          iconPath: "../../../image/map_icon.png",
          id: 0,
          latitude: 34.2594300000,
          longitude: 108.9470400000,
          width: 13,
          height: 18,
          },
 
          {
            iconPath: "../../../image/map_icon.png",
            id: 0,
            latitude: 34.2617500000,
            longitude: 108.9434200000,
            width: 13,
            height: 18,
          },


        ],
        remind:'加载中',
        search_inputShowed: false,
        search_inputVal: "",
        scrollHeight:0,

        isShowList:true,
        switchMode:'',
        place:[],
        _place: [],
        selectedPlace:{},
        placeIndex: 0,

        live:[],
        _live:[],
        liveIndex:0,

        list:[],
        page:1,
        isMoreData:'',

    },

    onLoad:function(option){
        var that=this
        this.getLiveHeader(option.id)
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              scrollHeight: res.windowHeight,
              switchMode: '地图',
            });
          }
        });
    },

   // 搜索
    showInput: function () {
        this.setData({
            search_inputShowed: true
        });
    },
    hideInput: function () {
      this.setData({
          search_inputVal: "",
          search_inputShowed: false
      });
    },
    clearInput: function () {
      this.setData({
          search_inputVal: ""
      });
    },
    inputTyping: function (e) {
      this.setData({
          search_inputVal: e.detail.value
      });
      console.log('e.detail.value')
    },

     search:function(e){
       this.setData({
         page:1,
       })
       if (e.detail.value != ''){
         wx.showToast({
           title: '加载中',
           icon: 'loading',
           duration: 1000
         })

         var region_id=this.getRegionId(this.data.placeIndex)
         var live_id=this.getLiveId(this.data.liveIndex)
         this.getLiveContent(region_id, live_id, parseInt(this.data.page), e.detail.value)
       }else{
         wx.showModal({
           title: '提示',
           content: '请输入您要搜索的内容！',
           showCancel:false,
         })

       }
     },

    //地图
    switch:function(e){
        if(this.data.isShowList == true){
            this.setData({
                isShowList:false,
                switchMode:'列表',
            })
        }else{
            this.setData({
            isShowList:true,
            switchMode:'地图',
        })
        }
        
    },

    //选择器
    placeChange: function(e) {
      var region_id =this.getRegionId(parseInt(e.detail.value))
      var live_id = this.getLiveId(this.data.liveIndex)
      
      this.getLiveContent(region_id, live_id, parseInt(this.data.page))
        this.setData({
            placeIndex: e.detail.value,
            page:1,
        })
    },

    liveChange:function(e){
      
      var region_id = this.getRegionId(this.data.placeIndex)
      var live_id = this.getLiveId(parseInt(e.detail.value))

      this.getLiveContent(region_id, live_id, parseInt(this.data.page))
        this.setData({
            liveIndex: e.detail.value,
            page:1,
        })
    },

    getLiveHeader: function (id){
      var that=this

      //渲染列表头
      function PlaceAndLiveRender(info){
        var _place = []
        var _live = []
        var liveIndex=0
        var place=info
        for (var i in info) {
          _place.push(info[i].name)
          place[i].index=i
        }

        var live = app.cache['live']
        for (var i in app.cache['live']) {
          _live.push(app.cache['live'][i].name)
          live[i].index=i
          if (parseInt(id) == parseInt(live[i].id)){
            liveIndex=i
          }
        }
        that.setData({
          _place: _place,
          _live: _live,
          liveIndex:liveIndex,
          live:live,
          place:place
        })
        //console.log(place)
        //console.log(live)
      }

      //获取列表头数据
      wx.request({
        url: 'http://www.smallapp.cn/place/regions',
        success: function (res) {
          var regoin_id
          if (res.data) {
            var info = res.data;
            if (info) {
              console.log(info)
              PlaceAndLiveRender(info)
              regoin_id=that.getRegionId(that.data.placeIndex)
              that.getLiveContent(regoin_id, id, parseInt(that.data.page))
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

    getLiveContent: function (id, category_id, page,words=''){
      var that = this
      var url
      if (parseInt(category_id) == -2){
        category_id=''
      }
      //渲染列表数据
      function contentRender(info) {
        var list = app.cache['selectedPlace']
        that.setData({
          list: list,
        })
      }
      //获取列表数据
      //console.log('区域id: ' + id)
      console.log('分类id: ' + category_id)
      wx.request({
        url: 'http://www.smallapp.cn/place/places?region_id=' + id + '&category_id=' + category_id + '&page'+page+'&size=10'+'&words='+words,
        success: function (res) {
          if (res.data) {
            var info = res.data;
            if (info.length != 0) {
              console.log(info)
              app.saveCache('selectedPlace', info);
              contentRender(info)
            }else{
              wx.showModal({
                title: '提示',
                content: '暂无该项，请搜索其他项！',
                showCancel: false,
              })
              app.removeCache('selectedPlace');
              contentRender(info)  
            }
          } 
        },
        complete:function(res){
          if(words != '' && res.data.length != 0){
            setTimeout(function () {
              wx.showToast({
                title: '加载完成！',
                icon: 'success',
                duration: 1000
              })
            }, 1000)
          }
        }
      })
    },

    //列表内容动态加载
    lower: function (e) {
       wx.showNavigationBarLoading();
       var that = this;
       setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
       console.log("lower")
     },

     nextLoad: function () {
       var that=this
       wx.showToast({
         title: '加载中',
         icon: 'loading',
         duration: 2000
       })

       var page=this.data.page
       page=page+1
       this.setData({
         page:page
       })

       var region_id=that.getRegionId(that.data.placeIndex)
       var live_id=that.getLiveId(that.data.liveIndex)
       this.getLiveContentNext(region_id, live_id, parseInt(this.data.page))
       
       
     },

     getLiveContentNext: function (id, category_id, page,words='') {
       var that = this
       //渲染列表数据
       if (parseInt(category_id) == -2) {
         category_id = ''
       }
       function contentRender(info) {
         var list = that.data.list.concat(info)
         app.saveCache('selectedPlace',list)
         that.setData({
           list: list,
           isMoreData:'加载成功！'
         })
       }

       //获取列表数据
       wx.request({
         url: 'http://www.smallapp.cn/place/places?region_id=' + id + '&category_id=' + category_id + '&page=' + page + '&size=3' + '&words=' + words,
         success: function (res) {
           if (res.data) {
             var info = res.data;
             if (info.length !=0 ) {
               contentRender(info)
             } else 
             {
               console.log('已经没有数据了！')
               that.setData({
                 isMoreData: '已经没有数据了！'
               })
             } 
           }
         },
         complete:function(){
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

     //获取地点id
     getRegionId(index){
      var place=this.data.place
      var region_id=1
      if(place){
        for(var i in place){
          if(index == place[i].index){
            region_id=place[i].id
            break
          }
        }
      }
      return region_id
     },

     //获取生活id
     getLiveId(index){
       var live=this.data.live
       var live_id=1
       if(live){
         for(var i in live){
           if(index == live[i].index){
             live_id=live[i].id
             break
           }
         }
       }
       return live_id
     }
})