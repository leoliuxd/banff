//app.js

App({
  cache: {},
  onLaunch: function () {
      var that=this
      //读取缓存
      try{
        var data=wx.getStorageInfoSync()
        if(data && data.keys.length){
          data.keys.forEach(function(key){
            var value=wx.getStorageSync(key)
            if(value){
              that.cache[key]=value
            }
          })
        }
      }catch(e){
      console.log('获取缓存失败')
    }
  },

  //保存缓存
  saveCache:function(key,value){
    if(!key || !value){return;}
    var that=this
    that.cache[key]=value
    wx.setStorage({
      key: key,
      data: value,
    })
  },

  //清除缓存
  removeCache:function(key){
    if(!key){return;}
    var that=this
    that.cache[key]=''
    wx.removeStorage({
      key: key,
    });
  },

  //getUser函数,在index中调用
  getUser:function(){
    var that=this
    wx.showNavigationBarLoading();
    wx.login({
      success:function(res){
        if(res.code){
          //发送code,获取数据
          console.log(res.code)
          wx.request({
            method:'POST',
            url: '',
            data:{
              code:res.code
            },
            success:function(res){
              if(res.data && res.data.status >= 200 && res.data.status < 400){
                //缓存状态
                var status=false
                //data为后台传回的数据
                var data=res.data.data
                //判断缓存是否更新
                if(that.cache.userdata !== data){
                  that.saveCache('userdata',data)
                  status=true
                }
              }else{
                if(that.cache){
                  that.cache = {};
                  wx.clearStorage();
                }
              }
            },
            complete:function(){
              wx.hideNavigationBarLoading();
            },
          })
        }
      }
    })
  },

  

})