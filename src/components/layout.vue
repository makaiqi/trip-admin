<!--
	项目布局框架
 -->

<template>
  <el-container class="zzu-layout">
    <el-aside class="zzu-aside" width="200px">
      <div class="brand">
        <a href="#" class="brand-link">
          <img src="../assets/image/logo.png" width="200px">
        </a>
      </div>
      <el-menu
        :default-active="menuData.active"
        class="zzu-menu"
        @open="handleOpen"
        @close="handleClose"
        :collapse="menuData.isCollapse"
      >
        <zzu-menu-item :menu-data="menuData.list"></zzu-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="zzu-header">
        <section>
          <el-dropdown class="zzu-account">
            <span class="el-dropdown-link">
              用户名称
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in userBtns"
                :key="item.value"
                @click.native="handlerUserClick(item.value)"
              >{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="account-type">主帐号</span>
          <span class="msg-center" @click="goPage({name: 'msgCenter'})">
            <el-badge :value="100" :max="10" class="item">
              <i class="el-icon-message"></i>
            </el-badge>
          </span>
          <span title="客服服务" class="presale-chat" @click="showChat">
            <i class="el-icon-service"></i>
          </span>
          <span title="我的钱包" class="my-wallet" @click="goPage({name: 'myWallet'})">
            <i class="el-icon-setting"></i>
          </span>
        </section>
      </el-header>

      <el-main class="zzu-main">
        <router-view/>
      </el-main>

      <!-- <el-footer class="zzu-footer">Footer</el-footer> -->
    </el-container>

    <el-dialog title="客服消息" :visible.sync="chat.visible">
      <zzu-chat></zzu-chat>
    </el-dialog>
  </el-container>
</template>

<script type="text/babel">
import { mapState } from "vuex";
import Icon from "@fortawesome/vue-fontawesome";
import zzuMenuItem from "@/components/menu-item";
import zzuChat from "@/components/chat";

export default {
  name: "layout",
  components: {
    zzuMenuItem,
    zzuChat
  },
  data() {
    return {
      chat: {
        visible: false
      },
      menuData: {
        isCollapse: false,
        active: "1",
        list: []
      },
      productData: {
        active: "groupTravel",
        list: [
          {
            label: "跟团游",
            value: "groupTravel"
          },
          {
            label: "门票",
            value: "ticket"
          },
          {
            label: "自由行",
            value: "freeTravel"
          }
        ]
      },
      btnData: {},
      userBtns: [
        {
          label: "帐号管理",
          value: "account"
        },
        {
          label: "我的信息",
          value: "userInfo"
        },
        {
          label: "系统设置",
          value: "setting"
        },
        {
          label: "退出登录",
          value: "logout"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  mounted() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      let userId,
        user = JSON.parse(sessionStorage.getItem("user"));

      userId = this.user.userId || user.id;

      this.$http
        .get("arch/Menu/list", {
          params: {
            userId: userId
          }
        })
        .then(rs => {
          if (rs.data.code == 0) {
            if (rs.data.data.length > 0) {
              let transData = rs.data.data.map((item, index) => {
                return Object.assign({ children: [] }, item);
              });
              this.menuData.list = transData;
            } else {
              this.menu.list = [];
            }
          }
        })
        .catch();
    },
    handleOpen() {
      // 展开茶蛋
    },
    handleClose() {
      // 关闭菜单
    },
    handlerUserClick(data) {
      // 用户信息按钮点击事件
      if (data == "logout") {
        this.logout();
      }
    },
    logout() {
      // 退出
      this.$http.get("arch/User/exit").then(rs => {
        this.sessionStorage.removeItem("user");
        this.$router.push({ name: "login" });
      });
    },
    showChat() {
      this.$router.push({ name: "chat" });
      // this.chat.visible = true;
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/css/core/index";

$menuBg: #26304a;
$menuBgActive: #2f3a5a;

.zzu-layout {
  width: 100%;
  height: 100%;
}

.zzu-aside {
  width: 200px;
  background-color: $menuBg;
  background: linear-gradient(350deg, $menuBg, #49547c);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .el-menu {
    flex: 1;
    border-right-width: 0;
    background: transparent;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .el-menu-item,
  .el-submenu__title {
    color: hsla(0, 0%, 100%, 0.7);

    &:focus,
    &:hover {
      background: transparent;
      color: #fff;
    }
  }

  .el-submenu {
    &.is-opened,
    &:hover {
      background: $menuBgActive;
    }
  }

  .el-menu-item-group__title {
    padding: 0;
  }

  .zzu-menu-icon {
    width: 24px;
  }

  .brand {
    width: 200px;
    height: 86px;
    text-align: center;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 36px;
    flex: 0 0 36px;
    z-index: 9;
  }

  .brand-link {
    height: 100%;
    text-decoration: none;
    cursor: pointer;
    display: block;
  }
}

.zzu-header {
  @extend %clearfix;
  min-width: 580px;
  padding: 15px $padding;
  line-height: 30px;
  border-bottom: 1px solid $borderColor;

  .zzu-header-product {
    float: left;
  }

  .zzu-account {
    float: right;
    cursor: pointer;
  }

  .msg-center,
  .presale-chat,
  .my-wallet {
    float: right;
    margin-right: 16px;
    padding: 0 10px;
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
    cursor: pointer;
    display: block;

    i {
      font-size: 20px;
    }
  }

  .account-type {
    float: right;
    background-color: #545e80;
    padding: 0 5px;
    margin-top: 6px;
    height: 18px;
    display: block;
    border-radius: 9px;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    font-weight: 600;
    margin-right: 10px;
    color: #fafcff;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: PingFangSC;
  }

  // .msg-center {
  // }

  // .presale-chat {
  // }

  // .my-wallet {
  // }
}

.zzu-main {
  padding: 0;
  height: 100%;
}

.zzu-footer {
  border-top: 1px solid $borderColor;
}
</style>

