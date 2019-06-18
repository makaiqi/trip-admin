<!--
	景点信息增删改查
 -->

<template>
  <div class="dt">
    <div class="amap-page-container">
      <el-amap
        vid="amap"
        :plugin="plugin"
        class="amap-demo"
        :center="center"
        :zoom="zoom"
        :events="events"
      >
        <!-- 点击显示标记 -->
        <el-amap-marker
          v-for="(marker, index) in markers"
          :key="marker.index"
          :position="marker.position"
          :icon="marker.icon"
          :title="marker.title"
          :events="marker.events"
          :visible="marker.visible"
          :draggable="marker.draggable"
          :vid="index"
        ></el-amap-marker>
        <!-- 显示的圆覆盖圈 -->
        <el-amap-circle
          v-for="circle in circles"
          :key="circle.index"
          fillColor="#dae6f0"
          strokeOpacity="0"
          strokeColor="#000"
          :center="circle.center"
          :radius="circle.radius"
          :fill-opacity="circle.fillOpacity"
          :events="circle.events"
        ></el-amap-circle>
      </el-amap>
      <div class="toolbar">
           position: [{{ lng }}, {{ lat }}] address: {{ address }}
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import Vue from "vue";
import VueAMap from "vue-amap";
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: "47c019a133686563ad5e1ebb71b9f7f2",
  plugin: [
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.PolyEditor",
    "AMap.CircleEditor"
  ],
  v: "1.4.4"
});
export default {
  name: "userList",

  data() {
    return {
      qaqqq: [],
      address: "", // 地图缩放
      zoom: 14, // 初始中心
      center: [114.406539, 30.492921],
      lng: 0,
      lat: 0,
      loaded: false, // 点击显示的标记默认的定位
      markers: [
        {
          position: [114.406539, 30.492921]
        }
      ], // 圆覆盖圈
      circles: [
        {
          center: [114.406539, 30.492921],
          radius: 100,
          fillOpacity: 0.5,
          events: {
            click: () => {
              // alert('click');
            }
          }
        }
      ], //  定位
      plugin: [
        {
          pName: "Geolocation",
          events: {
            click(e) {
              // alert(1)
            },
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat; // 初始定位地图中心位置
                  self.center = [self.lng, self.lat]; // 初始定位圆的位置
                  self.circles[0].center = [self.lng, self.lat]; // 初始定位标记的位置
                  self.markers[0].position = [self.lng, self.lat];
                  console.log(self.circles[0].center);
                  console.log(self.center);
                  self.loaded = true; // 这里通过高德 SDK 完成。

                  var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                  });
                  geocoder.getAddress([self.lng, self.lat], function(
                    status,
                    result
                  ) {
                    if (status === "complete" && result.info === "OK") {
                      if (result && result.regeocode) {
                        self.address = result.regeocode.formattedAddress;
                        self.$nextTick();
                      }
                    }
                  });

                  self.$nextTick();
                }
              });
            }
          }
        }
      ], // 点击显示标记
      events: {
        click(e) {
          // alert(1)
          console.log(e);
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat; // 点击显示标记后显示圆的覆盖圈
          self.$nextTick(() => {
            console.log(self.circles[0].center);
            self.circles[0].center.shift();
            self.circles[0].center.pop();
            self.circles[0].center.push(self.lng);
            self.circles[0].center.push(self.lat); // self.circles[0].center[0] = self.lng // self.circles[0].center[1] = self.lat
            console.log(self.circles[0].center);
            self.qaqqq.push("a");
          });

          self.markers = [
            {
              position: [self.lng, self.lat],
              icon: "",
              title: "",
              events: {
                click(o) {
                  // console.log(o)
                }
              }
            }
          ]; // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      }
    };
  }
};
</script>

<style lang="scss">
</style>
