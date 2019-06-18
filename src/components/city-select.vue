<!--
	城市快速选择 select 方式
  单选
 -->

<template>
  <el-select
  	class="cityId"
    v-model="currentValue"
    filterable
    clearable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :disabled='disabled'
    @change="handlerChange"
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
	export default {
		name: 'citySelect',
		props: {
      value: [String, Number],
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
      obtainCityName: {
        type: Boolean,
        default: false // 默认是市级
      }, // 区域等级
      isAbroad: {
        type: String // ''全部， true 国内，false 国外
      },
      pid: [String, Number]  // 父区域id
    },
		data () {
			return {
        backFill: false,
        currentValue: this.value === undefined ? '' : this.value,
        options: [],
        loading: false,
			}
		},
    watch: {
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
        if (newValue && this.obtainCityName) {
          let cityName= '';
          let cityList = this.options.filter((item) => {
            return item.id === newValue
          })
          cityName = cityList[0].name;
          this.$emit('cityName',cityName);
        }
      },
      'pid' (newValue, oldValue) {
        if(newValue) {
          this.loadData({}, true);
        } else {
          this.loadData('')
        }
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
      handlerChange(v){
        this.$emit('xy-change',this.options.filter(x => x.id===v))
      },
			loadData(query, status) {
        // 获取城市信息
        let url = 'fund/Area/list',
            params = {
              level: this.level,
              isAbroad: this.isAbroad || null,
              search: query || '',
              paging: false,
              sort: 'isAbroad',
              isAbroad:false,
              order: 'asc'
            };
        if(this.pid) {
          url = 'fund/Area/findByParentId/' + this.pid ;
          params = {};
        }
        this.$http.get(url,
          {
            params: params
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data;
            if(status) {
              let statusIn = false;
              rs.data.data.map(item => {
                if(item.id == this.value) {
                  statusIn = true
                }
              })
              let id = statusIn ? this.value : rs.data.data[0].id;
              this.setCurrentValue(id);
            }
          } else {
            if(status) {
              this.setCurrentValue('');
            }
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
  .cityId {

    vertical-align: baseline;

}
</style>
