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
        type: Number,
        default:'value'
    }
  },
  mounted(){
    // this.$nextTick(() => {
    //       this.setCurrentValue(value)
    //     })
    this.remoteServer()
    console.log(this.currentValue,'currentValue')
  },
  
  data() {
    return {
      list: [],
      value: null,
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
        
        if(newValue){
         this.value = newValue;
        
        }else{
          this.value = null;
        }
      },
      deep:true
    }
  },
  methods:{
      remoteServer(){
          this.$http.get('arch/Menu/list?paging=false', {params:this.query}).then(rs => {
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