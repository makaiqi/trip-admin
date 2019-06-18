<template>
	<div class="data-type">
		<div class="data-type-content">
			 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" :disabled="disabled">
         <el-form-item label="是否为土特产">
           <el-switch
             v-model="ruleForm.isLocalProd"
             active-text="是"
             inactive-text="否">
           </el-switch>
         </el-form-item>
         <el-form-item label="发货城市" required>
           <zzu-city-select v-model="ruleForm.deliveryCityId"></zzu-city-select>
         </el-form-item>
         <el-form-item label="具体地址" v-if="ruleForm.isLocalProd">
           <el-input v-model="ruleForm.deliveryAddressName" placeholder="请填写具体地址"></el-input>
         </el-form-item>

         <el-form-item label="生产国家" required>
			    <zzu-country-select class="city-select" v-model="ruleForm.yieldlyCountryId"></zzu-country-select>
			  </el-form-item>
         <el-form-item label="生产城市">
			    <zzu-yield-city-select class="city-select" v-model="ruleForm.yieldlyCityId" :countryId="ruleForm.yieldlyCountryId" placeholder="请选择城市"></zzu-yield-city-select>
			  </el-form-item>
			  <div style="margin-bottom: 20px;">
			  	<el-tooltip class="item" effect="dark" content="加入订单时所系最小数量" placement="top">
			      <el-button type="text" class="less-number">最小购买数量 <i class="el-icon-question" style="color: #1E91CF;"></i></el-button>
			    </el-tooltip>
			    <el-input v-model="ruleForm.moq" style="width: 88%;margin-left:110px"></el-input>
			  </div>
			  <el-form-item label="减少库存">
			     <el-select class="reduce-inventory" v-model="ruleForm.isReduceStock" placeholder="请选择">
				    <el-option
				      v-for="item in isReduceStockCities"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				      <span style="float: left">{{ item.label }}</span>
				    </el-option>
				  </el-select>
			  </el-form-item>
			  <div style="margin-bottom: 20px;">
			      <el-button type="text" class="less-number state">缺货时状态 </el-button>
			    <zzu-udc v-model="ruleForm.oosStatusCode" udc-code="UDC_M07_T03" style="display: inline-block;"></zzu-udc>
          <label for="" style="margin-left: 20px;margin-right: 10px;">需要配送</label>
          <el-switch v-model="ruleForm.isShipping"></el-switch>
          <label for="" style="margin-left: 20px;margin-right: 10px;">需要运费</label>
          <el-switch v-model="ruleForm.isIncFreightFee"></el-switch>
          <label for="" style="margin-left: 20px;margin-right: 10px;">是否推荐</label>
          <el-switch v-model="ruleForm.isRecommend"></el-switch>
			  </div>
			  <!--<el-form-item label="需要配送">
			  	<el-radio-group v-model="ruleForm.isShipping">
				    <el-radio :label="true">是</el-radio>
				    <el-radio :label="false">否</el-radio>
				  </el-radio-group>
				  <label for="" style="margin-left: 20px;margin-right: 10px;">需要运费</label>
				  <el-radio-group v-model="ruleForm.isIncFreightFee">
				    <el-radio :label="true">是</el-radio>
				    <el-radio :label="false">否</el-radio>
				  </el-radio-group>
			  </el-form-item>-->
			  <el-form-item label="尺寸（长 x 宽 x 高）">
			  	<el-input class="size-ipt" v-model="ruleForm.depth" placeholder="长"></el-input>
			  	<el-input class="size-ipt" v-model="ruleForm.width" placeholder="宽"></el-input>
			  	<el-input class="size-ipt" v-model="ruleForm.height" placeholder="高"></el-input>
			  </el-form-item>
			  <el-form-item label="尺寸单位">
			  	<zzu-udc v-model="ruleForm.sizeUomCode" udc-code="UDC_M07_T01"></zzu-udc>
			  </el-form-item>
			  <el-form-item label="重量" required>
			  	<el-input v-model="ruleForm.weight" placeholder="重量"></el-input>
			  </el-form-item>
			  <el-form-item label="重量单位" required>
			  	<zzu-udc v-model="ruleForm.weightUomCode" udc-code="UDC_M07_T02"></zzu-udc>
			  </el-form-item>
			  <el-form-item label="排序">
			  	<el-input v-model="ruleForm.seq"></el-input>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import zzuCountrySelect from '@/components/country-select'
	import zzuUdc from '@/components/udc'
  import zzuCitySelect from '@/components/city-select'
  import zzuYieldCitySelect from '@/components/yield-city-select'

  export default {
		components: {
      zzuCountrySelect, zzuCitySelect, zzuUdc, zzuYieldCitySelect
		},
    data() {
      return {
        disabled: false,
        ruleForm: {
          deliveryAddressName:"",
          deliveryCityId: '',
          isLocalProd:false,
          yieldlyIds:"",
          yieldlyCityId: "",
          TyieldlyCityId: "",
          yieldlyCountryId: "",
          moq:1,
          isReduceStock:true,
          oosStatusCode:"V002",
          isShipping:true,
          isIncFreightFee:true,
          isRecommend:false,
          depth:"",
          width:"",
          height:"",
          sizeUomCode:"V001",
          weight:"",
          weightUomCode:"V001",
          seq:"1"
        },
        isReduceStockCities: [{
          value: true,
          label: '是'
        }, {
          value: false,
          label: '否'
        }],
        rules: {

        },
        listId:"",
        listVal:""
      };
    },
    watch:{
			ruleForm:{
				handler(val, oldval){
					this.$emit('dataType',this.ruleForm);
				},
				deep:true
			},
			listId (newval,oldval) {
				if(newval!=""){
					var that= this
					this.$http.get('/store/Product/findById', {
						params : { //请求参数
				      id:newval
				    }
					}).then(res => {
//						console.log(res)
						if(res.data.code==0){
							return new Promise(resolve =>{
                this.ruleForm.sknNo = res.data.data.sknNo
                this.ruleForm.moq = res.data.data.moq
                this.ruleForm.isReduceStock = res.data.data.isReduceStock
                this.ruleForm.oosStatusCode = res.data.data.oosStatusCode
                this.ruleForm.isShipping = res.data.data.isShipping
                this.ruleForm.isIncFreightFee = res.data.data.isIncFreightFee
                this.ruleForm.isRecommend = res.data.data.isRecommend
                this.ruleForm.depth = res.data.data.depth
                this.ruleForm.width = res.data.data.width
                this.ruleForm.height = res.data.data.height
                this.ruleForm.sizeUomCode = res.data.data.sizeUomCode
                this.ruleForm.weight = res.data.data.weight
                this.ruleForm.weightUomCode = res.data.data.weightUomCode
                this.ruleForm.seq = res.data.data.seq
                this.ruleForm.yieldlyIds=res.data.data.yieldlyId
                this.ruleForm.yieldlyCountryId = res.data.data.yieldlyCountryId
                this.ruleForm.TyieldlyCityId = res.data.data.yieldlyCityId
                this.ruleForm.deliveryCityId = res.data.data.deliveryCityId
                this.ruleForm.isLocalProd = res.data.data.isLocalProd
                this.ruleForm.deliveryAddressName = res.data.data.deliveryAddressName
                this.$emit('dataType',this.ruleForm);
                resolve(res.data.data.yieldlyCityId)
              } )
						}
					}).then((yieldlyCityId)=> {
            this.ruleForm.yieldlyCityId = yieldlyCityId
          })
				}
			}
    },
    created(){
    	this.listId = this.$route.query.id
    	this.listVal = this.$route.query.data
      this.disabled = this.$route.query.disabled
    },
    mounted(){
//  	this.backShare()
    },
    methods: {
    	backShare(){
    		this.listId = this.$route.query.id
    		if(this.listId != ""){
    			this.listVal = this.$route.query.data
		    	this.ruleForm = this.listVal
//		    	console.log(this.ruleForm,'数据')
    		}

    	},
    }
  }
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.data-type{
	padding-top: 20px;
}
.city-select{
	width: 100%;
}
.reduce-inventory{
	width: 100%;
}
.less-number{
	margin-left: 25px;
	color: #606266;
	margin-right: 6px;
}
.state{
	margin-left: 36px;
}
.size-ipt{
	width: 30%;
	margin-right: 3%;
}
</style>
