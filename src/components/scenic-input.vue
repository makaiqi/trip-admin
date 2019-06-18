<!-- 
	景点快速选择 input方式
  单选
  可模糊查询
 -->

<template>
  <el-autocomplete
    v-model="currentValue"
    value-key="name"
    :disabled="disabled"
    :fetch-suggestions="loadData"
    :placeholder="placeholder"
    @select="handleSelect"
  ></el-autocomplete>
</template>

<script type="text/babel">
	export default {
		name: 'scenicInput',
		props: {
      value: [String, Number],
      placeholder: {
        type: String,
        default: '请输入城市名'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      cityId: String // 城市Id
    },
		data () {
			return {
        currentValue: this.value === undefined ? '' : this.value,
				citySelect: {
          value: "",
          list: [],
          timeout: null
        }
			}
		},
    watch: {
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
      }
    },
		methods: {
			loadData(queryString, cb) {
        // 获取城市信息
        this.$http.get(`biz/Scenic/list`, 
          {
            params: {
              search: queryString,
              cityId: this.cityId,
              paging: false
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            cb(rs.data.data)
          } else {
            cb([]);
          }
        }).catch(cb([]));
      },
      handleSelect(item) {
        // 区域选中后的操作
        this.$emit('input', this.value);
        this.$emit('handle-select', item);
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