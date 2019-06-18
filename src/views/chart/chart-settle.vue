<!--
	结算
 -->

<template>
	<div class="chart-block">
		<div class="chart-block-chart">
			<div class="chart-pie" ref="pie"></div>
			<div class="chart-pie" ref="pieType"></div>
		</div>
		<div class="chart-block-table">
			<el-form ref="formSearch" v-model="tableList.query" :inline="true">
        <el-form-item prop="search">
          <el-input clearable v-model="tableList.query.search" placeholder="内容名称检索"></el-input>
        </el-form-item>
      </el-form>

      <el-table
        ref="multipleTable"
        :data="tableList.data.rows"
        border
        tooltip-effect="dark"
        style="width: 100%"
        class="base-block-table">

        <template v-for="item in tableList.columns">
          <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
          </el-table-column>
        </template>
      </el-table>
		</div>
	</div>
</template>

<script>
	export default {
		name: "zzuChartSettle",
		data () {
			return {
				tableList: {
          title: "内容列表",
          query: {
            search: '', // 内容名称， 模糊查询
            cityId: '', // 内容所在城市
          },
          selection: [],
          loading: false,
          columns: [
            {
              title: '标题',
              key: 'title',
              fixed: 'left',
            }
          ],
          data: {
            total: 0,
            rows: [
            	{
            		title: "是川沙大"
            	},{
            		title: "是川沙大"
            	},{
            		title: "是川沙大"
            	},{
            		title: "是川沙大"
            	},{
            		title: "是川沙大"
            	}
            ]
          }
        },
				pieData: {
					legendData: [],
					selected: {},
					seriesData: [
						{
	            name: "已拒绝",
	            value: Math.round(Math.random() * 100000)
	        	},{
	            name: "已结算",
	            value: Math.round(Math.random() * 100000)
	        	}
					]
				},
				pieTypeData: {
					legendData: [],
					selected: {},
					seriesData: [
						{
	            name: "旅游",
	            value: Math.round(Math.random() * 100000)
	        	},{
	            name: "电商",
	            value: Math.round(Math.random() * 100000)
	        	}
					]
				},
			}
		},
		mounted () {
				this.initPie(this.$refs.pie, this.pieData);
				this.initPie(this.$refs.pieType, this.pieTypeData);
		},
		methods: {
			fetchData () {

			},
			initPie (dom, data) {
				// 基于准备好的dom，初始化echarts实例
				let myChart = this.$echarts.init(dom);
				// 绘制图表
				myChart.setOption({
				    title : {
			        text: '',
			        subtext: '',
			        x:'center'
				    },
				    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
			        type: 'scroll',
			        orient: 'vertical',
			        left: 10,
			        right: 10,
			        top: 20,
			        bottom: 20,
			        data: data.legendData,
			        selected: data.selected
				    },
				    series : [
			        {
		            name: '',
		            type: 'pie',
		            radius : '35%',
		            center: ['50%', '50%'],
		            data: data.seriesData,
		            itemStyle: {
	                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
		            }
			        }
				    ]
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/css/core/index';

	.chart-block {
		width: 100%;
		display: flex;

		&-chart {
			flex: 1;
			display: flex;
		}

		&-table {
			flex: 1;
		}
	}

	.chart-pie {
		width: 50%;
		height: 400px;
		display: inline-block;
	}
</style>
