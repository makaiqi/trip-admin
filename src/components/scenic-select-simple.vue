<!--
	景点快速选择 select 方式
  单选
 -->

<template>
  <el-select
    class="scenicId"
    v-model="currentValue"
    filterable
    remote
    clearable
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :multiple="multiple"
    :disabled='disabled'
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.scenicName"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'scenicSelect',
    props: {
      value: [String, Number, Array],
      placeholder: {
        type: String,
        default: '请选择景点'
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
        currentValue: this.value === undefined ? [] : this.value,
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
        this.loadData()
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
        this.$http.get('biz/Scenic/findWithCityId',
          {
            params: {
              search: query || '',
              cityId: this.cityId,
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data
            //          this.$emit('baseInfo',rs.data.data)
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
