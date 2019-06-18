<!--套餐-->
<template>
	<div class="packAge">
		<div class="package-content">
			<el-table
		    ref="singleTable"
		    :data="tableData"
		    highlight-current-row
		    @selection-change="handleCurrentChange"
		    border
        stripe
		    style="width: 100%">
		    <el-table-column
		      prop="comboName"
		      label="套餐名称">
		      <template slot-scope="scope">
		      	<el-input v-model="scope.row.skuName" :disabled="disabled"></el-input>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="mktPrice"
		      label="市场价">
		      <template slot-scope="scope">
		      	<el-input-number v-model="scope.row.mktPrice" controls-position="right" :min="0"></el-input-number>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="price"
		      label="套餐价">
		      <template slot-scope="scope">
		      	<el-input-number v-model="scope.row.price" controls-position="right" :min="0"></el-input-number>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="settlementPrice"
		      label="结算价">
		      <template slot-scope="scope">
		      	<el-input-number v-model="scope.row.settlementPrice" controls-position="right" :min="0" :disabled="disabled"></el-input-number>
		      </template>
		    </el-table-column>
        <el-table-column
          label="主图">
          <template slot-scope="scope">
            <zzu-upload list-type="picture" v-model="scope.row.imgList" :limit="1" :disabled="disabled"></zzu-upload>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="remove(scope.row)" :disabled="disabled">删除</el-button>
          </template>
        </el-table-column>
		  </el-table>
		  <el-button type="primary" class="pull-btn" @click="pullBtn()" :disabled="disabled">添加套餐</el-button>
		</div>
	</div>
</template>

<script>
	import upload from '../../test/zzu-upload'
	import zzuUpload from '@/components/upload'
  export default {
  	components: {
			upload,
			zzuUpload
		},
    data() {
      return {
        disabled:false,
        tableData: [{
        	index:0,
        	isDefaultCombo:false,
					qty:0,          //integer    库存数量
					mktPrice:0,      //decimal(20,4)  市场价
					price:0,         //decimal(20,4)  套餐价格
					settlementPrice:0,   //decimal(20,4)  结算价
					skuName:"" , //String(64)   套餐名称
          imgList: [],
          tAssetId: ""
	       }],
	        multipleSelection: null,
					listId:"",
        	listVal:"",
        	tableDataIndex:0
      }
    },
		watch:{
			tableData:{
				handler(val, oldval){
					this.$emit('packList',this.tableData);
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
						console.log(res.data.data.productComboDomainList)
						if(res.data.code==0){
							this.tableData = res.data.data.productComboDomainList
              for (let i=0; i < this.tableData.length; i++) {
							  if (!this.tableData[i].assetDomain) {
                  this.tableData[i].imgList = []
                }
                else {
                  this.tableData[i].imgList = [this.tableData[i].assetDomain]
                }
              }
							this.$emit('packList',this.tableData);
//							console.log(this.tableData,'套餐')
						}else{
							this.tableData=[{
			        	index:0,
			        	isDefaultCombo:false,
								qty:0,          //integer    库存数量
								mktPrice:0,      //decimal(20,4)  市场价
								price:0,         //decimal(20,4)  套餐价格
								settlementPrice:0,   //decimal(20,4)  结算价
								personCommissionPrice:0,  //decimal(20,4) 空中服务商佣金
								storeCommissionPrice:0,  //decimal(20,4) 门店服务商佣金
								branchCommissionPrice:0,  //decimal(20,4) 分公司佣金
								comboName:"",  //String(64)   套餐名称
                imgList: [],
                tAssetId: ""
				       }]
						}

					})
				}
			}
    },
    created(){
    	this.listId = this.$route.query.id
    	this.listVal = this.$route.query.data
      this.disabled = this.$route.query.disabled
    	this.tableData[0].index = this.tableDataIndex
    },
    mounted(){
//  	this.backShare()
    },
    methods: {
      handleCurrentChange(val) {
//       	console.log(val)
//       	for(let i=0;i<this.tableData.length;i++){
//       		this.tableData[i].isDefaultCombo=false
//       	}
//         this.multipleSelection = val;
//         this.multipleSelection.isDefaultCombo=true
// //      console.log(this.multipleSelection)
//         console.log(this.tableData)
      },
      pullBtn(){
      	this.tableDataIndex +=1
      	this.tableData.push({
      		index:this.tableDataIndex,
        	isDefaultCombo:false,
					qty:0,          //integer    库存数量
					mktPrice:0,      //decimal(20,4)  市场价
					price:0,         //decimal(20,4)  套餐价格
					settlementPrice:0,   //decimal(20,4)  结算价
					personCommissionPrice:0,  //decimal(20,4) 空中服务商佣金
					storeCommissionPrice:0,  //decimal(20,4) 门店服务商佣金
					branchCommissionPrice:0,  //decimal(20,4) 分公司佣金
					comboName:"",  //String(64)   套餐名称
          imgList: [],
          tAssetId: ""
	       })
        console.log(this.tableData)
      },
      remove(item) {
        if (this.tableData.length == 1) {
          this.$message({
            type: 'warning',
            message: '请至少加入一个套餐!'
          });
          return
        }
        for (let i=0; i<this.tableData.length; i++) {
          if (this.tableData[i] === item) {
            this.tableData.splice(i ,1)
          }
        }
      }
    }
  }
</script>


<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.packAge{
	padding-top: 20px;
}
.pull-btn{
	float: right;
	margin-top: 20px;
}
</style>
