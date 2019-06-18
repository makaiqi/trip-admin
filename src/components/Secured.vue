<template lang="pug">
  Container
    Aside#side-menu(width="150px")
      Menu
        MenuItem(index="dashboard")
          template(slot="title")
            Icon(:icon="faHome")
            span 首页
        Submenu(index="sys")
          template(slot="title")
            i.el-icon-setting
            span 系统管理
          MenuItemGroup(index="fnd")
            template(slot="title") 日志
            MenuItem(index="fnd_log_list") 日志查看
          MenuItemGroup(index="user")
            template(slot="title") 用户
            MenuItem(index="s_user_list") 用户管理
            MenuItem(index="fnd_role_list") 角色管理
            MenuItem(index="fnd_menu_list") 菜单管理
        Submenu(index="biz")
          template(slot="title")
            i.el-icon-tickets
            span 基础数据
          MenuItemGroup(index="user")
            template(slot="title") 基础
            MenuItem(index="udc_list") 字典维护
            MenuItem(index="area_list") 区域维护
          MenuItemGroup(index="travel")
            template(slot="title") 旅游
            MenuItem(index="hotel_list") 酒店列表
            MenuItem(index="scenic_list") 景点列表
            MenuItem(index="restaurant_list") 餐厅列表
            MenuItem(index="shopping_list") 购物点列表
            MenuItem(index="ticket_type_list") 票种列表
          MenuItemGroup(index="vendor")
            template(slot="title") 合作商
            MenuItem(index="biz_vendor_list") 合作商列表
        Submenu(index="content")
          template(slot="title")
            i.el-icon-news
            span 内容管理
          MenuItem(index="ad_list") 广告维护
          MenuItem(index="content_list") 内容管理
          MenuItem(index="event_list") 活动管理
        Submenu(index="product")
          template(slot="title")
            i.el-icon-goods
            span 产品管理
          MenuItemGroup(index="ft")
            template(slot="title") 自由行
            MenuItem(index="ft_product_list") 产品列表
            MenuItem(index="ft_product_create") 产品上架
          MenuItemGroup(index="gt")
            template(slot="title") 跟团游
            MenuItem(index="gt_product_list") 产品列表
            MenuItem(index="gt_product_create") 产品上架
          MenuItemGroup(index="tk")
            template(slot="title") 门票
            MenuItem(index="tk_product_list") 产品列表
            MenuItem(index="tk_product_create") 产品上架
          MenuItemGroup(index="mall")
            template(slot="title") 电商
            MenuItem(index="tk_product_list") 产品管理
        Submenu(index="order")
          template(slot="title")
            Icon(:icon="faFileAlt")
            span 订单管理
          MenuItemGroup(index="travle_orders")
            template(slot="title") 旅游订单
            MenuItem(index="travel_order_list") 订单列表
            MenuItem(index="travel_order_waiting_list") 待出票订单
          MenuItemGroup(index="mall_orders")
            template(slot="title") 电商订单
            MenuItem(index="mall_order_list") 订单列表
            MenuItem(index="mall_order_refunding") 申诉退款订单
        Submenu(index="finance")
          template(slot="title")
            Icon(:icon="faDollarSign")
            span 对账结算
          MenuItem(index="account_statement") 对账单
          MenuItem(index="order_finished") 已结算订单
          MenuItem(index="order_in_queue") 可结算订单
    Container(direction="vertical")
      Header#header
        Dropdown
          span.el-dropdown-link
            | 管理员
            i.el-icon-arrow-down.el-icon--right
          DropdownMenu(slot="dropdown")
            DropdownItem 退出登录
      Main
        router-view
</template>

<script>
  import Icon from '@fortawesome/vue-fontawesome'
  import {faHome, faFileAlt, faDollarSign, faUser} from '@fortawesome/fontawesome-free-solid'

  import {
    Container,
    Header,
    Aside,
    Main,
    MenuItem,
    MenuItemGroup,
    Menu,
    Submenu,
    DropdownMenu,
    DropdownItem,
    Dropdown,
    Button
  } from 'element-ui'

  export default {
    name: 'Secured',
    components: {
      Container, Aside, Main, Menu, MenuItem, MenuItemGroup, Submenu, Header, DropdownMenu,
      DropdownItem, Button, Dropdown,
      Icon
    },
    data() {
      return {
        faHome, faFileAlt, faDollarSign, faUser
      }
    },
    methods: {},
    mounted() {
    }
  }
</script>

<style lang="scss">

  #side-menu {
    overflow-x: hidden;
    .el-submenu__title {
      background: #dfdfdf;
    }
    svg.svg-inline--fa {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
      color: #909399;
    }
  }

  #header {
    text-align: right;
    padding-top: 5px;
  }
</style>

