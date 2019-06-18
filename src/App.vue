<template>
  <router-view/>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {}
    },
    mounted(){
			scrollTo(0,0);
	 	},
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index', '~@/assets/css/common'
</style>
