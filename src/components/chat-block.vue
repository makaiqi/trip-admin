<!-- 
	聊天块
 -->

<template>
	<!-- <div :class="['chat-block', { 'chat-block-right' : this.type == 'right' , 'chat-block-img': chatData.type == 'img' }]">
		<div class="chat-block-header" :style="{ backgroundImage: 'url(' + chatData.header + ')' }"></div>
		<div class="chat-block-info">		
			<img v-if="chatData.type == 'img'" :src="chatData.msg">
			<p v-else>{{ chatData.msg }}</p>
		</div>
	</div> -->
	<div>
		<div  :class="['chat-block', { 'chat-block-right':myMsgData.fromMobile==user.mobile ,'chat-block-img':chatData.type == 'img' }]">
			<div class="chat-block-header" :style="{ backgroundImage: 'url(' + myMsgData.avatar + ')' }"></div>
			<div class="chat-block-info">		
				<!-- <img v-if="chatData.type == 'img'" :src="chatData.msg"> -->
				<p>{{ myMsgData.msg }}</p>
			</div>
		</div>	
	</div>
</template>

<script>
	import imgHeader from '@/assets/img/chat/header.png'
	import imgImg from '@/assets/img/chat/img.png'
	import {mapState} from 'vuex'
	export default {
		name: "zzuChatBlock",
		props: {
			type: { //  
				type: String,
				default: 'left'
			},
			myMsgData:{
				type:Object,
			},
		},
		data () {
			return {
				chatData: {
					typeGrade:"right",
					header: imgHeader,
					msg: imgImg,
					type: "text" // text 文字， img 图片
				}
			}
		},
		computed: {
      ...mapState({
        user: state => state.user
      })
    },
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/css/core/index';
	
	$chatPadding: 15px;
	$chatHeaderWidth: 40px;

	.chat-block {
		@extend %clearfix;
    position: relative;
		padding: 0 $chatPadding + 40px;
		margin: $chatPadding auto;
		text-align: left;

		&.chat-block-right {
			.chat-block-header {
				left: auto;
				right: $chatPadding;
			}

			.chat-block-info {
				float: right;
				margin-right: 15px;
				background-color: #347AFE;
				color: #fff;

				&:before {
					left: auto;
					right: -4px;
					background-image: url("~@/assets/img/chat/right.png");
				}
			}
		}

		&.chat-block-img {
			.chat-block-info {
				padding: $chatPadding;
			}
		}

		&-header {
			position: absolute;
			left: $chatPadding;
			width: $chatHeaderWidth;
			height: $chatHeaderWidth;
			background: no-repeat;
			background-size: 100%; 
			border-radius: $chatHeaderWidth;
		}

		&-info {
			position: relative;
			float: left;
			margin-left: 15px;
			margin-top: 4px;
			line-height: 1.75;
			padding: 4px $chatPadding;
			background: #eee;
			border-radius: $radius;

			&:before {
				content: "";
				position: absolute;
				top: 0;
				left: -4px;
				width: 4px;
				height: 30px;
				background: url("~@/assets/img/chat/left.png") no-repeat;
			}

			img {
				max-width: 100%;
			}

			p {
				line-height: 1.75;
			}
		}
	}
</style>