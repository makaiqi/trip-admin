<template>
	<div class="classification-add">
		<div class="classification-add-header">
			<div>
				<h1>分类</h1>
				<ul class="breadcrumb ">
					<li><a href="">首页</a></li>
					<li><a href="">分类</a></li>
				</ul>
			</div>
			<div class="pull-right">
				<el-tooltip class="item" effect="dark" content="保存" placement="top-start">
		      <el-button type="primary" @click="classAddFun()"><i class="el-icon-document"></i></el-button>
		    </el-tooltip>
				<el-tooltip class="item" effect="dark" content="取消" placement="top-start">
		      <el-button type="danger" @click="classBack()"><i class="el-icon-back"></i></el-button>
		   </el-tooltip>
			</div>
		</div>
		<div class="classification-add-con">
			<div class="con-header">
				<p class="con-title"><i class="el-icon-date"></i> 添加分类列表</p>
				<p class="con-title" v-if="num = false"><i class="el-icon-date"></i> 编辑分类列表</p>
			</div>
			<div class="con-form">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
				  <el-form-item label="分类名称" prop="brand">
				    <el-input></el-input>
				  </el-form-item>
				  <el-form-item label="描述">
				  	<zzu-rich-text></zzu-rich-text>
				  </el-form-item>
				  <el-form-item label="图像">
				    <el-input ></el-input>
				  </el-form-item>
				  <el-form-item label="排序">
				    <el-input></el-input>
				  </el-form-item>
				</el-form>
			</div>
		</div>
		
	</div>
</template>

<script>
	import zzuRichText from '@/components/rich-text'
	export default {
		components: {
			zzuRichText,
		},
    data() {
      return {
      	ruleForm:{},
      	rules:{},
      }
    },
		mounted(){
		},
    methods: {
			classAddFun(){
				this.$http.post('/biz/Type/saveOrUpdate',{
					params:{
						
					}
				}).then(res => {
					console.log(res)
				})
			},
      classBack(){
      	this.$router.push({name:"classificationList"})
      },
    }
  }
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.classification-add{
	padding: $padding;
}
.classification-add-header{
		display: flex;
		justify-content: space-between;
		border-bottom:1px solid #dcdcdc;
		margin-bottom: $padding;
	}
	.classification-add-header{

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
	.classification-add-con{
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
		.con-form{
			border: 1px solid #ddd;
			padding: 20px;
		}
	}
	
</style>