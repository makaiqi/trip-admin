<!--
	广告区位名称快速选择 select 方式
  单选
 -->

<template>
  <el-select
    v-model="currentValue"
    filterable
    clearable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
  >
    <el-option
      v-for="item in options"
      :key="item.tContentId"
      :label="item.contentTitle"
      :value="item.tContentId">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'zzuAdTypeSelect',
    props: {
      value: [String, Number],
      placeholder: {
        type: String,
        default: '请选择广告区位名称'
      },
      cityId: [String, Number],
      disabled: {
        type: Boolean,
        default: false
      }
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
      'cityId' (newValue, oldValue) {
        this.loadData(newValue);
        console.log(newValue)
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
        console.log(1)
        this.loadData(this.cityId)
      }
    },
    mounted () {
      this.loadData(this.cityId);
      if(this.value) {
        let value = this.value;
        this.$nextTick(() => {
          this.setCurrentValue(value)
        })
      }
    },
    methods: {
      loadData(query) {
        this.$http.get('biz/AdvertisingInst/findScenicOrArticleByCityIdAndArticleId',
          {
            params: {
              cityId: query,
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
