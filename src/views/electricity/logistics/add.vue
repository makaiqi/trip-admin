<template>
	<div class="logistics-add">
		<div class="logistics-add-header">
			<div>
				<h1>物流模型</h1>
				<ul class="breadcrumb ">
					<li><a href="">首页</a></li>
					<li><a href="">物流模型</a></li>
				</ul>
			</div>
			<div class="pull-right">
				<el-tooltip class="item" effect="dark" content="保存" placement="top-start">
		      <el-button type="primary" @click="logAddFun()"><i class="el-icon-document"></i></el-button>
		    </el-tooltip>
				<el-tooltip class="item" effect="dark" content="取消" placement="top-start">
		      <el-button type="danger" @click="logAddBack()"><i class="el-icon-back"></i></el-button>
		   </el-tooltip>
			</div>
		</div>
		<div class="logistics-add-con">
			<div class="con-header">
				<p class="con-title"><i class="el-icon-date"></i> 添加物流模型</p>
				<p class="con-title" v-if="num = false"><i class="el-icon-date"></i> 编辑物流模型</p>
			</div>
			<div class="con-form">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
				  <el-form-item label="物流名称" prop="brand">
				  	<zzu-logistics-select v-model="ruleForm.fecc_logistics_company.companyName" style="width: 100%;"></zzu-logistics-select>
				    <!--<el-input v-model="ruleForm.fecc_logistics_company.companyName" placeholder="制造商/品牌名称"></el-input>-->
				  </el-form-item>
				  <el-form-item label="目的地城市">
				  	<zzu-city-select v-model="ruleForm.ecc_logis_temp_target.name" style="width: 100%;"></zzu-city-select>
				    <!--<el-input v-model="ruleForm.ecc_logis_temp_target.name" placeholder="排序"></el-input>-->
				  </el-form-item>
				  <el-form-item label="首公斤价格">
				    <el-input readonly v-model="ruleForm.ecc_logistics_template.firstKgCost"></el-input>
				  </el-form-item>
				  <el-form-item label="续重公斤价格">
				    <el-input readonly v-model="ruleForm.ecc_logistics_template.continuedPerKgCost"></el-input>
				  </el-form-item>
				  
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import zzuLogisticsSelect from '@/components/logistics-selsect'
	import zzuCitySelect from '@/components/city-select'
	export default {
		components: {
			zzuLogisticsSelect,
			zzuCitySelect
		},
		data(){
			return {
				ruleForm: {
					fecc_logistics_company:{
         	companyName:""
         },
         ecc_logistics_template:{
         	firstKgCost:"",
         	continuedPerKgCost:""
         },
         ecc_logis_temp_target:{
         	name:"",
         },
        },
        rules: {
        },
			}
		},
		methods:{
			logAddFun(){
				
			},
			logAddBack(){
				this.$router.push({name:"logisticsList"})
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.logistics-add{
	padding: $padding;
}
.logistics-add-header{
		display: flex;
		justify-content: space-between;
		border-bottom:1px solid #dcdcdc;
		margin-bottom: $padding;
	}
	.logistics-add-header{

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
	.logistics-add-con{
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