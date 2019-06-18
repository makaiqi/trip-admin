<template>
  <zzu-upload v-model="fileList2" list-type="picture-card"></zzu-upload>
</template>

<script type="text/babel">
  import zzuUpload from '@/components/upload';

  export default {
    name: "upload",
    components: {
      zzuUpload
    },
    data() {
      return {
        fileList2: []
      }
    },
    watch: {
      fileList2 (newValue, oldValue) {
        console.log('fileList2', newValue)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .box-card
    width 600px
    margin 30px

</style>
