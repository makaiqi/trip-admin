<template>
<div>
<el-form
          label-position="top"
          ref="form"
          :model="form"
          :rules="ruleAddOrUpdate"
          label-width="80px"
        >
          <el-form-item label="景点名称" prop="scenicName">
            <el-input clearable v-model="form.scenicName" placeholder="景点名称"></el-input>
          </el-form-item>
          
          <el-form-item label="城市" prop="cityName">
            <zzu-city-select v-model="form.cityName"  placeholder="城市" @xy-change="handlerCityChange"></zzu-city-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input clearable v-model="form.address" placeholder="请输入详细地址或点击地图选址" :city="form.cityName"></el-input>
          </el-form-item>
    
        </el-form>
        <Cart>
            <el-button :disabled="!form.id"></el-button>
        </Cart>
</div>
    
</template>

<script>
const defForm = {
    id:null,
    scenicName:'',
    suggestTime:null,
    cityId:null,
    seq: 100,
    isShoping: true,
    position: {
        id:null
    },
    list:[],
    address: ''
}
export default {
    data(){
        return {
            form: {...defForm}
        }
    },

    methods:{
        resetForm(){
            this.form = {...defForm}
        },
        saveOrUpdate(){
            this.$http('/xxx/saveOrUpdate').then(rs =>{
                if(rs.data.code) return this.$Messsage(rs.data.msg)
                this.form = rs.data.data
            })
        }
    }
}
</script>

