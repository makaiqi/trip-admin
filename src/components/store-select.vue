<!-- 
  商品快速选择 select 方式
  单选、多选
 -->

<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :multiple="multiple"
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.prodName"
      :value="item.id">
      <p>{{ item.prodName }}</p>
      <!-- <p>{{ item.address }}</p> -->
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'storeSelect',
    props: {
      value: [String, Number, Array],
      placeholder: {
        type: String,
        default: '请选择商品'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      cityId: [String, Number], // 城市id
      multiple: Boolean, //是否多选
    },
    data () {
      return {
        currentValue: this.value === undefined ? '' : this.value,
        options: [],
        loading: false
      }
    },
    watch: {
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
      },
      'cityId' (newValue, oldValue) {
        this.loadData('');
      }
    },
    mounted () {
      this.loadData();
      if(this.value) {
        let value = this.value;
        this.$nextTick(() => {
          this.setCurrentValue(value)
        })
      }
    },
    methods: {
      loadData(query) {
        // 获取信息
        // if(!query) return;
        this.$http.get('store/Product/list',
          {
            params: {
              search: query,
              yieldlyId: this.cityId,
              paging: false
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data
          } else {
            this.options = []
          }
        }).catch(this.options = []);
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
</style>