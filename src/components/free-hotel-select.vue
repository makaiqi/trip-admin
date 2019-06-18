<!--
  酒店快速选择 select 方式
  单选
 -->

<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    reserve-keyword
    clearable
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :disabled='disabled'
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.hotelName"
      :value="item">
      <p>{{ item.hotelName }}</p>
      <p>{{ item.address }}</p>
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'hotelSelect',
    props: {
      value: [String, Object, Number],
      placeholder: {
        type: String,
        default: '请选择酒店'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      cityId: [String, Number] // 城市id
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
        console.log(newValue)
        // this.$emit('change', )
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
        this.$http.get('biz/Hotel/list',
          {
            params: {
              search: query,
              cityId: this.cityId,
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
