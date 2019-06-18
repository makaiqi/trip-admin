<!--常规-->
<template>
	<div class="conventional">
		<div class="conventional-content">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" :disabled="disabled">

				<el-form-item prop="tblScenicId" label="选择景点">
              <xyUdcRemote
              v-model="ruleForm.tblScenicId"
              :currentValue="ruleForm.tblScenicId"
              @xy-change="scenicChangeHandler"
              url="biz/Scenic/findWithCondition"
              labelName="scenicName"
              valueName="id"
              placeholder="请选择景点"
              ></xyUdcRemote>
        </el-form-item>
				<el-form-item label="选择项目" prop="tableName" v-if="ruleForm.tblScenicId">
            <el-select v-model="ruleForm.tableName" placeholder="请选择" clearable >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
				<el-form-item label="选择点位" prop="ScenicPoint" v-if="ruleForm.tblScenicId && ruleForm.tableName">
            <xyPointSelect 
                    :form='ruleForm'
                    :currentValue="ruleForm.tblScenicPointId" 
                    labelName="itemName" 
                    valueName="pointId"
                    @xy-change="pointChangeHandler"
                    placeholder='请选择项目点位'>
            </xyPointSelect>
          </el-form-item>
			  <el-form-item label="商品名称" prop="sknName">
			    <el-input v-model="ruleForm.sknName"></el-input>
			  </el-form-item>	 
				<el-form-item label="是否上架">
			  	<el-switch
             v-model="ruleForm.isOnline"
             active-text="是"
             inactive-text="否">
           </el-switch>
			  </el-form-item>
				<el-form-item label="商品简述">
			    <el-input v-model="ruleForm.summary"></el-input>
			  </el-form-item>	 
			  <el-form-item label="商品详情">
			  	<zzu-rich-text v-model="ruleForm.content" :enabled="!disabled"></zzu-rich-text>
			  </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import zzuRichText from '@/components/rich-text'
	import zzuCitySelect from '@/components/city-select'
	import zzuUdc from '@/components/udc'
	import zzuUpload from '@/components/upload'
	import zzuTagList from '@/components/tag-list'
	import xyPointSelect from "@/components/xy-point-select";
	import xyUdcRemote from "@/components/xy-udc-remote";
	export default {
		components: {
			zzuRichText,
			zzuCitySelect,
			zzuUdc,
			zzuUpload,
			zzuTagList,
			xyPointSelect,
			xyUdcRemote,
		},
    data() {
      return {
				options: [
        {
          value: "TBL_HOTEL",
          label: "酒店"
        },
        {
          value: "TBL_RESTAURANT",
          label: "餐厅"
        },
        {
          value: "TBL_FUN",
          label: "游玩"
        },
        {
          value: "TBL_STORE",
          label: "门店"
        }
      ],
        ruleForm: {
          disabled: false,
        	id:"",
					sknName: "", //商品名称
					scenicId:null,
          keywords:"",
					content:"",  //详情
					summary:'',   //描述
					isOnline:false,  //是否上架
					tblScenicPointId:null,//标记点位id
					tblScenicId:null, //景点id
					tableName:'',
          // highlightTagCode:"",
          // apprStatusCode:"",
					// onlineStatusCode:"",
          // deliveryAddressId:"",
          // lng:0,
          // lat:0,
          // shortAddress:"短地址",
          // deliveryCityName:"",
          // tagDomainList:[],
        },
        highlightTagCodeList:"",
        rules: {
          sknName: [
            { required: true, message: '商品名称	必须介于3-255字符之间', trigger: 'blur' },
					],
					tblScenicId: [
            { required: true, message: '请选择景点', trigger: 'blur' },
          ],
        },
        listId:"",
        listVal:"",
      }
    },
    watch:{
		  'ruleForm.isLocalProd' (newval, oldval) {
		    if (!newval) {
		      this.ruleForm.deliveryAddressName = ''
        }
      },
			ruleForm:{
				handler(newValue, oldValue){
					 if(newValue.tblScenicId){
            this.ruleForm.scenicId = newValue.tblScenicId;
            this.ruleForm.pointId = newValue.tblScenicPointId;
         }  
         if(newValue.tableName){
            this.ruleForm.tableName = newValue.tableName;
        }
					this.$emit('conList',this.ruleForm);
				},
				deep:true
			},
			listId (newval,oldval) {
				if(newval!=""){
					var that= this
					this.$http.get('/biz/GoodsSkn/findById', {
						params : { //请求参数
				      id:newval
				    }
					}).then(res => {
						console.log(res,'常规dcmjsn')
						if(res.data.code==0){
							this.ruleForm.id = res.data.data.id
							this.ruleForm.prodName = res.data.data.prodName
							this.ruleForm.keywords = res.data.data.keywords
							this.ruleForm.prodDesc = res.data.data.prodDesc
							this.ruleForm.apprStatusCode = res.data.data.apprStatusCode
							this.ruleForm.onlineStatusCode = res.data.data.onlineStatusCode

							this.ruleForm.deliveryCityId = res.data.data.deliveryCityName
							this.ruleForm.deliveryCityName = res.data.data.deliveryCityId
              this.ruleForm.tagDomainList = res.data.data.tagDomainList
							this.ruleForm.deliveryAddressId = res.data.data.deliveryAddressId
							this.ruleForm.deliveryAddressName = res.data.data.deliveryAddressName

							this.highlightTagCodeList = res.data.data.highlightTagCode.split(',')

							this.$emit('conList',this.ruleForm);
//							console.log(this.ruleForm,'常规')
						}

					})
				}
				else{
					return
				}
			},
			'highlightTagCodeList' (newval,oldval) {
				var str = newval.toString()
				this.ruleForm.highlightTagCode = str
			},
    },
    created(){
			//接收编辑ID
			this.listId = this.$route.query.id
      this.disabled = this.$route.query.disabled
		},
    mounted(){
    },
    methods: {
			pointChangeHandler(pointId) {
        if(pointId){
          this.ruleForm.tblScenicPointId = pointId; 
        }else{
          this.ruleForm.tblScenicPointId = null;
        }
			},
			scenicChangeHandler(list) {
				if(list){
					console.log(list,'list');
						this.ruleForm.tblScenicId = list.id;
				}else{
					this.ruleForm.tblScenicId = null;
				}
      },
    }
  }
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.conventional{
	padding-top: 20px;
	/*padding-left: 50px;*/
}

</style>
