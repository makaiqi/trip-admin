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
      :key="item.tScenicId"
      :label="item.scenicName"
      :value="item.tScenicId">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'zzuAdTypeSelect',
    props: {
      tContentId: [String, Number],
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
        if (!newValue) {
          this.options = []
          this.currentValue = ''
        }
        this.loadData(newValue,this.tContentId);
      },
      'tContentId' (newValue, oldValue) {
        this.loadData();
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
        console.log(newValue)
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
      loadData(city,article) {
        this.$http.get('biz/AdvertisingInst/findScenicOrArticleByCityIdAndArticleId',
          {
            params: {
              cityId: this.cityId,
              tContentId: this.tContentId
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data
            console.log(this.options)
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
