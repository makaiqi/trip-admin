<template>
  <div>
    <el-input v-model="address" placeholder="请输入地址"></el-input>
    <el-button @click="getPointByAddress">获取坐标</el-button>
  </div>
</template>

<script>
  const ak = '2oWExwugTqH1ISdLCtTIHpSFrxifDcGo'
  let params = {
    ak,
    output: 'json'
  }
  export default {
    name: 'BaiduMap',
    data() {
      return {address: ''}
    },
    methods: {
      getPointByAddress() {
        params.address = this.address
        this.$http.get('http://api.map.baidu.com/geocoder/v2/', {
          params
        }).then(rs => {console.log(rs)})
      }
    }
  }
</script>

<style scoped lang="stylus">
  .map
    width 400px
    height 200px
    overflow hidden
</style>
