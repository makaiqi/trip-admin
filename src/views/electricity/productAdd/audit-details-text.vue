<!--电商审核详情页面-->
<template>
	<div>
		<div class="review-content">
			<h1 class="review-content-title">电商审核详情信息</h1>
			<div class="review-con-text">
				<div class="review-con-text-div">
					<label for="" >产品名称：</label>
					<span class="review-con-text-div-con">{{dataList.prodName}}</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >产品描述：</label>
					<zzu-rich-text v-model="dataList.prodDesc" class="review-con-text-div-con"></zzu-rich-text>
				</div>
				<div class="review-con-text-div">
					<label for="" >关键字：</label>
					<span class="review-con-text-div-con">{{dataList.keywords}}</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >产品亮点：</label>
					<span class="review-con-text-div-con" v-for="item in dataList.highlightTagCodeDescs">{{item}}，</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >土特色：</label>
					<span class="review-con-text-div-con">{{dataList.isLocalProd}}</span>
					<label for="" >发货城市：</label>
					<span class="review-con-text-div-con">{{dataList.deliveryCityName}}</span>
					<label for="" >具体地址：</label>
					<span class="review-con-text-div-con">{{dataList.deliveryAddressName || "无此数据"}}</span>
				</div>

				<div class="review-con-text-div">
					<label for="" >生产国家：</label>
					<span class="review-con-text-div-con">{{dataList.yieldCountryName}}</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >最小购买数：</label>
					<span class="review-con-text-div-con">{{dataList.moq}}</span>
					<label for="" >减少库存：</label>
					<span class="review-con-text-div-con">{{dataList.isReduceStock}}</span>
					<label for="" >缺货时状态：</label>
					<span class="review-con-text-div-con">{{dataList.oosStatusCodeDesc}}</span>
					<label for="" >需要配送：</label>
					<span class="review-con-text-div-con">{{dataList.isShipping}}</span>
					<label for="" >需要运费：</label>
					<span class="review-con-text-div-con">{{dataList.isIncFreightFee}}</span>
					<label for="" >需要推荐：</label>
					<span class="review-con-text-div-con">{{dataList.isRecommend}}</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >尺寸（长 x 宽 x 高）：</label>
					<span class="review-con-text-div-con">长：{{dataList.depth}}</span>
					<span class="review-con-text-div-con">宽：{{dataList.width}}</span>
					<span class="review-con-text-div-con">高：{{dataList.height}}</span>
				</div>
				<div class="review-con-text-div hr">
					<label for="" >尺寸单位：</label>
					<span class="review-con-text-div-con">{{dataList.sizeUomCodeDesc}}</span>
					<label for="" >重量：</label>
					<span class="review-con-text-div-con">{{dataList.weight}}</span>
					<label for="" >重量单位：</label>
					<span class="review-con-text-div-con">{{dataList.weightUomCodeDesc}}</span>
					<label for="" >排序：</label>
					<span class="review-con-text-div-con">{{dataList.seq}}</span>
				</div>

				<div class="review-con-text-div">
					<label for="" >制造商/品牌：</label>
					<span class="review-con-text-div-con">{{dataList.brand}}</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >产品分类：</label>
					<span class="review-con-text-div-con">{{dataList.typeName}}</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >相关产品：</label>
          <span class="review-con-text-div-con">{{dataList.assoProductName == '' ?  '无' : dataList.assoProductName}}</span>
				</div>
				<div class="review-con-text-div">
					<label for="" >物流模块：</label>
					<span class="review-con-text-div-con">{{dataList.templateName}}</span>
				</div>
				<div class="review-con-text-div hr">
					<label for="" >通用产品代码：</label>
					<span class="review-con-text-div-con">{{dataList.upcNo}}</span>
				</div>

				<div class="hr">
					<div class="review-con-text-div" v-for="(item,index) in dataList.productComboDomainList" :key='index'>
						<label for="" >套餐名称：</label>
						<span class="review-con-text-div-con">{{item.comboName}}</span>
						<label for="" >库存数量：</label>
						<span class="review-con-text-div-con">{{item.qty}}</span>
						<label for="" >市场价：</label>
						<span class="review-con-text-div-con">{{item.mktPrice}}</span>
						<label for="" >套餐价：</label>
						<span class="review-con-text-div-con">{{item.price}}</span>
						<label for="" >结算价：</label>
						<span class="review-con-text-div-con">{{item.settlementPrice}}</span>
						<label for="" >空中服务佣金：</label>
						<span class="review-con-text-div-con">{{item.personCommissionPrice}}</span>
						<label for="" >门店服务佣金：</label>
						<span class="review-con-text-div-con">{{item.storeCommissionPrice}}</span>
						<label for="" >分公司佣金：</label>
						<span class="review-con-text-div-con">{{item.branchCommissionPrice}}</span>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
  import zzuRichText from '@/components/rich-text'

  export default {
    components: {zzuRichText},
		data(){
			return {
				dataList:"",
			}
		},
		mounted(){
//			console.log(this.$route.query.id)
//			let id=this.$route.query.id
			this.$http.get('/store/Product/findById', {
				params:{
					id:this.$route.query.id
				}
			}).then(response => {
				    //请求正确时执行的代码
				    console.log(response)
				    if(response.data.code==0){
							this.dataList = response.data.data
							if(this.dataList.isLocalProd==true || this.dataList.isReduceStock==true || this.dataList.isShipping==true || this.dataList.isIncFreightFee==true || this.dataList.isRecommend==true){
								this.dataList.isLocalProd='是'
								this.dataList.isReduceStock='是'
								this.dataList.isShipping='是'
								this.dataList.isIncFreightFee='是'
								this.dataList.isRecommend='是'
							}else{
								this.dataList.isLocalProd='否'
								this.dataList.isReduceStock='否'
								this.dataList.isShipping='否'
								this.dataList.isIncFreightFee='否'
								this.dataList.isRecommend='否'
							}
				    }

				}).catch(function(response){
				    console.log(response);//发生错误时执行的代码
				})
		},
	}
</script>

<style lang="scss" scoped="scoped">
	ul{
		margin-left: 110px;
	}
	.ul-text{
		display: inline-block;
		margin-left: 20px;
	}
	li{
		list-style-type:circle;
		font-weight: normal;
	}
	.el-form-item__label{
		font-weight: bolder;
	}
	.review-content-title{
		border-bottom: 1px dotted #eee;
		padding-bottom: 20px;
		margin:20px;
	}
	/*.reviewDemo-ruleForm{
		padding-left: 10px;
		padding-bottom: 20px;
		border-bottom: 1px dotted #eee;
		margin-bottom: 20px;
	}*/
	.review-con-text .el-form-item--mini.el-form-item, .review-con-text .el-form-item--small.el-form-item {
    margin-bottom: 0px;
	}
	.review-con-text-div{
		font-size: 14px;
		font-weight: bolder;
		margin-left: 20px;
		padding: 5px;
		.review-con-text-div-con{
			font-weight: normal;
			display: inline-block;
			margin-right: 10px;
		}
	}
	.hr{
		border-bottom: 1px solid #eee;
		padding-bottom:20px ;
		margin-bottom:20px ;
	}


</style>
