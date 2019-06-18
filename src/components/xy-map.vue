<template>
    <div class="amap-page-container">
      <!-- {{msg.lat}}--{{msg.lng}}--{{msg.address}} -->
      <el-amap vid="amapDemo" :plugin="plugin" :zoom="zoom" :center='center' class="amap-demo" :events="events">
        <el-amap-marker vid="marker" :position="makers" ></el-amap-marker>
      </el-amap>
    </div>
  </template>
  <script>
  
  import Vue from 'vue'
  import VueAMap from 'vue-amap'
  VueAMap.initAMapApiLoader({
    key: '47c019a133686563ad5e1ebb71b9f7f2',
    plugin: [
            'Geocoder',     //地址经纬度转换
            'Autocomplete',  //输入提示，提供了根据关键字获得提示信息的功能
            "PlaceSearch", //地点搜索服务，提供了关键字搜索、周边搜索、范围内搜索等功能
            "Scale",       // 比例尺，显示当前地图中心的比例尺
            "OverView",//鹰眼，显示缩略图
            "ToolBar",//工具条，控制地图的缩放、平移等
            "MapType",//图层切换，用于几个常用图层切换显示
            "PolyEditor",//折线、多边形编辑插件
            "CircleEditor",//圆编辑插件
            "Geocoder",//地理编码与逆地理编码服务，提供地址与坐标间的相互转换
            "convertFrom",//非高德坐标进行转换
            "Geolocation",//定位，提供了获取用户当前准确位置、所在城市的方法
            "ElasticMarker",//灵活点标记，可以随着地图级别改变样式和大小的 Marker
            "CitySearch",//城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息,
            "DistrictSearch",//行政区查询
            "Marker",    // 标记点
            "Bounds"   //边界
          ]
  });
export default {
      name: 'GaodeMap',
	    props: {
		    value: Object
		  },
      data () {
        let self = this;
        return {
          resizeEnable: true,
          msg:this.value,
          center:[this.msg.centerLng?this.msg.centerLng:this.msg.lng,this.msg.centerLat?this.msg.centerLat:this.msg.lat],
          zoom: 13,
          makers:[this.msg.lng?this.msg.lng:this.msg.centerLng, this.msg.lat?this.msg.lat:this.msg.centerLat],  //标记点
          // label:{
          //    content:'钦汇园',
          //    offset:[30,12]
          // },
          events: {
            click (e) {
              let { lng, lat } = e.lnglat;
              self.makers=[lng, lat];
              // self.center=[lng, lat];
              self.msg.centerLng = lng;
              self.msg.centerLat = lat;
              self.msg.lat = lat;
              self.msg.lng = lng;
              // 这里通过高德 SDK 完成。
              let geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all",
              });        
              geocoder.getAddress([lng ,lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                    self.msg.address = result.regeocode.formattedAddress;
                    self.$nextTick();
                  }
                }
              });         
            }
          },
          plugin: [
            'ToolBar',
            'Marker',
            {
            pName: 'DistrictSearch', //城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息
            subdistrict: 1,   //返回下一级行政区
            showbiz:false, //最后一级返回街道信息
            events: {
              init(o) { // o 是高德地图定位插件实例
               let city= self.msg.cityName;
                o.search(city, function(status, result){
                  // console.log(result,'111');return;
                    if(status=='complete'){
                      if(self.msg.centerLng&&self.msg.centerLat){
                        self.center = [self.msg.centerLng,self.msg.centerLat]; //选择框选中定位
                      }else{
                        self.center = [result.districtList[0].center.lng , result.districtList[0].center.lat]; //选城市的时候定位
                      }
                  }
              });
              }
            }
          },
          // {
          //   pName:'Bounds',  //边界
          // }
          ]
        }
      },
      watch:{
        // 'value':{
        //   handler: function(newValue, oldValue) {
        //   if(newValue) {
        //     this.center=[this.value.lng?this.value.lng:this.value.centerLng, this.value.lat?this.value.lat:this.value.centerLat];
        //     this.getCenter();
        //   }
        // },
        // deep: true
        // },
        'center':{
          handler:function(newValue,oldValue){
            this.makers=newValue;
            this.center = newValue;
          }
        },
        "msg"(newValue,oldValue){
          console.log(newValue);
        }
      },
      mounted (){
        this.getCenter();
      },
      methods:{
        getCenter(){
          this.center=[this.msg.lng?this.msg.lng:this.msg.centerLng,this.msg.lat?this.msg.lat:this.msg.centerLat];
        }
      }
    };
</script>
 <style>
    .amap-page-container{
      height: 350px;
      width: 350px;
    }

  </style>