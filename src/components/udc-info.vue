<!--
	udc 字典
	姓名和电话必须填写
 -->

<template>
  <div :class="['zzu-udc', { 'zzu-udc-check-all': hasCheckAll && type == 'checkbox' }]">

    <template v-if="this.type == 'checkbox'">
      <el-checkbox-group :disabled='disabled' v-model="currentValue" :min="min" :max="max" @change="handleChange">
        <el-checkbox :disabled="item.disabled" v-for="(item, index) in udcDatas" :label="item.udcVal" :key="index">{{item.udcName}}</el-checkbox>
      </el-checkbox-group>

      <el-checkbox class="check-all" v-if="hasCheckAll" :indeterminate="isIndeterminate" v-model="currentCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
    </template>

    <el-radio-group :disabled='disabled' v-else-if="this.type == 'radio'" v-model="currentValue" @change="handleChange">
      <el-radio v-for="(item, index) in udcDatas" :label="item.udcVal" :key="index">{{ item.udcName }}</el-radio>
    </el-radio-group>

    <el-select :disabled='disabled' v-else clearable filterable :multiple="multiple" v-model="currentValue" @change="handleChange" :placeholder="placeholder">
      <el-option
        v-for="(item, index) in udcDatas"
        :key="index"
        :label="item.udcName"
        :value="item.udcVal">
      </el-option>
    </el-select>

    <!--  <el-autocomplete v-else v-model="currentValue" value-key="udcName" :fetch-suggestions="loadData" :placeholder="placeholder" @select="handleChange">
       </el-autocomplete> -->
  </div>

</template>

<script type="text/babel">
  export default {
    name: 'udcCheckbox',
    props: {
      // checkbox: Array;
      // radio: Number || String;
      // select:
      // 	multiple(Array),
      //	Number || String
      // input: String || Number
      min:Number,
      max:Number,
      value: [Array, String, Number],
      udcCode: String,
      type: { // 类型
        type: String,
        default: 'select'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      placeholder: { // select 独有
        type: String,
        default: '请选择'
      },
      multiple: Boolean, // select 独有 select是否多选
      hasCheckAll: Boolean, // checkbox 独有
      checkAll: { // checkbox 独有 是否全选
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: [],
        udcDatas: [],
        currentCheckAll: this.checkAll,
        isIndeterminate: true
      }
    },
    computed: {

    },
    watch: {
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);

        if(this.hasCheckAll && this.type == 'checkbox') {
          let checkedCount = newValue.length;
          this.currentCheckAll = checkedCount === this.udcDatas.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.udcDatas.length;
        }
      },
      'checkAll' (newValue, oldValue) {
        // console.log(newValue)
      }
    },
    mounted () {
      this.fetchData();
      if(this.value) {
        let value = this.value;
        this.$nextTick(() => {
          this.setCurrentValue(value)
        })
      }
    },
    methods: {
      fetchData() {
        // 拉取数据
        let udcCode = this.udcCode;
        this.$http.get('fund/Udc/udcCode?udcCode=' + udcCode
        ).then(rs => {
          if(rs.data.code == 0) {
            let list = [];
            list = rs.data.data.map(item => {
              return Object.assign(item, { disabled: false });
            })
            this.udcDatas = list;
            if (this.udcDatas.length == 6) {
              this.currentValue.push('V001')
              this.currentValue.push('V002')
              this.udcDatas[0].disabled = true
              this.udcDatas[1].disabled = true
            }

            if(this.hasCheckAll && this.type == 'checkbox' && this.checkAll) {
              this.handleCheckAllChange(true)
            }
          } else {
            this.udcDatas = []
          }
        }).catch(this.udcDatas = []);
      },
      loadData (val) {
        // 加载数据
        this.$http.get(''
        ).then(rs => {
          if(rs.data.code == 0) {

          } else {

          }
        })
      },
      setCurrentValue(value) {
        // 设置当前值
        if (value === this.currentValue) return;
        this.currentValue = value;
      },
      handleChange (data) {
        // 数据改变传递给父组件
        this.$emit('change', data);
      },
      handleCheckAllChange (val) {
        // checkbox全选
        if(this.udcDatas.length > 0) {
          let data = [];
          this.udcDatas.map((item, index) => {
            data.push(item.udcVal);
          })
          this.currentValue = val ? data : [];
          this.isIndeterminate = false;
        }
      },
      setDisabled (status) {
        if(status) {
          this.udcDatas.map(item => {
            if(this.currentValue.indexOf(item.udcVal) == -1) {
              item.disabled = true
            }
          })
        } else {
          this.udcDatas.map(item => {
            item.disabled = false
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';

  .zzu-udc {
    position: relative;

    &.zzu-udc-check-all {
      &:first-child {
        padding-left: 70px;
      }
    }
  }

  .check-all {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
  }
</style>
