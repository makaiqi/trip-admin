<!--
	相关产品快速选择 select 方式
  单选
 -->

<template>
  <el-select
  	class="brandId"
    v-model="currentValue"
    filterable
    clearable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    value-key="id"
    >
    <el-option
      v-for="(item,index) in options"
      :key="index"

      :label="item.prodName"
      :value="item">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
	export default {
		name: 'brandSelect',
		props: {
      value: [String, Object, Number],
      placeholder: {
        type: String,
        default: '请选择'
      },
      disabled: {
        type: Boolean,
        default: false
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
//      console.log(newValue)
      }
    },
    mounted () {
		  this.loadData('')
      if(this.value && !this.backFill) {
        this.loadData();
      }
      if(this.value) {
        let value = this.value;
        this.$nextTick(() => {
          this.setCurrentValue(value)
        })
      }
    },
		methods: {
			loadData(query) {
        // 获取品牌信息
        // findByLevelAndNameLike
        this.$http.get('/store/Product/list',
          {
            params: {
              search: query,
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data.rows
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
