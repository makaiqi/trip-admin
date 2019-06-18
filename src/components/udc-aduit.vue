<template>
  <el-select  clearable filterable v-model="currentValue">
    <el-option
      v-for="(item, index) in udcDatas"
      :key="index"
      :label="item.udcName"
      :value="item.udcVal">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "udc-aduit",
  data() {
    return {
      udcDatas: [
        {
          udcVal: "V002",
          udcName: "首次审核"
        },{
          udcVal: "V051",
          udcName: "已驳回（二审）"
        }
      ],
      currentValue: ""
    }
  },
  watch: {
    'currentValue'(newVal) {
      this.$emit("query",newVal)
    }
  }
}
</script>

<style scoped>

</style>
