<!--
	广告区位名称快速选择 select 方式
  单选
 -->

<template>
  <div>
    <el-select
      v-model="currentValue"
      filterable
      clearable
      remote
      reserve-keyword
      @change="change"
      :placeholder="placeholder"
      :remote-method="loadData"
      :loading="loading"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.adAreaCodeDesc"
        :value="item.id">
      </el-option>
    </el-select>
    <div v-if="showNmuber" style="color:red">请上传的图片尺寸为{{size.weight}}px宽，{{size.height}}px高</div>
  </div>
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
        loading: false,
        size: {
          height: '',
          weight: '',
        },
        showNmuber: false
			}
		},
    watch: {
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.change(newValue)
        if (!newValue) {
          this.showNmuber = false
        }
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
		  change (val) {
        var tmp
        this.options.forEach(item => {
          if(item.id == val) {
            tmp = item.adAreaCodeDesc
          }
        })
        this.$emit('adAreaCodeDesc', tmp)
        if (val) {
          var now = this.options.filter (item => {
            return item.id == val
          })
          this.size.height = now[0].height
          this.size.weight = now[0].weight
          this.showNmuber = true
          this.$emit('changeSize', this.size)
        }
      },
			loadData(query) {
        this.$http.get('biz/AdvertisingConfig/list',
          {
            params: {
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
