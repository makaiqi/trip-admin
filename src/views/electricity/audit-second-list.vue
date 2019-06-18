<!--电商二审列表-->
<template>
	<div class="ele-auditList">
		<div class="ele-auditList-content">
			<div class="ele-auditList-content-sle">

			</div>

			<el-table
		    :data="tableData"
		    border>
		    <template v-for="(item,index) in columns" >
		    	<el-table-column v-if="item.key == 'id'" :type="item.type" :fixed="item.fixed" :label="item.title" :sortable="item.sortable" :prop="item.key">
          </el-table-column>

          <el-table-column v-else-if="item.key == 'caozuo'" :type="item.type" :fixed="item.fixed" :label="item.title" :sortable="item.sortable" :prop="item.key">
            <template slot-scope="scope">
              <el-button type="text" @click="toViewFun(scope.row)">查看</el-button>
              <!--<el-button type="text" v-if="scope.row.apprStatusCode == 'V002' || scope.row.apprStatusCode == 'V021'" @click="passFun(scope.row)">通过</el-button>-->
              <el-button type="text" v-if="scope.row.apprStatusCode == 'V002' || scope.row.apprStatusCode == 'V021'" @click="notPassFun(scope.row)">驳回</el-button>
            </template>
          </el-table-column>

          <el-table-column v-else :type="item.type" :fixed="item.fixed" :label="item.title" :sortable="item.sortable" :prop="item.key">
          </el-table-column>
		    </template>

		  </el-table>

			 <el-pagination background
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
         </el-pagination>


         <!--驳回意见-->
         <el-dialog
				  title="提示"
				  :visible.sync="dialogVisible"
				  width="30%">
				  <span>审核意见：</span>
				  <el-input clearable type="textarea" v-model="opinoin" :rows="2" placeholder="请输入"></el-input>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="dialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="notPassDialog()">确 定</el-button>
				  </span>
				</el-dialog>
		</div>
	</div>
</template>

<script>
	import zzuUdc from "@/components/udc.vue"
	export default {
		components: {
			zzuUdc,
		},
		data(){
			return {
				apprStausCodeDesc:"",
				tableData: [],

				dialogVisible:false,
				notPassID:"",
				opinoin:"",

        columns:[
      		{
      			title:'编号ID',
      			key:"id",
      		},
          {
            title: "产品基本信息",
            key: "prodName",
          },
          {
            title: "审核状态",
            key: "apprStatusCodeDesc",
          },
          {
            title: "上线状态",
            key: "onlineStatusCodeDesc",
          },
          {
            title: "操作",
            key: "caozuo",
          }
        ],
         //分页字段
        page: {
          currentPage: 1,
          pageSizes: this.$appCfg.paginationCfg.pageSizes,
          pageSize: 30,
          total:0,
          pageNum:1,
        },
        params:"",
			}
		},
		created(){
    	this.createdFun()
		},
    watch : {
      'page' :{
        handler () {
          this.createdFun()
        },
        deep: true
      }
    },
		methods:{
			//初始化数据渲染
			createdFun(){
				var that=this
				this.$http.get('/store/Product/aduitList', {
					params:{
	      			pageSize:that.page.pageSize,
	      			pageNum:that.page.pageNum,
	      			apprStatusCode:"V021"
	      		}
				}).then(response => {
				    //请求正确时执行的代码
				   if(response.data.code==0){
				   	this.tableData=response.data.data.rows
             console.log(this.tableData)
				   	this.page.total=response.data.data.total
				   }
				}).catch(function(response){
				    console.log(response);//发生错误时执行的代码
				})
			},

			//查询
			queryFun(){
				var that = this
				this.$http.get('/store/Product/aduitList' ,{
					params:{
						apprStatusCode:"V021"
//						apprStatusCode:that.apprStausCodeDesc
					}
				}).then(res => {
					if(res.data.code == 0){
						this.tableData=res.data.data.rows
				   	this.page.total=res.data.data.total
					}
				})
			},

//			hanshu(){
//				this.$http.post('/store/Product/approval', {
//						params:{
//							id:val.id,
//							isPass:true,
//							opinion:"",
//						}
//					}).then(res => {
//						if(res.data.code == 0){
//							this.createdFun()
//						}
//					})
//			},
			//通过
			passFun(val){

				this.$confirm('确定通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
	      }).then(() => {
	      	const params={
								id:val.id,
								isPass:true,
								opinion:"",
							}
//	      	console.log(params)
	      	this.$http.post('/store/Product/approval', params).then(res => {
//							console.log(res)
							if(res.data.code == 0){
								this.$message({
			            type: 'success',
			            message: '审核通过!'
			          });

								this.createdFun()
							}
						})


	        }).catch(() => {
	          this.$message({
	            type: 'info',
	            message: '取消审核'
	          });
	        });
			},
			//驳回
			notPassFun(val){
				this.dialogVisible=true
				this.notPassID = val.id
			},
			notPassDialog(){

				if(this.opinoin == ""){
					this.$message({
	          message: '请填写审核意见！',
	          type: 'warning'
	       });
				}else{
					const params={
								id:this.notPassID,
								isPass:false,
								opinion:this.opinoin,
						}
	      	this.$http.post('/store/Product/approval', params).then(res => {
//							console.log(res)
							if(res.data.code == 0){
								this.$message({
			            type: 'success',
			            message: '已驳回!'
			          });
								this.dialogVisible=false

								this.tableData.forEach( (item, index) => {
								  if (item.id == this.notPassID) {
								    this.tableData.splice(index, 1)
                  }
                })
                console.log(this.tableData)
							}
						})
				}
			},
			toViewFun(val){
        this.$router.push({name:'productAdd' , query:{id:val.id, data:val,disabled:true,index:2}})
			},

			//分页函数
      handlePageSizeChange(val) {
        this.page.pageSize = val;
      },
      //点击获取页码数
      handlePageCurrentChange(val) {

      	this.page.pageNum=val
      	var that=this
	    	this.$http.get('/store/Product/list', {
	    		params:{
	      			pageSize:that.page.pageSize,
	      			pageNum:that.page.pageNum,
	      			apprStatusCode:"V002"
	      		}
	    	}).then(response => {
				    //请求正确时执行的代码
				    this.tableData=response.data.data.rows
				    that.page.total=response.data.data.total
				}).catch(function(response){
				    console.log(response);//发生错误时执行的代码
				})
      },

		},
	}
</script>

<style lang="scss" scoped="scoped">
	.ele-auditList{
		text-align: center;
	}
	.ele-auditList-content{
		width: 95%;
		display: inline-block;
		text-align: left;
		.ele-auditList-content-sle{
			border-bottom: 1px dotted #eee;
			padding-top: 20px;
			padding-bottom: 20px;
			margin-bottom:30px ;
		}
	}
	/*.audit-tr-bg {
	  border: #eaeaea solid 1px;
	  th {
	    border: #eaeaea solid 1px;
	    background-color: #fafafa;
	    text-align: center;
	    padding-top: 10px;
	    padding-bottom: 10px;
	    width: 200px;
	  }
	  td {
	    border: #eaeaea solid 1px;
	    padding: 10px;
	    width: 200px;
	    height: 40px;
	  }
	}*/
</style>
