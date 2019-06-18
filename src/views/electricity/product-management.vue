<template>
	<div class="product-management">
		<div class="page-header">
			<div>
				<h1>商品</h1>
				<!--<ul class="breadcrumb ">
					<li><a href="javascript:void(0)">首页</a></li>
					<li><a href="javascript:void(0)">商品</a></li>
				</ul>-->
			</div>
			<div class="pull-right">
				<el-tooltip class="item" effect="dark" content="新增" placement="top-start">
		      <el-button type="primary" @click="pullBtnFun()"><i class="el-icon-plus"></i> 新增</el-button>
		    </el-tooltip>
		    <!--<el-tooltip class="item" effect="dark" content="详情列表" placement="top-start">
		      <el-button type="primary" @click="detailsBtnFun()">详情</i></el-button>
		    </el-tooltip>-->
				<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
		      <el-button type="danger" @click="delectFun()"><i class="el-icon-delete"></i> 删除</el-button>
		   </el-tooltip>
			</div>
		</div>
		<div class="product-management-con">
			<div class="con-list">
				<label for="">商品名称：</label>
				<el-input v-model="saiXuanForm.prodName" clearable style="width: 160px;"></el-input>
				<!-- <label for="">审核状态：</label>
				<zzu-udc v-model="saiXuanForm.apprStatusCode" udc-code="UDC_M03_T04" style="display: inline-block;"></zzu-udc> -->
				<label for="">上线状态：</label>
				<zzu-udc v-model="saiXuanForm.onlineStatusCodeDesc" udc-code="UDC_M03_T05" style="display: inline-block;"></zzu-udc>
				<el-button @click="saixuanFun()"><i class="el-icon-search"></i> 搜索</el-button>
				<div class="con-header">
					<p class="con-title"><i class="el-icon-date"></i> 商品列表</p>
				</div>
					<el-table
            ref="multipleTable"
            :data="productTable"
            border
            stripe
            tooltip-effect="dark"
            style="width: 100%; margin-bottom: 20px;"
            @selection-change="handleSelectionChange"
            class="base-block-table">
            <template v-for="(item,index) in columns">

              <el-table-column :key="index" v-if="item.key == 'isOnline'" :fixed="item.fixed" :type="item.type" :width="item.width" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <div v-if="scope.row.onlineStatusCode == 'V004' && scope.row.apprStatusCode == 'V001'">
                    <el-button type="primary" @click="bianjiFun(scope.row)"><i class="el-icon-edit"></i></el-button>
                  </div>
                  <div v-if="(scope.row.apprStatusCode == 'V001' && scope.row.onlineStatusCode=='V001') || scope.row.apprStatusCode == 'V031' || scope.row.apprStatusCode == 'V041'">
                    <el-button type="primary" @click="bianjiFun(scope.row)"><i class="el-icon-edit"></i></el-button>
                  </div>
                  <div>
                    <el-button type="text" @click="dialogVisibleFun(scope.row)">审批意见</el-button>
                  </div>
                  <div>
                    <el-button type="text" v-if="scope.row.apprStatusCode == 'V031'" @click="downLine(scope.row.id)">立即下线</el-button>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :key="index" v-else-if="item.key == 'assetDomain'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                	<div style="width: 50px;height: 50px;border: 1px solid #ddd;padding: 4px;">
                		<img :src="scope.row.assetDomain.url" alt="" style="width: 100%;height: 100%;"/>
                	</div>
                </template>
              </el-table-column>

              <el-table-column :key="index" v-else-if="item.key == 'minQty'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                	<p v-if="scope.row.minQty>10">{{scope.row.minQty}}</p>
                	<p class="table-qty" v-if="scope.row.minQty<=10">{{scope.row.minQty}}</p>
                </template>
              </el-table-column>

              <el-table-column :key="index" v-else-if="item.key == 'apprStatusCode'" :fixed="item.fixed" :type="item.type" :width="item.width" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <div>{{scope.row.valDesc}}</div>
                </template>
              </el-table-column>
              <el-table-column :key="index" v-else-if="item.key == 'onlineStatusCodeDesc'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <p class="table-qty" v-if="scope.row.onlineStatusCodeDesc=='已上线'">{{scope.row.onlineStatusCodeDesc}}</p>
                  <p class="table-qty-red" v-else-if="scope.row.onlineStatusCodeDesc=='已下线'">{{scope.row.onlineStatusCodeDesc}}</p>
                  <p v-else>{{scope.row.onlineStatusCodeDesc}}</p>
                </template>
              </el-table-column>
              <el-table-column :key="index" v-else :type="item.type" :fixed="item.fixed" :width="item.width" :label="item.title" :sortable="item.sortable" :prop="item.key">
              </el-table-column>

            </template>
         </el-table>
				<el-pagination
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>

        <el-dialog
          title="编审详情"
          :visible.sync="dialogVisible"
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
	</div>
</template>
<script>
	import zzuUdc from '@/components/udc'
	export default {
		components: {
			zzuUdc
		},
		data(){
			return {
        idList : [],
        downLineIdList : [],
				productTable:[],
        dialogList: [],
        dialogVisible: false,
				columns: [
            {
              type: 'selection',
              width: 40,
              align: 'center',
            },
            {
              title: "商品ID",
              key: "id",
              width: 90,
              sortable: true
            },
            // {
            //   title: '图像',
            //   key: 'assetDomain',
            //   width:80
            // },
            {
              title: '商品名称',
              key: 'sknName',
              sortable: true,
              width:180
            },{
              title: '价格',
              key: 'showPrice',
              sortable: true,
            },{
              title: '库存数量',
              key: 'minQty',
              sortable: true,
            },{
              title: '审核状态',
              key: 'apprStatusCode',
              sortable: true,
            },{
              title: '上线状态',
              key: 'onlineStatusCodeDesc',
              sortable: true,
            },{
              title: '操作',
              key: 'isOnline',
              width:120
            }
          ],
          page: {
	          currentPage: 1,
	          pageSizes: this.$appCfg.paginationCfg.pageSizes,
	//					pageSizes:[1,2,3,4],
	          pageSize: 30,
	          total:1,
	          pageNum:1,
	        },

	        saiXuanForm:{
	        	prodName:"",
	        	apprStatusCode:"",
	        	onlineStatusCodeDesc:"",
	        },

	        delectIDList:"",

			}
		},
		mounted(){
			this.createdFun()
		},
    watch : {
      'page.currentPage' :{
        handler () {
          this.createdFun()
        },
        deep: true
      },
      'page.pageSize' :{
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
      },
    },
		methods:{
			createdFun(){
				var that= this
				this.$http.get('/biz/GoodsSkn/list',{
					params:{
	      			pageSize:that.page.pageSize,
	      			pageNum:that.page.pageNum
	      		}
				}).then(res => {
					// console.log(res)
					if(res.data.code==0){
						this.productTable = res.data.data.rows
            // console.log(res.data.data.rows)
						this.page.total = res.data.data.total
					}

				})
			},
			//增加
			pullBtnFun(){
				let val={
      		id:""
      	}
				this.$router.push({name:"productAdd", query:{id:val.id}})
			},
			//删除
			delectFun(){
				var that=this
				this.$http.post('/biz/GoodsSkn/remove', that.delectIDList).then(res => {
					if(res.data.code==0){
						this.createdFun()
					}
				})
			},
      downLine(id) {
        this.$confirm('确定立即下线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=> {
          this.$http.get("/biz/GoodsSkn/instOffline", { params: {
              id: id
            } }).then(rs => {
            if (rs.data.code == 0) {
              this.$message({
                message: rs.data.msg
              })
              this.createdFun()
            } else {
              this.$message({
                message: rs.data.msg
              })
            }
          })
        }).catch(() => {});

      },
			bianjiFun(val){
      	this.$router.push({name:'productAdd' , query:{id:val.id, data:val,disabled:false}})
      },
      dialogVisibleFun(val) {
        this.dialogVisible = true
        this.$http.get('/biz/GoodsSkn/findOpinion', {
          params:{
            id:val.id,
            apprStausCode:'V041'
          }
        }).then(response => {
          //请求正确时执行的代码
          // console.log(response)
          this.dialogList = response.data.data
        }).catch(function(response){
          // console.log(response);//发生错误时执行的代码
        })
      },

			handleSelectionChange(val) {
				this.delectIDList = []
        this.idList = []
        this.downLineIdList = []
        for (let i=0;i<val.length;i++) {
          this.idList.push(val[i].id)
          this.delectIDList.push(val[i].id)
          this.downLineIdList[i] = {}
          this.downLineIdList[i].apprStatusCode = val[i].apprStatusCode
          this.downLineIdList[i].onlineStatusCode = val[i].onlineStatusCode
          this.downLineIdList[i].approveName = "ECC_PRODUCT"
          this.downLineIdList[i].id = val[i].id
        }
      },
      // 批量提交审核
      batchAduit() {
        var that = this
        that.$confirm(`此操作将批量提交, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=> {
          var params = {
            idList:that.idList,
            apprStatusCode: 'V002',
            approveName: 'ECC_PRODUCT'
          }
          that.$http.post('/freeTravel/Inst/approvingAuditings',params).then(res => {
            if(res.data.code==0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              })
              that.createdFun()
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              })
            }
          })
        }).catch()
      },
      // 批量下线
      batchDownline() {
			  var downLineList = {}
        downLineList.downLineIdList = this.downLineIdList
        this.$http.post('/freeTravel/Inst/multipleOffline',downLineList).then(res => {
          if(res.data.code==0) {
            this.$message({
              message: res.data.msg,
              type: "success"
            })
            this.createdFun()
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            })
          }
        })
			  // console.log(this.downLineIdList)
      },
      handlePageSizeChange(val) {
        this.page.pageSize = val;
      },
      //获取页码数
      handlePageCurrentChange(val) {
//      this.tableList.query.pageNum = val;
				this.page.pageNum = val
				this.createdFun()

      },
      saixuanFun(){
      	this.$http.get('/biz/GoodsSkn/list', {
      		params:{
      			search:this.saiXuanForm.prodName,
      			onlineStatusCode:this.saiXuanForm.onlineStatusCodeDesc,
      			apprStatusCode:this.saiXuanForm.apprStatusCode,
      		}
      	}).then(res => {
      		// console.log(res)
      		if(res.data.code == 0){
      			this.productTable = res.data.data.rows
						this.page.total = res.data.data.total
      		}else{
      			this.productTable = res.data.data.rows
						this.page.total = res.data.data.total
      		}
      	})
      },

		},
	}
</script>
<style lang="scss" scoped="scoped">
	@import "~@/assets/css/core/index";
	.product-management{
		padding: $padding;
	}
	.page-header{
		display: flex;
		justify-content: space-between;
		border-bottom:1px solid #dcdcdc;
		margin-bottom: $padding;
	}
	.page-header{

		h1{
			font-family: 'Open Sans', sans-serif;
	    font-weight: 300;
	    font-size: 30px;
	    color: #4c4d5a;
	    display: inline-block;
	    margin-bottom: 15px;
	    text-shadow: 0 1px #fff;
		}
		.breadcrumb{
			display: inline-block;
	    background: none;
	    margin: 8px 0 19px 0;
	    padding: 0 10px;
	    border-radius: 0;
	    list-style: none;
	    li{
	    	display: inline-block;
    		text-shadow: 0 1px #fff;
        text-align: -webkit-match-parent;
	    }
		}
	}
	.breadcrumb > li + li:before {
	    content: ">\00a0";
	    padding: 0 5px;
	    color: #ccc;
	}
	*:before, *:after {
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	}
	.breadcrumb > li:last-child a {
	    color: #1e91cf;
	}
	.breadcrumb li a {
	    color: #999999;
	    font-size: 14px;
	    padding: 0px;
	    margin: 0px;
	}
	a {
	    color: #1e91cf;
	    text-decoration: none;
	    background-color: transparent;
	}
	.product-management-con{
		display: flex;
		justify-content: space-between;
	}
	.con-header{
		color: #4c4d5a;
    border-color: #dcdcdc;
    background: #f6f6f6;
    text-shadow: 0 -1px 0 rgba(50,50,50,0);
    padding: 12px 15px;
    border-bottom: 1px solid transparent;
    border-top-right-radius: 2px;
    border-top-left-radius: 2px;
    margin-top: 20px;
    .con-title{
    	font-weight: 500;
   		display: inline-block;
    }
    .batch{
      display: inline-block;
      margin-left: 700px;
    }
	}
	.con-title{
		margin-top: 0;
    margin-bottom: 0;
    font-size: 15px;
    color: inherit;
	}
	.table-qty{
		background-color: #4cb64c;
		display: inline;
    padding: 0.2em 0.6em 0.3em;
    font-size: 75%;
    font-weight: bold;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25em;
	}
  .table-qty-red{
    background-color: #ed4014;
    display: inline;
    padding: 0.2em 0.6em 0.3em;
    font-size: 75%;
    font-weight: bold;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25em;
  }
	/*.con-push{
		border: 1px solid #ddd;
		text-align: center;
		.con-header{
			border-bottom: 1px solid #ddd;
			text-align: left;
		}
		.con-form{
			width: 90%;
			text-align: left;
			display: inline-block;
			padding-top: 20px;
			label{
				display: inline-block;
		    max-width: 100%;
		    margin-bottom: 5px;
		    font-weight: bold;
			}
			.form-ipt{
				margin-bottom: 18px;
			}
		}
	}*/
</style>
