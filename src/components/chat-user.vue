<!-- 
	聊天人信息
 -->

<template>
<div>
	<div class="chat-user" v-for="(item,index) in chatData" :key="index">
		<div class="chat-user-img" :style="{backgroundImage: 'url(' + item.avatar + ')'}"></div>
		<div class="chat-user-content">
			<p>{{ item.nickName }}</p>
			<span>{{ item.mobile }}</span>
		</div>
	</div>
</div>
</template>

<script>
	import imgHeader from '@/assets/img/chat/header.png'

	export default {
		name: "zzuChatUser",
		props: {
			chatData: {
				type: Array,
				default: function () {
					return {
						img: imgHeader,
						name: "名称",
						mobile: "15021417505"
					}
				}
			}
		},
		data () {
			return {

			}
		},
		mounted () {
			console.log(this.chatData)
		}
	}
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
  
  $chatUserW: 180px;
  $chatImgW: 44px;

	.chat-user {
		padding: 10px;
		line-height: 1.75;
		border-bottom: 1px solid $borderColor;
		display: flex;

		&.active {
			// background: #eee;
			// color: #fff;
			background-color: red;
		}

		&-img {
			width: $chatImgW;
			height: $chatImgW;
			background: red no-repeat;
			background-size: 100%;
			border-radius: $chatImgW;
		}

		&-content {
			flex: 1;
			padding-top: 4px;
			padding-left: 10px;

			p, span {
				@include ellipsisMore(1);
			}
		}
	}
</style>