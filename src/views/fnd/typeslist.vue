<template>
  <el-tabs v-model="lists.activeName" @tab-click="Click" class="page-container" tabPosition="left">
    <el-tab-pane v-for="(it, ind) in lists.list" :key="it.name" :label="it.label" :name="it.name">

      <div v-if="it.name == 'eletricity'">
        <classification></classification>
      </div>
      <div v-if="it.name == 'content'">
        <classification typeCode="V003"></classification>
      </div>

    </el-tab-pane>
  </el-tabs>
</template>

<script>
import classification from "@/views/electricity/classification-list"
export default {
  name: "typeslist",
  components: {
    classification
  },
  data () {
    return {
      lists: {
        activeName: "eletricity",
        list: [
          {
            label: "电商类别",
            remark: "",
            name: "eletricity"
          },
          {
            label: "内容文章类别",
            remark: "",
            name: "content"
          }
        ]
      }
    }
  },
  methods :{
    Click () {

    }
  }
}
</script>

<style lang="scss" scope>
  @import "~@/assets/css/core/index";

</style>
