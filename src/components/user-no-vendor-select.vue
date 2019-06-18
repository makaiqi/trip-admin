<!--
	城市快速选择 select 方式
  单选
 -->

<template>
  <el-select
    class="sysUserId"
    v-model="currentValue"
    filterable
    clearable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.userName"
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
        default: '请选择用户'
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
        loading: false
      }
    },
    watch: {
      'value' (newValue, oldValue) {
        // this.getCity();
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.loadData();
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
      loadData(query) {
        // if(!query) return;
        this.$http.get('arch/User/findUnlessUser',
          {
            params: {
              search: query,
              paging: false
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data
            let val = []
            this.options.forEach(item => {
              val.push(item.id)
            })
            this.$emit('userCodeList', val);
            console.log(val)
          } else {
            this.options = []
          }
        }).catch(this.options = []);
      },
      getCity () {
        this.$http.get('arch/User/findById',
          {
            params: {
              id: this.value
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
             this.options = rs.data.data
          } else {
            // this.options = []
          }
        });
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
