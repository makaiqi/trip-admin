<template>
  <div @click="sendEvent">
    <h1>{{title}}</h1>
    <hr/>
    <p>{{content}}</p>
    <p v-if="isShow"> show hello</p>
  </div>
</template>

<script>
  let con

  export default {
    name: "child",
    props: {
      title: String,
      content: String,
      isShow: {
        type: Boolean,
        default: false
      }
    },
    created() {
      con = this.isShow
      console.log(this.isShow,this.title,this.content)
    },
    data() {
      return {
        showType: con,
        word: 'hhhhhh'
      }
    },
    methods: {
      sendEvent() {
        this.$emit('select', {title: this.title, stat: this.showType, word: this.word})
      }
    }
  }
</script>

<style scoped>

</style>
