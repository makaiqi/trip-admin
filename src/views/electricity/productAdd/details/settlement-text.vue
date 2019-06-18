<!--商品结算订单详情-->
<template>
	<div class="settlement-text">
		<div class="settlement-text-header">
			<div>
				<h1>项目详情</h1>
				<ul class="breadcrumb ">
					<li><a href="">列表</a></li>
					<li><a href="">详情</a></li>
				</ul>
			</div>

		</div>
		<div class="settlement-text-con">
			<div class="settlement-text-con-title" >
				<div>
					<img :src="settlementList.url" alt="" />
				</div>
				<div class="mon-text">
					<label for="">订单名称：</label><span>{{settlementList.productName}}</span> <el-button class="btn-text" type="success">{{settlementList.orderStatusCodeDesc}}</el-button><br />
					<label for="">订单编号：</label><span>{{settlementList.orderNo}}</span><br />
					<label for="">订单金额：</label><span>{{settlementList.orderAmt}}</span>
					<label class="label-last" for="">运费金额：</label><span>{{settlementList.freightFee || "无"}}</span>
				</div>
				<el-button @click="blackFun()" style="position: absolute;right: 20px;">返回</el-button>
			</div>
			<div class="settlement-text-con-content">
				<div class="i-shu"></div>
				<p>基本信息</p>
				<div class="base-info-text" >
					<div>
						<label for="">用户姓名：</label><span>{{settlementList.contactsName}}</span><br />
						<label for="">用户手机号：</label><span>{{settlementList.mobile}}</span><br />
						<label for="">商品类型：</label><span>{{settlementList.orderType}}</span><br />
						<label for="">下单时间：</label><span>{{settlementList.createdTime}}</span><br />
						<label for="">订单总价：</label><span>{{settlementList.orderAmt}}</span>
					</div>
					<div class="base-info-text-right">
						<!--<label class="right-first" for="">退款说明：</label><textarea v-model='settlementList.refundReason' class="right-textarea" name="txt" clos=",50" rows="5" warp="virtual"></textarea><br />-->
						<label for="" v-if="isService">服务商名称：</label>
            <label for="" v-if="!isService">供应商名称：</label>
            <span>{{settlementList.vendorName}}</span><br />

						<label for="" v-if="isService">服务商电话：</label>
            <label for="" v-if="!isService">供应商电话：</label>
            <span>{{settlementList.mobile}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				listID:"",
				settlementList:"",
        orderType: "",
        isService: false
			}
		},
		mounted(){
			this.listID=this.$route.query.id
      this.orderType=this.$route.query.orderType
      this.isService=this.$route.query.isService
			this.certedFun()
		},
		methods:{
			certedFun(){
				this.$http.get('/biz/SettlementInst/findOrderDetails',{
					params:{
						id:this.listID,
            orderType:this.orderType
					}
				}).then(res => {
					console.log(res,'结算查看详情')
					if(res.data.code === 0){
						this.settlementList = res.data.data
					}
				})
			},
			//返回
			blackFun(){
				this.$router.push({name:'productSettlementList'})
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.settlement-text{
	padding: 20px;
}
.settlement-text-header{
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
	.settlement-text-con{
		border: 1px solid #BBBBBB;
		.settlement-text-con-title{
			border-bottom: 1px solid #BBBBBB;
			padding: 20px;
			position: relative;
			div{
				width: 85px;
				height: 85px;
				border: 1px solid red;
				display: inline-block;
				img{
					width: 100%;
					height: 100%;
				}
			}
			.mon-text{
				width: 60%;
				position: absolute;
				left: 130px;
				border: none;
				label{
					line-height: 28px;
				}
				span{
					font-size: 12px;
					color:#6E6D6E;
				}
				.label-last{
					margin-left: 50px;
				}
				.btn-text{
					width: 56px;
					height: 18px;
					padding: 0;
					border-radius: 19px;
					margin-left: 70px;
				}
			}
		}
		.settlement-text-con-content{
			padding: 20px;
			position: relative;
			.i-shu{
				width: 2px;
				height: 13px;
				background-color: red;
				position: absolute;
				top: 22px;
			}
			p{
				margin-left: 10px;
			}
			.base-info-text{
				position: relative;
				div{
					width: 200px;
					min-height: 240px;
					display: inline-block;
					margin-left: 5%;
					label{
						line-height: 40px;
						margin-right: 15px;
					}
					span{
						font-size: 12px;
						color: #B2AFB3;
					}
				}
				.base-info-text-right{
					position: absolute;
					left: 40%;
					.right-first{
						position: absolute;
					}
					.right-textarea{
						margin-left: 80px;
						margin-top: 15px;
						padding-top: 2px;
						width: 200px;
						font-size: 12px;
						color: #888888;
						line-height: 14px;
					}
				}
			}
		}
	}
</style>
