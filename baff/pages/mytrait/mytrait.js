
//获取应用实例
var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    mytrait:[
      {
        id:1,
        title:'明尼旺卡湖',
        img:'../../image/w_rose.png',
      },
      {
        id: 2,
        title: '哥伦比亚平原',
        img: '../../image/w_columbia.png',
      },
      {
        id: 3,
        title: '阳光村滑雪场',
        img: '../../image/w_banfuTown.png',
      },
    ],
    reached:[
      {
        id:1,
        title:'班夫温泉城堡酒店',
        img: '../../image/w_rose.png',
        date:"2017.5.18"
      },
      {
        id: 2,
        title: '露易丝湖酒店',
        img: '../../image/w_banfuTown.png',
        date: "2017.5.18"
      },
      {
        id: 3,
        title: '哥伦比亚酒店',
        img: '../../image/w_columbia.png',
        date: "2017.5.20"
      }
    ],

   
  },
  onLoad: function () {
    var that = this;

    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },

  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  }, 
  
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  skip:function(){
    wx.navigateTo({
      url: '../test/test',
    })
  },

  delete:function(e){
    var that=this
    var id=parseInt(e.target.id)
    var mytrait=this.data.mytrait
    wx.showModal({
      content: '您确定要将此景点移除您的行程吗？',
      success:function(res){
        if (res.confirm){
          for (var i in mytrait) {
            if (id === mytrait[i].id) {
              mytrait.splice(i, 1)
              break
            }
          }
          that.setData({
            mytrait: mytrait
          })
        } 
      }
    })
    
  }
})
