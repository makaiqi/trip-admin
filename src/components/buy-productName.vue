<!--
	限时购产品名称快速选择 select 方式
  单选
 -->

<template>
  <el-select
  	class="scenicId"
    v-model="currentValue"
    filterable
    remote
    clearable
    reserve-keyword
    @change="change"
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :multiple="multiple"
    :disabled='disabled'
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.allName"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/babel">
	export default {
		name: 'scenicSelect',
		props: {
      value: [String, Number, Array],
      placeholder: {
        type: String,
        default: '请选择景点'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      purchaseLimitTableCode: [String, Number],
      onlyPurchaseLimitTableCode: [String, Number], //类型id
      multiple: Boolean, //是否多选
    },
		data () {
			return {
        currentValue: this.value === undefined ? '' : this.value,
        purchaseLimitTableCodeVal: '',
        options: [],
        loading: false,
        dataName:"",
			}
		},
    watch: {
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
//      console.log(newValue)
      },
      'purchaseLimitTableCode' (newValue, oldValue) {
        this.purchaseLimitTableCodeVal = newValue
        this.loadData();
      },
      'purchaseLimitTableCodeVal'(newVal,oldVal) {
        console.log(this.onlyPurchaseLimitTableCode)
        if (newVal == this.onlyPurchaseLimitTableCode) return
        else {
          console.log(1)
          this.currentValue = ''
          this.options = []
          this.loadData();
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
			loadData(query) {
				this.purchaseLimitTableCodeVal = this.purchaseLimitTableCodeVal || "TK_INST"
        // 获取信息
        // if(!query) return;
        let urlData = {
        	TK_INST: {
        		url: '/ticket/Inst/olineList', //门票
        		query: {
        			search: query,
//              purchaseLimitTableCodeVal: "TK_INST",
              paging: false
        		}
        	},
        	FT_COMBO: {
        		url: '/freeTravel/Combo/list', //自由行
        		query: {
        			search: query,
//            purchaseLimitTableCodeVal: "FT_COMBO",
              paging: false
        		}
        	},
        	GT_INST: {
        		url: '/groupTravel/Inst/list', //跟团游
        		query: {
        			search: query,
//              purchaseLimitTableCodeVal: "GT_INST",
              paging: false
        		}
        	},
        	ECC_PRODUCT_COMBO: {
        		url: '/store/ProductCombo/list', //电商
        		query: {
        			search: query,
//              purchaseLimitTableCodeVal: "ECC_PRODUCT_COMBO",
              paging: false
        		}
        	},
        }
//				console.log(this.purchaseLimitTableCodeVal, urlData[this.purchaseLimitTableCodeVal])
//      let urlDatas =
        this.$http.get(urlData[this.purchaseLimitTableCodeVal].url,
          {
            params: urlData[this.purchaseLimitTableCodeVal].query
          }
        ).then(rs => {
          if(rs.data.code == 0) {
          	if(this.purchaseLimitTableCodeVal == 'TK_INST'){
		        	this.options = rs.data.data
		        }else if(this.purchaseLimitTableCodeVal == 'FT_COMBO'){
		        	this.options = rs.data.data
		        }else if(this.purchaseLimitTableCodeVal == 'GT_INST'){
		        	this.options = rs.data.data.rows
		        }else if(this.purchaseLimitTableCodeVal == 'ECC_PRODUCT_COMBO'){
		        	this.options = rs.data.data
		        }

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
      },
      change(val) {
        if (val) {
          let obj = {}
          for (let i=0;i<this.options.length;i++) {
            if (this.options[i].id == val) {
              obj = this.options[i]
            }
          }
          this.$emit('obtainVal',obj.allName)
        }
      }
		}
	}
</script>

<style lang="scss">
	@import '~@/assets/css/core/index';
</style>
