var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{

  },

  onLoad:function(){
    // var article = '<div>我是HTML代码</div>';
    // var that = this;
    // WxParse.wxParse('article', 'html', article, that, 5);
    this.getTest()
  },

  //Test页面
  getTest:function(){
    var that=this
    //渲染Test 页面
    function testRender(info){
      var content=info.content
      WxParse.wxParse('content','html',content,that,5)
    }
    //获取test页面数据
    wx.request({
      url: 'http://www.smallapp.cn/place/detail?place_id=1',
      success: function (res) {
        if (res.data) {
          var info = res.data;
          if (info.length != 0) {
            
            testRender(info)
          }else{
            console.log('暂无数据!')
          }
        }
      }
    })
  }
})