<!--
  票种快速选择 select 方式
  单选
 -->

<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :disabled='disabled'
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.ticketName"
      :value="item.id">
      <p>{{ item.ticketName }}</p>
      <p>{{ item.address }}</p>
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'hotelSelect',
    props: {
      value: [String, Number],
      placeholder: {
        type: String,
        default: '请选择酒店'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      update: [String, Number],
      scenicId: [String, Number] // 城市id
    },
    data () {
      return {
        currentValue: this.value === undefined ? '' : this.value,
        options: [],
        loading: false
      }
    },
    watch: {
      'update' (newVal,oldVal) {
        if (newVal) {
          this.loadData()
        }
      },
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
      },
      'scenicId' (newValue, oldValue) {
        if (newValue == '') {
          this.currentValue= ''
          this.options=[]
        } else {
          this.loadData()
        }
        if (oldValue != '') {
          this.currentValue=''
          this.options=[]
        }
      }
    },
    methods: {
      loadData(query) {
        // 获取信息
        this.$http.get('biz/TicketType/list',
          {
            params: {
              search: query || '',
              tScenicId: this.scenicId,
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
