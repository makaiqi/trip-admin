<!--商品退款详情-->
<template>
	<div class="details-text">
		<div class="details-text-header">
			<div>
				<h1>项目详情</h1>
				<ul class="breadcrumb ">
					<li><a href="">列表</a></li>
					<li><a href="">详情</a></li>
				</ul>
			</div>
		</div>
		<div class="details-text-con">
			<div class="details-text-con-title" >
				<div>
					<img :src="detailsList.tassertProduct" alt="" />
				</div>
				<div class="mon-text">
					<label for="">订单名称：</label><span>{{detailsList.productName}}</span> <el-button class="btn-text" type="success">{{detailsList.orderStatusCodeDesc}}</el-button><br />
					<label for="">订单编号：</label><span>{{detailsList.orderNo}}</span><br />
					<label for="">订单金额：</label><span>{{detailsList.paymentAmt}}</span>
					<label class="label-last" for="">运费金额：</label><span>{{detailsList.freightFee}}</span>
				</div>
			</div>
			<div class="details-text-con-content">
				<div class="i-shu"></div>
				<p>基本信息</p>
				<div class="base-info-text" >
					<div>
						<label for="">用户姓名：</label><span>{{detailsList.memberName}}</span><br />
						<label for="">用户手机号：</label><span>{{detailsList.mobile}}</span><br />
						<label for="">商品类型：</label><span>{{detailsList.orderType}}</span><br />
						<label for="">下单时间：</label><span>{{detailsList.paymentTime}}</span><br />
						<label for="">订单总价：</label><span>{{detailsList.paymentAmt}}</span>
					</div>
					<div class="base-info-text-right">
						<label class="right-first" for="">退款说明：</label><textarea v-model='detailsList.refundReason' class="right-textarea" name="txt" clos=",50" rows="5" warp="virtual"></textarea><br />
						<label for="">退款账号类型：</label><span>{{detailsList.paymentTypeCodeDesc}}</span><br />
						<label for="">退款账号：</label><span>{{detailsList.memberName}}</span>
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
				detailsList:"",
			}
		},
		mounted(){
			this.listID=this.$route.query.id
			console.log(this.listID)
			this.certedFun()
		},
		methods:{
			certedFun(){
				this.$http.get('/store/Order/findById',{
					params:{
						id:this.listID
					}
				}).then(res => {
					console.log(res)
					if(res.data.code === 0){
						this.detailsList = res.data.data
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.details-text{
	padding: 20px;
}
.details-text-header{

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
	.details-text-con{
		border: 1px solid #BBBBBB;
		.details-text-con-title{
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
		.details-text-con-content{
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
					height: 200px;
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
