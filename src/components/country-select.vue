<!--
	城市快速选择 select 方式
  单选
 -->

<template>
  <el-select
    class="cityId"
    v-model="currentValue"
    filterable
    clearable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :disabled='disabled'
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'citySelect',
    props: {
      value: [String, Number],
      placeholder: {
        type: String,
        default: '请选择国家'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      isAbroad: {
        type: String // ''全部， true 国内，false 国外
      },
    },
    data () {
      return {
        backFill: false,
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
        // 获取城市信息
        let url = '/fund/Area/queryCountry',
          params = {
            paging: false,
            search: query,
            level: 1
          };
        this.$http.get(url,
          {
            params: params
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data
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
