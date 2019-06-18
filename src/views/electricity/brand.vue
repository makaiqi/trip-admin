<template>
	<div class="brand-list">
		<div class="brand-list-con">
			<label for=""></label>
			<el-input v-model="search" placeholder="模糊搜索/品牌、主营产品" style="width: 200px;"></el-input>
			<el-button @click="searchFun()">搜索</el-button>
			<el-button @click="deleteFun()">删除</el-button>
			<div class="con-header">
				<p class="con-title"><i class="el-icon-date"></i> 制造商/品牌列表</p>
			</div>
			<div  style="width: 55%;overflow: hidden;">
				<el-table
		    ref="multipleTable"
		    :data="tableData3"
		    border
        stripe
		    tooltip-effect="dark"
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		    	prop="brand"
		      label="制造商/品牌"
		      sortable
		      >
		    </el-table-column>
		    <el-table-column
		      prop="seq"
		      label="排序"
		      sortable
		      >
		    </el-table-column>
		    <el-table-column
		      prop="mainProduct"
		      label="主营产品"
		      sortable>
		    </el-table-column>
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
			</div>

		</div>
		<div class="brand-list-con-right">
				<p>添加品牌列表</p>
				<hr class="right-hr"/>
				<div style="padding-right: 10px;">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					  <el-form-item label="品牌名称" prop="brand">
					    <el-input v-model="ruleForm.brand"></el-input>
					  </el-form-item>
					  <el-form-item label="主营产品" prop="mainProduct">
					    <el-input v-model="ruleForm.mainProduct"></el-input>
					  </el-form-item>
					  <el-form-item label="品牌LOGO">
					    <zzu-upload v-model="logoImg" :limit="1"></zzu-upload>
					  </el-form-item>
					  <el-form-item label="排序">
					    <el-input v-model="ruleForm.seq" placeholder="排序"></el-input>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
					  </el-form-item>
					</el-form>
				</div>
			</div>
	</div>
</template>

<script>
  import zzuUpload from '@/components/upload'
	export default {
    components: {
      zzuUpload
    },
    data() {
      return {
        tableData3: [],
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
        search:"", //搜索字段

        ruleForm: {
          brand:"",
          mainProduct:"",
          logoId:"",
          seq:0,
        },
        logoImg: [],
        rules: {
          brand: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
          mainProduct: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
        }

      }
    },
		mounted(){
			this.createdFun()
		},
    watch : {
      'logoImg'(newVal, oldVal) {
        if (newVal) {
          this.ruleForm.logoId = newVal[0] && newVal[0].id
          this.ruleForm.logoImgUrl = newVal[0] && newVal[0].url
        }
      },
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
      }
    },
    methods: {
    	createdFun(){
    		var that = this
    		this.$http.get('/store/Brand/list', {
    			params:{
	      		pageSize:that.page.pageSize,
	      		pageNum:that.page.pageNum
	      	}
    		}).then(res => {
 			// console.log(res)
    			if(res.data.code==0){
    				this.tableData3 = res.data.data.rows
    				this.page.total = res.data.data.total
    			}
    		})
    	},
      handleSelectionChange(val) {
     // console.log(val)
        this.logoImg = []
        this.listId=[]
        for(let i=0;i<val.length;i++){
        	this.listId.push(val[i].id)
        }
//      console.log(this.listId)

        var index = val.length-1
        if(index>=0){
        	this.ruleForm = val[index]
          this.logoImg.push({url:this.ruleForm.logoImgUrl})
        }else{
        	this.ruleForm={
	          brand:"",
	          mainProduct:"",
	          logoId:"",
	          seq:0,
	        }
        }
      },
      //删除
      deleteFun(){
      	var that=this
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http.post('/store/Brand/remove', that.listId).then(res => {
            if(res.data.code == 0){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.createdFun()
            }
          })
        }).catch(()=>{
        })
      },
      //搜索
      searchFun(){
      	this.$http.get('/store/Brand/list', {
    			params:{
	      		pageSize:this.page.pageSize,
	      		pageNum:this.page.pageNum,
	      		search:this.search
	      	}
    		}).then(res => {
 			console.log(res)
    			if(res.data.code==0){
    				this.tableData3 = res.data.data.rows
    				this.page.total = res.data.data.total
    			}
    		})
      },
      bianjiFun(val){
      	this.$router.push({name:'brandAdd' , query:{id:val.id}})
      },

      handlePageSizeChange(val) {
        this.page.pageSize = val;
      },
      //获取页码数
      handlePageCurrentChange(val) {
				this.page.pageNum = val
				this.createdFun()

      },


      submitForm(formName) {
      	if(this.ruleForm.brand == "" || this.ruleForm.mainProduct == "" || this.ruleForm.logoId == ""){
      		this.$message.error('请填写信息');
      	}else{
      		this.$http.post('/store/Brand/saveOrUpdate', this.ruleForm).then(res => {
	          console.log(res,'品牌新增')
			    	if(res.data.code == 0){
			    		this.$message({
			          message: '保存成功',
			          type: 'success'
			        })
              this.ruleForm = {
                brand:"",
                  mainProduct:"",
                  logoId:"",
                  seq:0,
              }
              this.logoImg = []
              this.createdFun()
			    	}else{
			    		this.$message.error('保存失败	');
			    	}
			    })
      	}

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.brand-list{
	padding: $padding;
	position: relative;
}
	/*待整理*/
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

	.brand-list-con{
		width: 100%;
		min-height:380px;
		border: 1px solid #dcdcdc;
		padding: 20px;
		display: inline-block;
		/*position: relative;*/
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
	.brand-list-con-right{
			width: 35%;
			border: 1px solid #dcdcdc;
			position: absolute;
			right: 40px;
			top:115px;
			p{
				margin: 10px;
			}
			.right-hr{
				border:0;
		 		background-color:#dcdcdc;
		 		height:1px;
		 		margin-top: 10px;
		 		margin-bottom: 10px;
			}
		}
</style>
