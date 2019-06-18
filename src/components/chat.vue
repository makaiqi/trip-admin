<!-- 
	聊天页面
 -->

<template>
	<div class="chat">
		<div class="chat-left">
			<zzu-chat-user :class="{ 'active': index == chatData.selected }" v-for="(item, index) in chatData.list" :chat-data="item.friend" :key="index"></zzu-chat-user>
		</div>
		<div class="chat-right">
			<zzu-chat-info v-for="(item, index) in chatData.list" :chat-data="item" :key="index"></zzu-chat-info>
		</div>
	</div>
</template>

<script>
	import zzuChatInfo from '@/components/chat-info'
	import zzuChatUser from '@/components/chat-user'

	import imgHeader from '@/assets/img/chat/header.png'

	export default {
		name: "chat",
		components: {
			zzuChatInfo, zzuChatUser
		},
		data () {
			return {
				chatData: {
					title: "",
					selected: 0,
					list: [
						{
							self: {
								id: "",
								name: "自己",
								img: imgHeader,
								mobile: "15021417505",
							},
							friend: {
								id: "",
								name: "飞飞",
								img: imgHeader,
								mobile: "15021417505",
							}
						}
					],

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

  $chatUserW: 180px;

	.chat {
		height: 100%;
		overflow: hidden;
		display: flex;

		&-left {
			width: $chatUserW;
			height: 100%;
			overflow: auto;
			border-right: 1px solid $borderColor;
		}

		&-right {
			flex: 1;
		}
	}

</style>