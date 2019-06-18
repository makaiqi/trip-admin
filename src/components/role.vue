<!-- 
	用户角色
 -->

<template>
	<el-select v-model="currentValue"  :multiple="multiple" :placeholder="placeholder">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/javascript">
	export default {
		name: "zzuRole",
		props: {
			value: [Array, Number, String],
			multiple: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: '请选择'
			}
		},
		data () {
			return {
				currentValue: [],	
				roleList: []
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
			this.fetchData();
		},
		methods: {
			fetchData () {
				this.$http.get('arch/Role/list',
          { 
          	params: {
          		paging: false
          	}
         	}
          ).then(rs => {
            if(rs.data.code == 0) {
              this.roleList = rs.data.data;
            } else {
          		this.roleList = [];
            }
          }).catch(() => {
          		this.roleList = [];
            }
          )
			},
      setCurrentValue(value) {
        // 设置当前值
        if (value === this.currentValue) return;
        this.currentValue = value;
      }
		}
	}
</script>