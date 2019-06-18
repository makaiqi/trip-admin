<!-- 
	城市快速选择 select 方式
  单选  返回对象
 -->

<template>
  <el-select
  	class="cityId"
    v-model="currentValue"
    filterable
    clearable
    remote
    reserve-keyword
    value-key="id"
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
	export default {
		name: 'cityInfoSelect',
		props: {
      value: [String , Object , Number],
      placeholder: {
        type: String,
        default: '请选择城市'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      level: {
        type: [String, Number],
        default: 3 // 默认是市级
      }, // 区域等级
      isAbroad: {
        type: String // ''全部， true 国内，false 国外
      },
      id: String  // 父区域id
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
        this.$emit('select', newValue);
      }
    },
    mounted () {
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
        // 获取城市信息
        if(!query) return;
        // findByLevelAndNameLike
        this.$http.get('fund/Area/list',
          {
            params: {
              level: 3,
              isAbroad: this.isAbroad || null,
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
	.cityId{
		margin-bottom: 20px;
	}
</style>