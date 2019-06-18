<!--电商待结算-->
<template>
	<div class="stay-settlement">
		<div class="stay-settlement-list-header">
			<h1>待结算列表</h1>
		</div>
		<div class="stay-settlement-list-con">
			<el-button @click="reqSettlementFun()">申请结算</el-button>
			<el-button @click="blackFun()">返回</el-button>
			<el-table
		    ref="multipleTable"
		    :data="tableDataStay"
		    tooltip-effect="dark"
		    border
		    @selection-change="handleSelectionChange"
		    style="width: 100%;margin-top: 10px;">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		    	prop="orderNo"
		      label="订单编号">
		    </el-table-column>
		    <el-table-column
		      prop="tvendor"
		      label="供应商">
		    </el-table-column>
		    <el-table-column
		      prop="productName"
		      label="产品名称">
		    </el-table-column>
		    <el-table-column
		      prop="settlementPrice"
		      label="结算价格">
		    </el-table-column>
		    <el-table-column
		      prop="memberName"
		      label="会员姓名">
		    </el-table-column>
		    <el-table-column
		      prop="orderSourceCodeDesc"
		      label="订单来源">
		    </el-table-column>
		    <el-table-column
		      prop="beginTime"
		      label="申请日期">
		    </el-table-column>
		    <el-table-column
		      prop="settlementStatusCodeDesc"
		      label="结算状态">
		    </el-table-column>
		  </el-table>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				tableDataStay:[],
				reqSettlementList:{
					settlementAmt:0,
					eccOrders:[]
				}
			}
		},
		mounted(){
			this.createdFun()
		},
		methods:{
			createdFun(){
				this.$http.get('/store/Order/list', {
					params:{
						settlementStatusCode:'V001'
					}
				}).then(res => {
					console.log(res,'res')
					if(res.data.code == 0){
						this.tableDataStay = res.data.data.rows
						for(let i=0;i<this.tableDataStay.length;i++){
							if(this.tableDataStay[i].isDeleted == true){
								this.tableDataStay.splice(i,1)
							}else{

							}
						}
					}
				})
			},
			//申请结算
			reqSettlementFun(){


				this.$confirm('确定申请结算吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		      }).then(() => {
			       	this.$http.post('/biz/SettlementInst/saveSettlementOrder', this.reqSettlementList).then(res => {
								console.log(res)
								if(res.data.code == 0){
									this.$message({
				            type: 'success',
				            message: '已发送申请!'
				          });
									this.createdFun()
								}else{
									this.$message({
					          message: res.data.msg,
					          type: 'warning'
					        });
								}
							})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消申请'
		          });
		        });
			},
			blackFun(){
				this.$router.push({name:"electricityOrderList"})
			},

			handleSelectionChange(val) {
//				console.log(val)
				this.reqSettlementList.settlementAmt = 0
				this.reqSettlementList.eccOrders=[]
				for(let i=0;i<val.length;i++){
					this.reqSettlementList.eccOrders.push({
						id:val[i].id,
						orderNo:val[i].orderNo,
						orderType:val[i].orderType
					})
					this.reqSettlementList.settlementAmt += val[i].settlementPrice
				}
				console.log(this.reqSettlementList)
      }
		},
	}
</script>

<style lang="scss" scoped="scoped">
	@import "~@/assets/css/core/index";
	.stay-settlement{
		padding: $padding;
		.stay-settlement-list-header{
			display: flex;
			justify-content: space-between;
			border-bottom:1px solid #dcdcdc;
			margin-bottom: $padding;
			h1{
				font-family: 'Open Sans', sans-serif;
		    font-weight: 300;
		    font-size: 30px;
		    color: #4c4d5a;
		    display: inline-block;
		    margin-bottom: 15px;
		    text-shadow: 0 1px #fff;
			}
		}
	}
</style>
