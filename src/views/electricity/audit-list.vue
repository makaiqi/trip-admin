<!--电商一审列表-->
<template>
	<div class="ele-auditList">
		<div class="ele-auditList-content">
			<div class="ele-auditList-content-sle">
				<el-form>
					<el-form-item label="产品审核状态">
            <zzu-udc @query="queryFun"></zzu-udc>
					</el-form-item>
				</el-form>

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
              <el-button type="text" @click="dialogVisibleFun(scope.row)">审核意见</el-button>
              <!--<el-button type="text" v-if="scope.row.apprStatusCode == 'V002' || scope.row.apprStatusCode == 'V021' || scope.row.apprStatusCode == 'V051'" @click="passFun(scope.row)">通过</el-button>-->
              <el-button type="text" v-if="scope.row.apprStatusCode == 'V002' || scope.row.apprStatusCode == 'V021' || scope.row.apprStatusCode == 'V051'" @click="notPassFun(scope.row)">驳回</el-button>
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

      <el-dialog
        title="编审详情"
        :visible.sync="dialogVisible2"
        width="75%"
        style="text-align: center;"
      >
        <el-table
          :data="dialogList"
          style="width: 100%">
          <el-table-column
            prop="opUserName"
            label="审核人"
            width="80">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            label="创建日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="opinion"
            label="审核意见"
            width="580">
          </el-table-column>
        </el-table>
      </el-dialog>
		</div>
	</div>
</template>

<script>
	import zzuUdc from "@/components/udc-aduit.vue"
	export default {
		components: {
			zzuUdc,
		},
		data(){
			return {
				apprStausCodeDesc:"",
				tableData: [],

				dialogVisible2:false,
				dialogVisible:false,
        dialogList: [],
				notPassID:"",
				opinoin:"",

        columns:[
      		{
      			title:'编号ID',
      			key:"id",
      		},
          {
            title: "产品基本信息",
            sortable: true,
            key: "prodName",
          },
          {
            title: "审核状态",
            sortable: true,
            key: "apprStatusCodeDesc",
          },
          {
            title: "上线状态",
            sortable: true,
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
      'page.pageSize' :{
        handler () {
          this.createdFun()
        },
        deep: true
      },
      'page.currentPage' :{
        handler () {
          this.createdFun()
        },
        deep: true
      },
      'page.pageNum' :{
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
	      			isFirstApp:true
	      		}
				}).then(response => {
				    //请求正确时执行的代码
				   console.log(response)
				   if(response.data.code==0){
				   	this.tableData=response.data.data.rows
				   	this.page.total=response.data.data.total
				   }
				}).catch(function(response){
				    console.log(response);//发生错误时执行的代码
				})
			},

			//查询
			queryFun(val){
        this.apprStausCodeDesc = val
				var that = this
				this.$http.get('/store/Product/aduitList' ,{
					params:{
            pageSize:that.page.pageSize,
            pageNum:that.page.pageNum,
            isFirstApp:true,
						apprStatusCode:that.apprStausCodeDesc
					}
				}).then(res => {
					console.log(res)
					if(res.data.code == 0){
						this.tableData=res.data.data.rows
				   	this.page.total=res.data.data.total
					}
				})
			},
      dialogVisibleFun(val) {
        this.dialogVisible2 = true
        this.$http.get('/store/Product/findOpinion', {
          params:{
            id:val.id,
            apprStausCode:'V051'
          }
        }).then(response => {
          //请求正确时执行的代码
          console.log(response)
          this.dialogList = response.data.data
        }).catch(function(response){
          console.log(response);//发生错误时执行的代码
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
								this.createdFun()
							}
						})
				}
			},
			toViewFun(val){
        this.$router.push({name:'productAdd' , query:{id:val.id, data:val,disabled:true,index:1}})
			},

			//分页函数
      handlePageSizeChange(val) {
        this.page.pageSize = val;
      },
      //点击获取页码数
      handlePageCurrentChange(val) {

      	this.page.pageNum=val
      	this.createdFun()
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
