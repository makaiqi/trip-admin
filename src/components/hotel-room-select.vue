<!-- 
  酒店房型快速选择 select 方式
  单选
 -->

<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    clearable
    reserve-keyword
    :placeholder="placeholder"
    :remote-method="loadData"
    :loading="loading"
    :multiple="multiple"
    :disabled='disabled'
    >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.roomCodeDesc"
      :value="item.id">
      <!-- <p>{{ item.hotelName }}</p> -->
      <!-- <p>{{ item.address }}</p> -->
    </el-option>
  </el-select>
</template>

<script type="text/babel">
  export default {
    name: 'hotelRoomSelect',
    props: {
      value: [String, Number, Array],
      placeholder: {
        type: String,
        default: '请选择酒店房型'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      cityId: [String, Number], // 城市id
      multiple: { //是否多选
        type: Boolean,
        default: false
      },
      ind: Number
    },
    data () {
      return {
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
        let data = []
        this.options.filter(item => {
          if(item.id == newValue) {
            data.push(item)
          }
        })
        this.$emit('change', {
          data: data[0] || {},
          ind: this.ind
        })
        this.$emit('input', newValue);
      },
      'cityId' (newValue, oldValue) {
        this.loadData('');
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
        // 获取信息
        // if(!query) return;
        this.$http.get('biz/HotelRoom/list',
          {
            params: {
              search: query,
              cityId: this.cityId,
              paging: false
            }
          }
        ).then(rs => {
          console.log(rs,'000');
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