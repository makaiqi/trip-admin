<!--
	库存日历
 -->

<template>
	<div class="stock-calendar page-container">
		<div class="stock-calendar-left">

			<full-calendar :events="fcEvents" locale="en"></full-calendar>

			<!-- <ZzuCalendar
	      @choseDay="clickDay"
	      @changeMonth="changeDate"
	      @isToday="clickToday"
	      :markArray=[20,21]
	    ></ZzuCalendar> -->
		</div>
		<div class="stock-calendar-right">
		</div>
	</div>
</template>

<script type="text/babel">
	import moment from 'moment'

	export default {
		name: "stockCalendar",
		data () {
			return {
				fcEvents: [
			    {
			      title : 'Sunny Out of Office',
			      start : '2016-08-25',
			      end : '2017-07-27'
			    }
				]
			}
		},
		mounted () {
			console.log(moment);
		},
		methods: {
			clickDay(data) {
				console.log("clickDay");
	      console.log(data); //选中某天
	    },
	    changeDate(data) {
	      console.log(data); //左右点击切换月份
	    },
	    clickToday(data) {
	      console.log(data); //跳到了本月
	    }
		}
	}
</script>

<style lang="scss">
	@import '~@/assets/css/core/index';


</style>
