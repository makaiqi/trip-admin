<template>
	<div class="product-add">
		<div class="product-management">
			<div class="page-header">
				<div>
					<h1>商品</h1>
				</div>
				<div class="pull-right">
					<el-tooltip class="item" effect="dark" content="保存" placement="top-start">
			      <el-button type="primary" @click="baocunBtnFun('false')"><i class="el-icon-document"></i> 保存</el-button>
			    </el-tooltip>
					<el-tooltip class="item" effect="dark" content="取消" placement="top-start">
			      <el-button type="danger" @click="backOnFun()"><i class="el-icon-back"></i> 取消</el-button>
			    </el-tooltip>

				</div>
			</div>
		</div>
		<div class="product-add-content">
			<div class="add-header">
				<h3 v-if="listId == ''"><i class="el-icon-edit"></i>添加商品</h3>
				<h3 v-if="listId != ''"><i class="el-icon-edit"></i>编辑商品</h3>
			</div>
			<div class="add-content">
				<el-tabs v-model="activeName" type="card" >
			    <el-tab-pane v-for="(item,index) in productInfo.list" :key="item.name" :label="item.label" :name="item.name">
			    	<div v-if="item.name == 'conventional'" :key="index">
	    				<conventional @conList="conList"></conventional>
	    			</div>
	    			<div v-if="item.name == 'package'" :key="index">
	    				<pack-age @packList="packList"></pack-age>
	    			</div>
			    </el-tab-pane>
			  </el-tabs>
			</div>
		</div>
	</div>

</template>


<script>
	import conventional from '@/views/electricity/productAdd/conventional'
	import packAge from '@/views/electricity/productAdd/package'
	export default {
		components:{
			conventional,
			packAge
		},
		data(){
			return {
				activeName: 'conventional',
				productInfo: {
	        activeName: "conventional",
	        list: [
	          {
	            label: "常规",
	            remark: "",
	            name: "conventional"
	          },
	          {
	            label: "套餐",
	            remark: "",
	            name: "package"
	          }
	        ]
	    },
			conLists:"",
			packLists:[],
			addList:{},
			saveOrCommit:false,
			listId:"",
      disabled: false,
      index: 0
			}
		},
		mounted(){
			this.listId = this.$route.query.id
      this.disabled = this.$route.query.disabled == 'true' ? true : false
			this.index = this.$route.query.index || 0
		},
		methods:{
			backOnFun(){
        if (this.index == 1) {
          this.$router.push({name:'producAuditList'})
        } else if (this.index == 2) {
          this.$router.push({name:'producAuditSecondList'})
        } else {
          this.$router.push({name:'productManagement'})
        }
			},
			conList(msg){
				this.conLists=msg
//				console.log(msg,'常规')
			},
			packList(msg){
				this.packLists=msg   //套餐
			},
			baocunBtnFun(status){
				// console.log(this.conLists,'常规表单');
				// console.log(this.packLists,'套餐表单'); return
				status = status || true
				if(status=='false'){
					status=false
				}
				for (let i=0; i < this.packLists.length; i++) {
				  if (this.packLists[i].imgList.length == 0) {
            this.$message({
              message: '请在套餐中上传主图！',
              type: 'warning'
            })
            return
          }
					if (this.packLists[i].comboName == "" 
						||	this.packLists[i].mktPrice == "" 
						|| this.packLists[i].price == ""
            ||	this.packLists[i].settlementPrice == "" ) {
            this.$message({
              message: '请将套餐中信息填写完整！',
              type: 'warning'
            })
            return
          }
          this.packLists[i].tAssetId = this.packLists[i].imgList[0].id
        }
				this.saveOrCommit = status
				var conList = this.conLists
				var baocun = {saveOrCommit:this.saveOrCommit}
				var objList = {productComboDomainList:this.packLists}
				console.log(objList,'objList')
				let obj = Object.assign(conList,objList, baocun)
				console.log(obj,'新增编辑')
				this.$http.post('/biz/GoodsSkn/saveOrUpdate', obj).then(res => {
					console.log(res)
					if(res.data.code==0){
						this.$message({
		          message: '添加成功',
		          type: 'success'
		        });
						if (this.index == 1) {
              this.$router.push({name:'producAuditList'})
            } else if (this.index == 2) {
              this.$router.push({name:'producAuditSecondList'})
            } else {
              this.$router.push({name:'productManagement'})
            }
					}else{
						this.$message({
		          message: res.data.msg,
		          type: 'warning'
		        });
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.product-add{
	padding: $padding;
}
.product-add-content{
	width: 100%;
	border: 1px solid #DDDDDD;
	.add-header{
		color: #4c4d5a;
    border-color: #dcdcdc;
    background: #f6f6f6;
    text-shadow: 0 -1px 0 rgba(50,50,50,0);
		padding: 12px 15px;
    border-bottom: 1px solid transparent;
    border-top-right-radius: 2px;
    border-top-left-radius: 2px;
	}
	.add-content{
		padding: $padding;
	}
}


.page-header{
		display: flex;
		justify-content: space-between;
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
</style>
