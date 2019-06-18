<template>
  <el-select 
     v-model="value"
     placeholder="请选择菜单" 
     @change="changeHandler" 
     filterable 
     clearable 
     :multiple = 'multiple'
  >
    <el-option 
        v-for="item in list" 
        :key="item[valueName]" 
        :label="item[labelName]" 
        :value="item[valueName]"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    labelName:{
        type: String,
        default:'label'
    },
    valueName:{
        type: String,
        default:'value'
    },
    multiple:{
        type: Boolean,
        default:false
    },
    currentValue:{
        type: Array,
        default:'value'
    },
    url: {
      type: String,
      required: true
    },
    params:{
      type: Object,
      default:'query'
    }
  },
  mounted(){

    this.remoteServer()
    console.log(this.currentValue,'currentValue')
  },
  
  data() {
    return {
      list: [],
      value: [],
      query: {
            pageNum: 1, // 第几页
            pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
            sort: 'id', // 主表字段名称
            order: 'desc', // 正序还是倒序
            search: '',
            menuTypeCode:'V002',
          },
    };
  },
  watch:{
    'currentValue':{
      handler(newValue,oldValue){ 
        console.log(newValue,'菜单id');
         this.value = newValue || [];
      },
      deep:true
    }
  },
  methods:{
      remoteServer(){
          this.$http.get(this.url, {params:this.params}).then(rs => {
              if(rs.data.code) return
              this.list = rs.data.data
          })
      },
      changeHandler(v){
          this.$emit('xy-change',v)
      }
  }
};
</script>