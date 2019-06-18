<template>
	<div>
		<zzu-calendar @select="selectDateHandler" :is-cross-month="true" :is-show-past-time-checked="false" :date-list="dateList" date-name="stockDate" tip-name="tip" body-name="cxt" checked-name="isAvailable" class="zzu-calendar" width="800px" height="700px">
		</zzu-calendar>
	</div>
</template>

<script>
	import ZzuCalendar from '@/components/ZzuCalendar'

	export default {
		name: "UseCalendar",
		components: {
			ZzuCalendar
		},
		data() {
			return {
				dateList: [{
						id: 1,
						opUserId: 1,
						ownerId: 1,
						stockDate: '2018-05-26',
						gtInstId: 6,
						stockQty: 120,
						stockConfirmQty: 30,
						soldQty: 20,
						minPeople: 1,
						maxPeople: 5,
						tip: '日期：2018-05-26 库存：150<br/>成人价 ¥:80.00<br/>儿童价 ¥:30.00',
						cxt: '<span style="color: #f93">¥: 80.00</span>',
						isAvailable: true,
						adultPrice: 80.00,
						adultMktPrice: 100.00,
						childrenPrice: 30.00
					},
					{
						id: 2,
						opUserId: 1,
						ownerId: 1,
						stockDate: '2018-06-28',
						gtInstId: 6,
						stockQty: 80,
						stockConfirmQty: 25,
						soldQty: 7,
						minPeople: 1,
						maxPeople: 5,
						tip: '日期：2018-06-28 库存：105<br/>成人价 ¥:80.00<br/>儿童价 ¥:30.00',
						cxt: '<span style="color: #f93">¥: 80.00</span>',
						isAvailable: true,
						adultPrice: 80.00,
						adultMktPrice: 100.00,
						childrenPrice: 30.00
					}, {
						id: 3,
						opUserId: 1,
						ownerId: 1,
						stockDate: '2018-06-21',
						gtInstId: 6,
						stockQty: 150,
						stockConfirmQty: 60,
						soldQty: 17,
						minPeople: 1,
						maxPeople: 5,
						adultPrice: 80.00,
						adultMktPrice: 100.00,
						childrenPrice: 30.00
					}, {
						id: 4,
						opUserId: 1,
						ownerId: 1,
						stockDate: '2018-05-17',
						gtInstId: 6,
						stockQty: 50,
						stockConfirmQty: 10,
						soldQty: 30,
						minPeople: 1,
						maxPeople: 5,
						tip: '日期：2018-05-17 库存：60<br/>成人价 ¥:80.00<br/>儿童价 ¥:30.00',
						cxt: '<span style="color: #f93">¥: 80.00</span>',
						isAvailable: true,
						adultPrice: 80.00,
						adultMktPrice: 100.00,
						childrenPrice: 30.00
					}
				]
			}
		},
		methods: {
			selectDateHandler(dateList) {
				console.log('your selected date list -> ', dateList)
			},
			removeHandler() {
				this.dateList.pop()
			}
		}
	}
</script>

<style lang="stylus">
	.zzu-calendar{
		margin 40px auto
	}
</style>