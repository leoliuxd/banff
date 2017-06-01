
var util=require('../../utils/util.js')
var app = getApp()
Page({
  data:{
    
    remind: '加载中',
    scrollHeight:0,
    hot:[],
    _book:['label','tips','season','advention'],
    book:[],
    wonderful:[],
    swiperCurrent:0,
    page:1,
    isMoreData:'',

    //班夫生活
    live:[],
    food:{},
    shop:{},
    culture:{},
    fitness:{},
    accommodation:{}, 
    entertainment:{},
    scenery:{},
    all:{id:-2,name:'全部'},
  },

  onLoad: function () {
    var that = this;
    var live
    console.log('onLoad')
    this.getBanff()
    //app.getUser()
    // wx.login({
    //   success: function (res) {
    //     console.log(res.code)
    //   }
    // });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
  },

  search:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },

  myTrait:function(){
    wx.navigateTo({
      url: '../mytrait/mytrait',
    })
  },

  //轮播
  swiperChange: function(e){
    this.setData({  
        swiperCurrent: e.detail.current  
    })  
},

  //精彩班夫动态加载
   lower: function (e) {
     wx.showNavigationBarLoading()
     var that = this;
     that.nextLoad()
     wx.hideNavigationBarLoading()
     console.log("lower")
   },

  

  nextLoad: function(){
    
    var page = this.data.page
    page = page + 1
    this.setData({
      page: page
    })

    this.getWonderfulNext(parseInt(page))
  },

  //继续获取精彩班夫 
  getWonderfulNext:function(page){
    var that=this

    function wonderfulRender(info){
      var wonderful = that.data.wonderful.concat(info)
      for (var i in wonderful) {
        if (!parseInt(wonderful[i].is_theme)) {
          wonderful[i].url = '../details/content/content?id=' + wonderful[i].id
        }else{
          wonderful[i].url = '../details/list/list?id=' + wonderful[i].id + '&title=' + wonderful[i].title + '&img=' + wonderful[i].img
        }
      }
      that.setData({
        wonderful: wonderful,
      })
    }

    wx.request({
      url: 'http://www.smallapp.cn/article/articles?size=3&page='+page,
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            wonderfulRender(info)
          } else {
            console.log('已经没有数据了！')
            wx.showToast({
              title: '已经没有数据了！',
              icon: 'success',
              duration: 1000
            })
          }
        }
      },
    })
  },

 
  //获取首页数据
   getBanff:function(){
    var that=this
    
    //渲染热门文章
     function hotRender(info){
       that.setData({
         hot:info,
       })
     }
     var loadsum = 0
     loadsum++
    //获取热门数据
     wx.request({
       url: 'http://www.smallapp.cn/article/hot',
       success: function (res) {
         if (res.data) {
           var info = res.data;
           if (info.length != 0) {
             hotRender(info)
           }
         }
       },
       complete:function(){
        loadsum--
        if(!loadsum){
          that.setData({
            remind: ''
          })
        }
       }
     })

    
    //渲染班夫生活
    function liveRender(info){
      var food = info[6]
      var shop = info[5]
      var culture = info[4]
      var fitness = info[3]
      var accommodation = info[2]
      var entertainment = info[1]
      var scenery = info[0]
      info.push(that.data.all)
      that.setData({
        food: food,
        shop: shop,
        culture: culture,
        fitness: fitness,
        accommodation: accommodation,
        entertainment: entertainment,
        scenery: scenery,
      })
      app.saveCache('live', info)
    }
    //获取班夫生活数据
    loadsum++
    wx.request({
      url: 'http://www.smallapp.cn/live/categories',
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            app.saveCache('live', info);
            liveRender(info)
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
    //渲染班夫宝典
    function bookRender(info){
      var book=[]
      for(var i in info){
        var item={}
        item.id=info[i].id
        item.name=info[i].name
        item.color=info[i].color
        book.push(item)
      }
      for (var i in book){
        book[i].en=that.data._book[i]
      }
      console.log(book)
      that.setData({
        book:book
      })
    }
    loadsum++
    //获取班夫宝典数据
    wx.request({
      url: 'http://www.smallapp.cn/know/categories',
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            console.log(info)
            bookRender(info)
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

    //渲染精彩班夫
    function wonderfulRender(info){
      var wonderful = info
      for(var i in info){
        if (!parseInt(info[i].is_theme)){
          wonderful[i].url='../details/content/content?id='+info[i].id
        }else{
          wonderful[i].url = '../details/list/list?id=' + info[i].id + '&title=' + info[i].title + '&img=' + info[i].img
        }
      }
      that.setData({
        wonderful: wonderful,
      })
    }
    
    loadsum++
    //获取精彩班夫数据
    wx.request({
      url: 'http://www.smallapp.cn/article/articles?page=1&size=4',
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            wonderfulRender(info)
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

})