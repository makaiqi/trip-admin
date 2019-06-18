<!-- 
	udc 获取数据示例
 -->

<template>
	<div>
		<zzu-email :to="emailData.to"></zzu-email>
		<zzu-udc v-model="udcData.value" :udc-code="udcData.udcCode" v-on:input="listenToMyBoy"></zzu-udc>
	</div>
</template>

<script type="text/babel">
	import zzuUdc from '@/components/udc'
	import zzuEmail from '@/components/email'

	export default {
		name: "udc",
		components: {
			zzuUdc, zzuEmail
		},
		data () {
			return {
				emailData: {
					to: ["qiruiyin@126.com"]
				},
				udcData: {
					value: '',
					udcCode:'UDC_M06_T01'
				}
			}
		},
		mounted () {
			// this.fetchData('MM');
		},
		methods: {
			listenToMyBoy(msg){
//				console.log(msg)
				this.$emit('input', msg);
			}
			
		}
	}
</script>

<style lang="scss">
	@import '~@/assets/css/core/index';

</style>