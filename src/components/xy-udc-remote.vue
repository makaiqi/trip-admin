<template>
  <el-select v-model="value" placeholder="请选择景点" @change="changeHandler" filterable clearable >
    <el-option v-for="item in list" :key="item[valueName]" :label="item[labelName]" :value="item[valueName]"></el-option>
  </el-select>
</template>

<script>
export default {
  created() {
      this.remoteServer()
  },
  props: {
    url: {
      type: String,
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
      value: null
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
    }
  },
  methods:{
      remoteServer(){
          this.$http.get(this.url).then(rs => {
              if(rs.data.code) return
              this.list = rs.data.data
          })
      },
      changeHandler(v){
        //   console.log('change -> ',this.list);
          this.$emit('xy-change', this.list.filter(x => x.id === v).map(y => {
              let data = {
              id: y.id, 
              lat : y.centerLat,
              lng : y.centerLng,
              cityId : y.fndCityId,
              scenicName:y.scenicName
              }
              return data
          })[0])
          
      }
  }
};
</script>