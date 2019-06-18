<!-- 
	聊天页面
 -->

<template>
	<div class="chat-info">
		<div class="chat-info-title">{{ myMsgData[0].nickName }}（已连接）</div>
		<div class="chat-info-content">
			<div class="load-history" @click="loadHistory">查看更多</div>
			<zzu-chat-block v-for="(item,index) in myMsgData" :key="index" :my-msg-data="item"></zzu-chat-block>
		</div>
		<div class="chat-info-send">
			<el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="record.send">
			</el-input>
			<el-button @click.native="send" type="success" class="chat-info-send-btn">发送</el-button>
		</div>
	</div>
</template>

<script>
	import zzuChatBlock from "@/components/chat-block"

	export default {
		name: "zzuChatInfo",
		components: {
			zzuChatBlock
		},
		props: {
			chatData: {
				type: Number,
				// default: function () {
				// 	return {
				// 		// self: {
				// 		// 	id: "",
				// 		// 	name: "自己",
				// 		// 	img: "",
				// 		// 	mobile: "15021417505",
				// 		// },
				// 		// friend: {
				// 		// 	id: "",
				// 		// 	name: "飞飞",
				// 		// 	img: "",
				// 		// 	mobile: "15021417505",
				// 		// }
				// 	}
				// }
			} ,
			myMsgData:{
				type:Array,
			},
		},
		data () {
			return {
				record: {
					send: '',
					linkStatus: false,
					query: {
						form: "",
						to: "",
						pageNum: 1,
						pageSize: 10
					},
					list: []
				}
			}
		},
		mounted () {
			console.log(this.myMsgData)	
		},
		methods: {
			loadHistory () {
				// 获取历史数据
			},
			send () {
				console.log(this.chatData+1,'666')
				this.$emit('send', this.record.send);
				this.record.send = "";
			}
		}
	}
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
	
	.chat-info {
		height: 100%;
		display: flex;
		flex-direction: column;

		&-title {
			height: 44px;
			line-height: 44px;
			padding: 0 20px;
			border-bottom: 1px solid $borderColor;
		}

		&-content {
			flex: 1;
			overflow: auto;
		}

		&-send {
			position: relative;
			height: 126px;

			&-btn {
				position: absolute;
				bottom: 20px;
				right: 20px;
			}
		}
	}

	.load-history {
		line-height: 30px;
		margin: 0 auto;
		text-align: center;
	}
</style>