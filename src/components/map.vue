<!-- 
	地图组件

	百度地图
 -->

<template>
	<baidu-map 
		:center="center" 
		:zoom="zoom" 
		:scroll-wheel-zoom=true 
		class="bm-view" 
		@ready="handler" 
		@click="mapClick">	
	</baidu-map>
</template>

<script type="text/babel">
	export default {
		name: 'zzuMap',
		props: {
			value: Object
		},
		data () {
			return {
        currentValue: this.value === undefined ? '' : this.value,
				center: {
					lng: 0,
					lat: 0
				},
      	zoom: 3
			}
		},
		watch: {
			'value' (newValue, oldValue) {
				if(newValue.lng) {
	      	this.setCurrentValue(newValue);
				}
	    },
	    'currentValue' (newValue, oldValue) {
	      this.$emit('input', newValue);
	    }
		},
		methods: {
			handler ({BMap, map}) {
	      this.center.lng = this.currentValue.lng || 116.404
	      this.center.lat = this.currentValue.lat || 39.915
	      this.zoom = 15
	    },
			mapClick (type, target, point, pixel, overlay) {
				let data = {};

				if(type && type.point) {				
					data.lng = type.point.lng;
					data.lat = type.point.lat;
				}

				this.setCurrentValue(data);
			},
      setCurrentValue(value) {
        // 设置当前值
        if (value === this.currentValue) return;
        this.currentValue = value;
      }
		}
	}
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';

  .bm-view {
    width: 100%;
    height: 200px;
    // display: none;
  }
</style>
