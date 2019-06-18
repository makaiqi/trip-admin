<template>
	<div class="refund">
		<div class="refund-header">
			<h1>退款列表</h1>
		</div>
		<div class="refund-content">
			<el-input clearable class="refund-content-ipt" v-model="search.nameTel" placeholder="模糊搜索/姓名、手机号"></el-input>
			<zzu-udc v-model="search.refundStatusCode" udc-code="UDC_M03_T24" style="display: inline-block;"></zzu-udc>
			<el-button @click="searchFun()">搜索</el-button>
			<!--<el-button @click="agreedListFun()">批量同意</el-button>
			<el-button @click="refusedListFun()">批量拒绝</el-button>-->
			<div class="refund-table">
				<el-table ref="multipleTable" :data="refund_tableData" border tooltip-effect="dark" max-height="300" style="width: 95%;text-align: center;" class="base-block-table" @selection-change="handleSelectionChange">
					<template v-for="(item,index) in columns">

						<el-table-column v-if="item.key == 'refundTransactionNo'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
						</el-table-column>

						<el-table-column v-else-if="item.key == 'soldQty'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
							<template slot-scope="scope">
								<span>{{scope.row.soldQty}}/{{scope.row.totalQty}}</span>
							</template>
						</el-table-column>

						<el-table-column v-else-if="item.key == 'caozuo'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
							<template slot-scope="scope">
								<!--<span>{{scope.row.refundStatusCode}}</span>-->
								<el-button type="text" @click="detailsFun(scope.row)">查看</el-button><br />
								<div v-if="scope.row.refundStatusCode == 'V001' || scope.row.refundStatusCode == 'V002' || scope.row.refundStatusCode == 'V003' || scope.row.refundStatusCode == 'V004'">
									<el-button type="text" @click="agreedFun(scope.row)">同意</el-button><br />
									<el-button type="text" @click="refusedFun(scope.row)">拒绝</el-button><br />
								</div>
							</template>
						</el-table-column>

						<el-table-column v-else :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
						</el-table-column>

					</template>
				</el-table>
				<!--批量删除-->
				<el-dialog title="提示" :visible.sync="dialogVisibles" width="30%">
					<label for="">拒绝理由：</label>
					<el-input clearable v-model="refusedObj.refundReason" type="textarea" :rows="2"></el-input>
					<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibles = false">取 消</el-button>
			    <el-button type="primary" @click="dialogVisibleFuns()">确 定</el-button>
			  </span>
				</el-dialog>
				<!--拒绝弹出框-->
				<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
					<label for="">拒绝理由：</label>
					<el-input clearable v-model="refusedObj.refundReason" type="textarea" :rows="2"></el-input>
					<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="dialogVisibleFun()">确 定</el-button>
			  </span>
				</el-dialog>

				<el-pagination background @size-change="handlePageSizeChange" @current-change="handlePageCurrentChange" :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import zzuUdc from '@/components/udc'
	export default {
		components: {
			zzuUdc
		},
		data() {
			return {
				refund_tableData: [],

				dialogVisible: false,
				dialogVisibles: false,

				search: {
					refundStatusCode: "",
					nameTel: "",
				},
				orderDomains: [],

				columns: [
				{
						type: "selection",
						width: 55,
						fixed: "left",
					},
					{
						title: '退款编号',
						key: "refundTransactionNo",
						width: 160,
					},
					{
						title: "订单编号",
						key: "orderNo",
						width: 160
					},
					{
						title: "会员姓名",
						key: "memberName",
						width: 160
					},
					{
						title: "支付金额",
						key: "paymentAmt",
						width: 160
					},
					{
						title: "退款金额",
						key: "settlementPrice",
						width: 160
					},
					{
						title: "付款时间",
						key: "paymentTime",
						width: 160
					},
					{
						title: "操作人",
						key: "opUserName",
						width: 160
					},
					{
						title: "退款状态",
						key: "refundStatusCodeDesc",
						width: 160
					},
					{
						title: "操作",
						key: "caozuo",
						fixed: "right",
						width: 110
					}
				],
				page: {
					currentPage: 1,
					pageSizes: this.$appCfg.paginationCfg.pageSizes,
					//					pageSizes:[1,2,3,4],
					pageSize: 30,
					total: 0,
					pageNum: 1,
				},

				refusedID: "",

				refusedObj: {
					id: "",
					refundReason: "",
				},

				agreedList: [],

				refundMoenys: "", //退款金额

			}
		},
		mounted() {
			this.searchFun()
		},
		methods: {
			//搜索
			searchFun() {
				this.$http.get('/store/Order/list', {
					params: {
						search: this.search.nameTel,
						refundStatusCode: this.search.refundStatusCode,
						pageSize: this.page.pageSize,
						pageNum: this.page.pageNum,
					}
				}).then(res => {
					if(res.data.code == 0 || res.data.code==10) {
						let list = res.data.data.rows.filter(item => {
							return !item.isDeleted
						})
						this.refund_tableData = list
						this.page.total = res.data.data.total
					}
				})
			},
			//批量同意
			//			agreedListFun(){
			//				if(this.agreedList.length<1){
			//					this.$notify({
			//	          title: '警告',
			//	          message: '请先选择',
			//	          type: 'warning'
			//	        });
			//				}else{
			//					this.orderDomains = []
			//					this.orderDomains=this.agreedList
			//					const data={
			//						orderDomains:"",
			//					}
			//					data.orderDomains = this.orderDomains
			//					console.log(data)
			//					this.$http.post('/store/Order/refund', data).then(res => {
			//						if(res.data.code == 0){
			//							 this.$confirm('确定同意退款吗?', '提示', {
			//			          confirmButtonText: '确定',
			//			          cancelButtonText: '取消',
			//			          type: 'warning'
			//			       }).then(() => {
			//			          this.$message({
			//			            type: 'success',
			//			            message: '已同意退款!'
			//			          });
			//			        }).catch(() => {
			//			          this.$message({
			//			            type: 'info',
			//			            message: '已取消同意退款'
			//			          });
			//			        });
			//							this.createdFun()
			//						}
			//					})
			//				}
			//
			//			},
			//批量删除
			//			refusedListFun(){
			//				this.dialogVisibles = true
			//			},
			//			dialogVisibleFuns(){
			//				if(this.refusedObj.refundReason != "" && this.agreedList.length<1){
			//					for(let i=0;i<this.agreedList.length;i++){
			//						this.agreedList[i].refundReason = this.refusedObj.refundReason
			//					}
			//					console.log(this.agreedList,'批量删除')
			//					const data={
			//						orderDomains:"",
			//					}
			//					data.orderDomains = this.agreedList
			//					this.$http.post('/store/Order/refund', data).then(res => {
			//	//					console.log(res)
			//						if(res.data.code == 0){
			//							 this.$message({
			//			          showClose: true,
			//			          message: '已拒绝',
			//			          type: 'success'
			//			        });
			//							this.createdFun()
			//							this.dialogVisibles = false
			//						}
			//					})
			//				}else{
			//					this.$notify({
			//	          title: '警告',
			//	          message: '请选择或拒绝理由不能为空',
			//	          type: 'warning'
			//	        });
			//				}
			//
			//			},
			//多选
			handleSelectionChange(val) {
				console.log(val)
				if(val.length > 0) {
					this.refundMoenys = val[0].paymentLogDomain
					this.agreedList = []
					for(let i = 0; i < val.length; i++) {
						//					this.agreedList
						this.agreedList.push({
							id: "",
							refundReason: ""
						})
						this.agreedList[i].id = val[i].id
					}
					console.log(this.agreedList)
				} else {

				}

			},

			//查看
			detailsFun(val) {
				this.$router.push({
					name: 'productDetailsText',
					query: {
						id: val.id
					}
				})
			},
			//同意
			agreedFun(val) {
				const params = {
					id: val.id
				}
				console.log(params)
				this.orderDomains = []
				this.orderDomains.push(params)
				const data = {
					orderDomains: "",
				}
				data.orderDomains = this.orderDomains
				console.log(data)
				this.$confirm('确定同意退款吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http.post('/store/Order/refund', data).then(res => {
						if(res.data.code == 0) {
							this.$message({
								type: 'success',
								message: '已同意退款!'
							});

							this.refundMoeny()

							this.createdFun()
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消同意退款'
					});
				});
			},
			//拒绝
			refusedFun(val) {
				this.refusedID = val.id
				this.dialogVisible = true
			},
			dialogVisibleFun() {
				if(this.refusedObj.refundReason != "") {
					this.refusedObj.id = this.refusedID
					this.orderDomains = []
					this.orderDomains.push(this.refusedObj)
					const data = {
						orderDomains: "",
					}
					data.orderDomains = this.orderDomains
					this.$http.post('/store/Order/refund', data).then(res => {
						//					console.log(res)
						if(res.data.code == 0) {
							this.$message({
								showClose: true,
								message: '已拒绝',
								type: 'success'
							});
							this.createdFun()
							this.dialogVisible = false
						}
					})
				} else {
					this.$notify({
						title: '警告',
						message: '请填写拒绝理由',
						type: 'warning'
					});
				}

			},

			//退款金额函数
			refundMoeny() {
				this.$http.post('biz/Member/refund', this.refundMoenys).then(res => {
					console.log(res)
					if(res.data.code == 0) {
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
					} else {
						this.$message({
							message: res.data.msg,
							type: 'warning'
						});
					}

				})
			},

			//分页函数
			handlePageSizeChange(val) {
				//      this.tableList.query.pageSize = val;
				console.log(val)

			},
			//点击获取页码数
			handlePageCurrentChange(val) {
				var that = this
				this.$http.get('/store/Order/list', {
					params: {
						pageSize: that.page.pageSize,
						pageNum: val,
					}
				}).then(res => {
					console.log(res)
					if(res.data.code == 0) {
						this.refund_tableData = res.data.data.rows
						console.log(this.refund_tableData, 'list')
						this.page.total = res.data.data.total
						for(let i = 0; i < this.refund_tableData.length; i++) {
							if(this.refund_tableData[i].isDeleted = true) {
								this.refund_tableData.splice(i, 1)
							} else {

							}
						}
					}

				})
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
	@import "~@/assets/css/core/index";
	.refund {
		padding: 20px;
		.refund-header {
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #dcdcdc;
			margin-bottom: $padding;
			h1 {
				font-family: 'Open Sans', sans-serif;
				font-weight: 300;
				font-size: 30px;
				color: #4c4d5a;
				display: inline-block;
				margin-bottom: 15px;
				text-shadow: 0 1px #fff;
			}
		}
		.refund-content {
			.refund-content-ipt {
				width: 20%;
			}
			.refund-table {
				margin-top: 20px;
			}
		}
	}
</style>
