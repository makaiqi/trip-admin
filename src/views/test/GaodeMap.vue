<template>
    <div class="amap-page-container">
      <el-amap
        vid="amapDemo"  
        :center="center"
        :zoom="zoom"  
        class="amap-demo"
        :events="events">
      </el-amap>
      <div class="toolbar">
        position: [{{ lng }}, {{ lat }}] address: {{ address }}
      </div>
    </div>
  </template>
  <script>
  
  import Vue from 'vue'
  import VueAMap from 'vue-amap'
  VueAMap.initAMapApiLoader({
    key: 'YOUR_CODE',
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
            "convertFrom",
            "Geolocation",//定位，提供了获取用户当前准确位置、所在城市的方法
            "ElasticMarker",//灵活点标记，可以随着地图级别改变样式和大小的 Marker
            "CitySearch",//城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息
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
          zoom: 12,
          center: [121.59996, 31.197646],
          lng: 0,
          lat: 0,
          address:'',
          
          events: {
            click (e) {
              let { lng, lat } = e.lnglat;
              self.lng = lng;
              self.lat = lat;

              // 这里通过高德 SDK 完成。
              var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all",
              });        
              geocoder.getAddress([lng ,lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                    self.address = result.regeocode.formattedAddress;
                    self.$nextTick();
                  }
                }
              });        
            }
          },
          plugin: [{
            pName: 'Geolocation',
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  console.log(result);
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat];
                    self.loaded = true;
                    self.$nextTick();
                  }
                });
              }
            }
          }]


        }
      }
    };
</script>
 <style>
    .amap-page-container {
      height: 400px;
      width: 400px;
    }
  </style>