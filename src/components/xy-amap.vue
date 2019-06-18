<template>
  <div>
    <el-amap vid="amap" :center="center" :amap-manager="amapManager" :zoom="zoom" :events="events" class="amap">
      <!-- <el-amap-marker :position='position'></el-amap-marker> -->
    </el-amap>
  </div>

</template>

<script>
 
  import Vue from 'vue'
  import VueAMap from 'vue-amap'

  const amapManager = new VueAMap.AMapManager()

  export default {
    props: {
      point: {
        type: Object,
        default: () => {
          return {
            lng: 121.59996,
            lat: 31.197646,
            cityName:'北京市',
          }
        }
      }
    },
    name: 'xy-amap',
    data() {
      let that = this;
      return {
        zoom: 10,
        center: [this.point.lng, this.point.lat],
        that: this,
        amapManager,
        position:[0,0],
        marker: new AMap.Marker({
            position: [this.point.lng, this.point.lat]
        }),
        events: {
          
          init(o) {
            // console.log(this.point.cityName);
            if(that.point && that.point.lng){
              that.center = [that.point.lng, that.point.lat];
              that.position = [that.point.lng, that.point.lat];
            }else {
               o.search(that.point.cityName, function(status, result){
                    if(status=='complete'){
                      that.center = [result.districtList[0].center.lng , result.districtList[0].center.lat]; //选城市的时候定位
                      that.position = [result.districtList[0].center.lng , result.districtList[0].center.lat];
                    }
              });
            }
            that.marker.setMap(o);
            that.marker.setDraggable(true);
            that.marker.on('dragend', (e) => {
              // console.log('marker dragend:', e);
              // that.$emit('xy-marker-dragend',  {lng: e.lnglat.lng, lat: e.lnglat.lat})
              that.$emit('xy-point-update', {lng: e.lnglat.lng, lat: e.lnglat.lat})
              that.center=[e.lnglat.lng,e.lnglat.lat];
            })
            o.on('click', that.mapOnClick);
          },
          mapOnClick(e) {
            console.log('map on click ->', e);
            // this.marker.setPosition(new AMap.LngLat(e.lnglat.lng,e.lnglat.lat))
            console.log(`click point on ${e.lnglat.lat}, ${e.lnglat.lng}`)
            that.$emit('xy-click', {lng: e.lnglat.lng, lat: e.lnglat.lat})
          }
        }
      }
    },
    watch:{
      'point':{
        handler(newValue,oldValue){
          if(newValue){
            this.point.lng = newValue.lng;
            this.point.lat = newValue.lat;
            this.point.cityName = newValue.cityName;
            this.center = [newValue.lng, newValue.lat];
            this.position = [newValue.lng, newValue.lat];
            this.marker.setPosition([newValue.lng, newValue.lat]);
          }else{
            this.center = [0, 0];
            this.position = [0, 0];
          }
        },deep:true
      }
    },
    mounted(){
      console.log(this.point,'地图组件接收参数')
    },
    methods: {
      
      add() {
        let o = amapManager.getMap();
        let marker = new AMap.Marker({
          position: [121.59996, 31.177646]
        });
        marker.setMap(o);
      }
    }
  }
</script>

<style scoped>
  .amap {
    height: 400px;
  }
</style>
