<!-- 
	聊天页面
 -->

<template>
	<div class="chat">
		<div class="chat-left" >
			<!-- <zzu-chat-user @click.native="chooseUser(index)" :class="{ 'active': index == chatData.selected }" v-for="(item, index) in userInfo" :chat-data="userInfo" :key="index"></zzu-chat-user> -->
			<div @click="chooseUser(index,item.mobile)" :class="['chat-user',{ 'active': index == chatData.selected }]" v-for="(item, index) in userInfo"  :key="index">
				<div class="chat-user-img" :style="{backgroundImage: 'url(' + item.avatar + ')'}"></div>
				<div class="chat-user-content">
					<p>{{ item.nickName }}</p>
					<span>{{ item.mobile }}</span>
				</div>
		  </div>

		</div>
		<div class="chat-right" v-if="msgList[0]" >
			<zzu-chat-info @send="socketSend" :my-msg-data="msgLists"  ></zzu-chat-info>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import zzuChatInfo from "@/components/chat-info";
import zzuChatUser from "@/components/chat-user";

import imgHeader from "@/assets/img/chat/header.png";

class ChatMsg {
  constructor(msg, fromMobile, toMobile, avatar, nickName) {
    this.msg = msg;
    this.fromMobile = fromMobile;
    this.toMobile = toMobile;
    this.avatar = avatar;
    this.nickName = nickName;
  }
}
export default {
  name: "chat",
  components: {
    zzuChatInfo,
    zzuChatUser
  },
  data() {
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
              mobile: "15021417505"
            },
            friend: {
              id: "",
              name: "飞飞",
              img: imgHeader,
              mobile: "15021417505"
            }
          }
        ]
      },
      server: {
        mobile: this.$store.state.user.mobile,
        nickName: "super管理员",
        avatar: imgHeader,
        travel: true,
        newConnect: true
      },
      userInfo: [
        //   {
        //   mobile:'',
        //   avatar:'',
        //   nickName:''
        //   }
      ],
      msgList: [], //总消息
      msgLists: [] //匹配过后的消息
    };
  },
  watch: {
    msgList() {
      //监听第一条消息过来的时候把
      if (this.msgList.length!=0 && this.userInfo.length == 1) { //暂时存在客服无操作时所有人发送过来的消息全部到第一个    
        this.msgLists = this.msgList;                            //页面中(msgList数组与第一个联系的拆分数组msgLists相等)
        console.log("触发监听");
      }
    },
    msgLists(newValue,oldValue){
      console.log(newValue,oldValue,'数组变化')
    }
  },
  mounted() {
    this.socketLogin();
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    socketLogin() {
      this.$httpSocket.post("serviceInnerLogin", this.server).then(rs => {
        if (rs.data.code == 0) {
          this.socketInit();
        }
      });
    },
    socketInit() {
      let mobile = this.user.mobile;
      this.ws = new WebSocket(
        `ws://192.168.12.5:8100/myTextHandler?mobile=${mobile}`
      );

      this.ws.onopen = () => {
        alert("open");
        // this.socketSend('hello');
        // alert('已经say hello')
      };

      this.ws.onmessage = msg => {
        var data = JSON.parse(msg.data);
        console.log(data, "用户信息");
        //判断是否为第一次连接遍历联系人列表中是否已存在  列表为空时直接push到联系人列表
        if (data.newConnect == true && this.userInfo.length!=0) {
          console.log(this.userInfo,'555')
          this.userInfo.map(item => {
            if (item.mobile == data.fromMobile) {
              return;
            } else {
              this.userInfo.push({
                nickName: data.nickName,
                avatar: data.avatar,
                mobile: data.fromMobile
              });
            }
          });
        }else if(data.newConnect==true){
           this.userInfo.push({
                nickName: data.nickName,
                avatar: data.avatar,
                mobile: data.fromMobile
              });
        }
        this.socketReceive(msg);
      };

      this.ws.onclose = () => {
        alert("onclose");
      };
    },
    socketSend(UserMsg) {
      
      if (!this.ws) return;
      if (this.ws.readyState == WebSocket.OPEN) {
        // let msg = new ChatMsg(UserMsg, this.user.mobile, this.chatData.service.mobile, this.chatData.newConnect, this.user.imge,this.user.name)
        // console.log(msg)
        let msg = new ChatMsg(
          UserMsg,
          this.server.mobile,
          this.userInfo[this.chatData.selected].mobile,
          this.server.avatar,
          this.server.nickName
        );
        // this.ws.send(msg);
        this.$httpSocket.post("/serviceMsg", msg).then(rs => {
          if (this.newConnect) this.newConnect = false;
          if (rs.data.code == 0) {
            // this.msgList.push(msg) //向数组推送自己发出的消息
            this.socketReceive(msg);
          }
          console.log("send rs -> ", rs);
        });
      } else {
        alert("WebSocket 连接没有建立成功！");
      }
    },
    socketReceive(data) {
      console.log(data, "收到");
      if (data.toMobile == undefined) {
        //判断是自己发出的还是收到的
        let datas = JSON.parse(data.data);
        if (datas.nickName != undefined) {
          //过滤第一条无用数据
          this.msgList.push(datas);
          //收到时触发函数整理数组
          
          this.chooseUser( this.chatData.selected,datas.fromMobile)
        }
      } else {
        this.msgList.push(data); //客服发出的消息
        //发送时触发函数整理数组
        this.chooseUser(this.chatData.selected,data.toMobile)
      }
    },
    chooseUser(ind, mob) {
      var list = [];
      console.log(mob, this.msgList, "选择对象时的总记录");
      // console.log(mob,this.msgList[1].mobile)
      this.msgList.map(item => {
        if (item.fromMobile  == mob || item.toMobile == mob) {
          list.push({
            msg: item.msg,
            fromMobile: item.fromMobile,
            toMobile: item.toMobile,
            avatar: item.avatar,
            nickName: item.nickName,
            newConnect: item.newConnect || false
          })
         
        }
      })
      console.log(this.userInfo[ind].mobile,mob,'ififif')
      console.log(this.userInfo)
      if(this.userInfo[ind].mobile == mob){
        console.log('进来了！')
         this.msgLists = list; //拆分所有消息数组 根据电话匹配消息
      }
      console.log(this.msgLists,'聊天记录')
      this.chatData.selected = ind;
      console.log(this.chatData.selected, ind);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/core/index";

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
    background-color: #bfefff;
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

    p,
    span {
      @include ellipsisMore(1);
    }
  }
}
</style>