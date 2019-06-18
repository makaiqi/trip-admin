<!-- 
	ele 时间选择器封装，补全秒
	只是时分选择补全秒
 -->

<template>
	<el-time-select
	  v-model="currentValue"
	  :picker-options="pickerOptions"
	  :placeholder="placeholder"
		@change="setCurrentValue"
		:disabled="disabled"
		:readonly="readonly"
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
			}
		},
		data () {
			return {
				currentValue: ''
			}
		},
		watch: {
			'value' (newValue, oldValue) {
				if(newValue) {
        	this.setCurrentValue(newValue.substr(0, 5));
				}
      },
      'currentValue' (newValue, oldValue) {
      	if(newValue) {
					this.$emit('input', newValue + ':00');
      	} else {
        	this.$emit('input', '');
      	}
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

