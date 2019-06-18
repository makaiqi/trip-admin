<template>
  <el-select v-model="value" placeholder="请选择点位" @change="changeHandler" filterable clearable >
    <el-option v-for="item in list" :key="item[valueName]" :label="item[labelName]" :value="item[valueName]"></el-option>
  </el-select>
</template>

<script>
export default {
 
  props: {
    form:{
       type: Object,
       required: true
    },
    labelName:{
        type: String,
        default:'label'
    },
    valueName:{
        type: String,
        default:'value'
    },
    currentValue:{
        type: Number,
        default:'value'
    }
  },
  data() {
    return {
      list: [],
      value: null,
      url: '/biz/ScenicPoint/findPoint?tableName='+this.form.tableName+'&scenicId='+this.form.scenicId
    };
  },
  watch:{
    'currentValue':{
      handler(newValue,oldValue){
        if(newValue){
          this.value = newValue;
        }else{
          this.value = null;
        }
      },
      deep:true
    },
    'form':{
      handler(newValue,oldValue){
        if(newValue.tableName && newValue.tblScenicId){
          console.log(111);
         this.url = '/biz/ScenicPoint/findPoint?tableName='+newValue.tableName+'&scenicId='+newValue.scenicId;
         this.remoteServer();
        }else{
          this.url = '';
        }
      },
      deep:true
    }
  },
   mounted() {
      this.remoteServer()
      // console.log(this.currentValue,'333333');
      this.value=this.currentValue;
  },
  methods:{
      remoteServer(){
          this.$http.get(this.url).then(rs => {
              if(rs.data.code) return
              this.list = rs.data.data
          })
      },
      // findByPointId(val){
      //     this.$http.get('/biz/ScenicPoint/findByPointId?pointId='+val).then(rs => {
      //         if(rs.data.code) return
      //         this.list = rs.data.data
      //     })
      // },
      changeHandler(pointId){
          this.$emit('xy-change',pointId)
          
      }
  }
};
</script>