<template>
    <el-select v-model="value" placeholder="商户名称" clearable>
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.storeName"
        :value="item.id">
      </el-option>
    </el-select>
</template>

<script>
  export default {
    name: "seller-chart-input",
    props: {
      id: [Number]
    },
    data() {
      return {
        options: [],
        value: ''
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData () {
        this.$http.get(`/deal/SubStore/list`,
          {
            params: {
              paySubMerchantId: this.id
            }
          }).then(rs => {
          if(rs.data.code === 0) {
            this.options = rs.data.data.rows;
          } else {
            this.options = []
          }
        }).catch();
      },
    },
    watch: {
      'value' (n) {
        this.$emit('changeVal', n);
        console.log(n)
      }
    }
  }
</script>

<style scoped>

</style>
