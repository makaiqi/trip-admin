<template>
  <chlid title="标题1" content="别荣好不好？" :is-show="true" @select="selectHandler">

  </chlid>
</template>

<script>
  import Chlid from '@/views/test/child'

  export default {
    name: "parent",
    components: {
      Chlid
    },
    methods: {
      selectHandler(data) {
        console.log('select event : ', data)
      }
    }
  }
</script>

<style scoped>

</style>
