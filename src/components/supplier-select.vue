<!-- 
	供应商快速选择 select 方式
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
      :key="item.id"
      :label="item.vendorName"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
	export default {
		name: 'zzuSupplierSelect',
		props: {
      value: [String, Number],
      placeholder: {
        type: String,
        default: '请选择供应商'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      isService: { // 是否服务商
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
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
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
        this.$http.get('biz/Vendor/list',
          {
            params: {
              isService: this.isService,
              search: query,
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