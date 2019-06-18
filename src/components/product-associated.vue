<template>
  <el-cascader
    v-model="currentValue"
    :options="options"
    filterable
    clearable
    :show-all-levels="false"
    :change-on-select="false"
    :props="props"
  ></el-cascader>
</template>

<script>
export default {
  name: "product-associated",
  props: {
    tTypeIdList: {
      type: Array
    },
    typeCode: {
      type: String,
      default: "V002"
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    'currentValue' (newVal,oldVal) {
      console.log(newVal)
      this.$emit('obtain',newVal)
    },
    'tTypeIdList' (newVal) {
      if (newVal) {
        this.currentValue = newVal
      }
    }
  },
  data () {
    return {
      options: [],
      currentValue: [],
      props: {
        value: 'id',
        label: 'typeName'
      }
    }
  },
  methods: {
    fetchData() {
      this.$http.get('/biz/Type/findTypeTree',{
        params: {
          typeCode: this.typeCode
        }
      }).then(res => {
        console.log(res)
        this.options = res.data.data
      })
    },
    // blur(event) {
    //   console.log(event)
    // }
  }
}
</script>

<style scoped>

</style>
