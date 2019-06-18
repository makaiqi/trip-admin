<template>
	<div class="logistics-list">
		<div class="logistics-list-header">
			<div>
				<h1>物流模型</h1>
				<ul class="breadcrumb ">
					<li><a href="">首页</a></li>
					<li><a href="">物流模型</a></li>
				</ul>
			</div>
			<div class="pull-right">
				<el-tooltip class="item" effect="dark" content="新增" placement="top-start">
		      <el-button type="primary" @click="logListPush()"><i class="el-icon-plus"></i></el-button>
		    </el-tooltip>
				<el-tooltip class="item" effect="dark" content="删除" placement="top-start">
		      <el-button type="danger" @click="deleteFun()"><i class="el-icon-delete"></i></el-button>
		   </el-tooltip>
			</div>
		</div>
		<div class="logistics-list-con">
			<div class="con-header">
				<p class="con-title"><i class="el-icon-date"></i> 物流模型列表</p>
			</div>
			<el-table
		    ref="multipleTable"
		    :data="tableData"
		    border
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		    	prop="companyName"
		      label="物流模型名称"
		      sortable
		      >
		    </el-table-column>
		    <el-table-column
		    	prop="companyList[0].firstKgCost"
		      label="首公斤价格"
		      sortable
		      >
		    </el-table-column>
		    <el-table-column
		    	prop="companyList[0].continuedPerKgCost"
		      label="续重每公斤价格"
		      sortable
		      >
		    </el-table-column>
		    <el-table-column
		    	prop="companyList[0].name"
		      label="目的地城市"
		      sortable
		      >
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作"

		      show-overflow-tooltip>
		      <template slot-scope="scope">
		      	<el-button type="primary"><i class="el-icon-edit"></i></el-button>
		      </template>
		    </el-table-column>
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
		</div>

	</div>
</template>

<script>
	export default {
    data() {
      return {
				tableData:[],
        multipleSelection: [],

        page: {
	          currentPage: 1,
	          pageSizes: this.$appCfg.paginationCfg.pageSizes,
	//					pageSizes:[1,2,3,4],
	          pageSize: 30,
	          total:1,
	          pageNum:1,
	        },

        listId:[],

      }
    },
		mounted(){
			this.createdFun()
			this.open()
		},
    methods: {

    	open() {
        this.$alert('物流列表管理请前往电商上架-关联页面！稍后会完善。。。', '物流列表', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
     },


    	createdFun(){
    		var that = this
    		this.$http.get('/store/LogisticsCompany/list', {
    			params:{
	      		pageSize:that.page.pageSize,
	      		pageNum:that.page.pageNum
	      	}
    		}).then(res => {
    			console.log(res)
    			if(res.data.code==0){
    				this.tableData = res.data.data.rows
    				this.page.total = res.data.data.total
    			}else{
    				this.tableData = []
    				this.page.total = 0
    			}
    		})
    	},
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.listId=[]
        for(let i=0;i<val.length;i++){
        	this.listId.push(val[i].id)
        }
     },

      handlePageSizeChange(val) {
      },
      //获取页码数
      handlePageCurrentChange(val) {
//				this.page.pageNum = val

      },
      logListPush(){
      	this.$router.push({name:"logisticsListAdd"})
      },
      deleteFun(){
      	var that=this
      	this.$http.post('/store/LogisticsCompany/remove',
      		this.listId
      	).then(res => {
      		if(res.data.code==0){
      			this.tableData = res.data.data.rows
    				this.page.total = res.data.data.total
      			this.createdFun()
      		}
      		console.log(res)
      	})
      },
    }
  }
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.logistics-list{
	padding: $padding;
}
.logistics-list-header{
		display: flex;
		justify-content: space-between;
		border-bottom:1px solid #dcdcdc;
		margin-bottom: $padding;
	}
	.logistics-list-header{

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
	.logistics-list-con{
		.con-header{
			color: #4c4d5a;
	    border-color: #dcdcdc;
	    background: #f6f6f6;
	    text-shadow: 0 -1px 0 rgba(50,50,50,0);
	    padding: 12px 15px;
	    border-bottom: 1px solid transparent;
	    border-top-right-radius: 2px;
	    border-top-left-radius: 2px;
	    .con-title{
	    	font-weight: 500;
	   		display: inline-block;
	    }
		}
	}

</style>
