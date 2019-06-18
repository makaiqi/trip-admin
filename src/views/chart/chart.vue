<!-- 
	图表
 -->

<template>
	<div class="chart">
		<el-tabs v-model="chartData.selected" type="card">
	    <el-tab-pane v-for="(item, index) in chartData.list" :label="item.label" :name="item.name" :key="index">
    		<zzu-chart-settle v-if="item.name == 'settle'"></zzu-chart-settle>
    		<zzu-chart-order v-else-if="item.name == 'order'"></zzu-chart-order>
    		<zzu-chart-order-member v-else-if="item.name == 'orderMember'"></zzu-chart-order-member>
    		<zzu-chart-order-limit v-else></zzu-chart-order-limit>
	    </el-tab-pane>
	  </el-tabs>
	</div>
</template>

<script>
	import zzuChartSettle from "./chart-settle"
	import zzuChartOrder from "./chart-order"
	import zzuChartOrderMember from "./chart-order-member"
	import zzuChartOrderLimit from "./chart-order-limit"

	export default {
		name: "chart",
		components: {
			zzuChartSettle,
			zzuChartOrder,
			zzuChartOrderMember,
			zzuChartOrderLimit
		},
		data () {
			return {
				chartData: {
					selected: 'settle',
					list: [
						{
							label: "结算",
							name: "settle"
						},{
							label: "订单统计",
							name: "order"
						},{
							label: "会员状态",
							name: "orderMember"
						},{
							label: "限时购",
							name: "orderLimit"
						}
					]
				}
			}
		},
		mounted () {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/css/core/index';
	
	.chart {
		height: 100%;
		padding: $padding;
	}
</style>