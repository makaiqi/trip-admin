<!--
	结算
 -->

<template>
  <div class="chart-block">
    <div class="chart-block-chart">
      <div class="chart-pie" ref="pie"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "zzuChartSettle",
    data () {
      return {
        myChart: '',
        option: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:[]
          },
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel:{
              interval:'auto',
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [

          ]
        }
      }
    },
    mounted () {
      this.myChart = this.$echarts.init(this.$refs.pie)
      this.myChart.setOption(this.option)
    },
    methods: {
      refreshData(data){
        console.log(data)
        let api = 'deal/FlowBill/findReport?paySubMerchantId=' + data.paySubMerchantId
          + "&reportType=" + data.dateType + "&paySubStoreId=" + data.paySubStoreId+"&reportName="+data.reportName+"&number="+data.number;
        this.$http.get(api).then(res => {
          let opt = res.data.data;
          this.handleOpt(opt);
          //更新数据
          this.myChart.setOption(this.option);
        })
      },
      handleOpt(opt) {
        this.option.series = [];
        opt.forEach((item, index) => {
          let tmpArr = item.data.map(i => {
            return i === null ? 0 : i
          })
          this.option.series.push({
            name: item.name,
            type:'line',
            stack: '总量',
            data: tmpArr,
          })
        })
        this.option.xAxis.data = opt[0].xaxis;
        this.option.legend.data = opt[0].legend;
        console.log(this.option)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';

  .chart-block {
    margin: 20px auto;
    width: 800px;
    height: 500px;
  }

  .chart-pie {
    width: 750px;
    height: 750px;
    display: inline-block;
  }
</style>
