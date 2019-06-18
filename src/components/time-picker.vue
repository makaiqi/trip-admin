<!-- 
	ele 时间选择器封装，补全秒
	只是时分选择补全秒
	// 李飞飞 七月二号修改，不不全秒。有影响，通知下。
 -->

<template>
	<el-time-select
	  v-model="currentValue"
	  :picker-options="pickerOptions"
	  :placeholder="placeholder"
		@change="setCurrentValue"
		:disabled="disabled"
		:readonly="readonly"
		:clearable="clearable"
	  >
	</el-time-select>
</template>

<script type="text/babel">
	export default {
		name: 'zzuTimePicker',
		props: {
			value: {
				type: String,
				default: ''
			},
			pickerOptions: {
				type: Object,
				default: {}
			},
			placeholder: {
				type: String,
				default: "选择时间"
			},
			disabled: {
				type: Boolean,
				default: false
			},
			readonly: {
				type: Boolean,
				default: false
			},
			clearable: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				currentValue: this.value || ''
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
      setCurrentValue(value) {
        // 设置当前值
        if (value === this.currentValue) return;
        this.currentValue = value;
      }
		}
	}
</script>