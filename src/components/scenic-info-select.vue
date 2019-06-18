<!--
	景点快速选择 select 方式
  单选 返回对象
 -->

<template>
  <el-select
  	class="scenicId"
    v-model="currentValue"
    filterable
    remote
    clearable
    value-key="scenicName"
    :disabled="disabled"
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.scenicName"
      :value="item">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
	export default {
		name: 'scenicInfoSelect',
		props: {
      value: [String, Object, Number],
      placeholder: {
        type: String,
        default: '请选择景点'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      cityId: [String, Number], // 城市id
      disabled:{
         type: Boolean,
        default: false
      }
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
        this.loadData()
        this.$emit('input', newValue);
        this.$emit('select', newValue);
      },
      'cityId' (newValue, oldValue) {
        this.currentValue = ''
        this.options = []
        this.loadData()
      }
    },
		methods: {
			loadData(query) {
        // 获取信息
        this.$http.get('biz/Scenic/list',
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
//          console.log(rs.data.data)
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
	.scenicId{
		margin-bottom: 20px;
	}
</style>
