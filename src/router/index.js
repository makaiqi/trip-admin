import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/components/layout'
import chart from '@/views/chart/chart'

import Home from '@/views/Home'

// 登录模块
import Login from '@/components/Login'
import pwdReset from '@/views/arch/pwd-reset'
// 聊天
import chat from '@/views/chat/chat'

//表格日历
import tabletime from '@/components/table-calendar'

// 基础表管理
import fndHotelList from '@/views/fnd/hotel-list'
import fndAreaList from '@/views/fnd/area-list'
import fndUserList from '@/views/fnd/user-list'
import fndRoleList from '@/views/fnd/role-list'
import fndRoleMenuList from '@/views/fnd/role-menu-list'
import fndScenicList from '@/views/fnd/scenic-list'
import fndRestaurantList from '@/views/fnd/restaurant-list'
import fndUdcList from '@/views/fnd/udc-list'
import fndUdcTypeList from '@/views/fnd/udc-type-list'
import fndMenuList from '@/views/fnd/menu-list'
import fndHotelRoomList from '@/views/fnd/hotel-room-list'
import fndShoppingPointList from '@/views/fnd/shopping-point-list'
import fndTicketTypeList from '@/views/fnd/ticket-type-list'
import fndVendorList from '@/views/fnd/vendor-list'
import fndVendorServiceList from '@/views/fnd/vendor-service-list'
import fndContentList from '@/views/fnd/content-list'
import fndRadioList from '@/views/fnd/radio-list'
import fndContentAddOrUpdate from '@/views/fnd/content-add-or-update'
import fndRadioAddOrUpdate from '@/views/fnd/radio-add-or-update'
import fndVisaAddOrUpdate from '@/views/fnd/visa-add-or-update'
import fndTypeList from '@/views/fnd/type-list'
import fndTagList from '@/views/fnd/tag-list'
import fndAdTypeList from '@/views/fnd/ad-type-list'
import fndAdList from '@/views/fnd/ad-list'
import fndWxMenuList from '@/views/fnd/wxMenu-list'
import fndCustomSwimList from '@/views/fnd/custom-swim-list'
import FtockCalenDar from '@/views/fnd/stock-calendar'
import fndEmail from '@/views/fnd/email'
import fndExpressCompany from '@/views/fnd/express-company'
import fndCloseScenic from '@/views/fnd/close-scenic'
import fndSellerManagement from '@/views/fnd/seller-management'
import fndSellerAddList from '@/views/fnd/seller-add-list'
import fndSellerAdd from '@/views/fnd/seller-add'
import fndSellerAddStaffList from '@/views/fnd/seller-add-staff-list'
import fndSellerBill from '@/views/fnd/seller-bill'
import fndSellerReport from '@/views/fnd/seller-report'
import fndSellerSettlement from '@/views/fnd/seller-settlement'
import fndMenuBundleList from '@/views/fnd/menu-bundle-list'
import fndFunList from '@/views/fnd/fun-list'
import fndSupplierList from '@/views/fnd/supplier-list'
import fndBundle from '@/views/fnd/bundle'
import fndStore from "@/views/fnd/store"
import fndBannerList from '@/views/fnd/banner-list'

//测试组件
import Calendar from '@/views/test/Calendar'
//测试组件
import Udc from '@/views/udc/udc'
import ZzuUpload from '@/views/test/zzu-upload'
import UseCalendar from '@/views/test/UseCalendar'
import UseCalendar2 from '@/views/test/UseCalendar2'
import Parent from '@/views/test/parent'
import GaodeMap from '@/views/test/GaodeMap'

// import groupTravelFee from '@/views/group-travel/add'

// 景点
import Scenic from '@/views/biz/scenic'
//电商
import productManagement from '@/views/electricity/product-management'
import productAdd from '@/views/electricity/add'
//import brandAdd from '@/views/electricity/brand/add'
import fndBrandList from '@/views/fnd/brand-list'

//待结算列表
import staySettlementList from '@/views/electricity/stay-settlement-list'
//退款列表详情页面
import productDetailsText from '@/views/electricity/productAdd/details/details-text'
//结算列表
import productSettlementList from '@/views/electricity/productAdd/settlement-list'
//订单编号详情
import productSettlementText from '@/views/electricity/productAdd/details/settlement-text'
//结算查看详情
import productSettlementView from '@/views/electricity/productAdd/details/settlement-view'

//电商审核列表
import productAuditDetailsText from '@/views/electricity/productAdd/audit-details-text'
//电商待发货列表

import fndTypesList from '@/views/fnd/typeslist'


//店铺结算
import merchantSettlement from '@/views/electricity/merchantSettlement/merchantSettlement'
Vue.use(Router)

export default new Router({
    routes: [
            {
                path: '*',
                redirect: '/login'
            },{
                path: '/login',
                name: 'login',
                component: Login
            },{
                path: '/pwd-reset',
                name: 'pwdReset',
                component: pwdReset
            },{
                path: '/layout',
                name: 'layout',
                component: layout,
                children: [
                {
                    path: '/Home',
                    name: 'Home',
                    component: Home
                },{
                    path: '/chart',
                    name: 'chart',
                    component: chart
                },{
                    path: '/tabletime',
                    name: 'tabletime',
                    component: tabletime
                },
                //景点
                {
                    path: '/biz/scenic',
                    name: 'scenic',
                    component: Scenic
                },
                //门票订单管理 待出票订单
                {
                    path: '/fnd/udc-list',
                    name: 'fndUdcList',
                    component: fndUdcList
                },{
                    path: '/fnd/express-company',
                    name: 'fndExpressCompany',
                    component: fndExpressCompany
                },{
                    path: '/fnd/types-list',
                    name: 'fndTypesList',
                    component: fndTypesList
                },{
                    path: '/fnd/udc-type-list',
                    name: 'fndUdcTypeList',
                    component: fndUdcTypeList
                },{
                    path: '/fnd/user-list',
                    name: 'fndUserList',
                    component: fndUserList
                },{
                    path: '/fnd/role-list',
                    name: 'fndRoleList',
                    component: fndRoleList
                },{
                    path: '/fnd/role-menu-list',
                    name: 'fndRoleMenuList',
                    component: fndRoleMenuList
                },{
                    path: '/fnd/area-list',
                    name: 'fndAreaList',
                    component: fndAreaList
                },{
                    path: '/fnd/brand-list',
                    name: 'fndBrandList',
                    component: fndBrandList
                },{
                    path: '/fnd/hotel-list',
                    name: 'fndHotelList',
                    component: fndHotelList
                },{
                    path: '/fnd/hotel-room-list',
                    name: 'fndHotelRoomList',
                    component: fndHotelRoomList
                },{
                    path: '/fnd/scenic-list',
                    name: 'fndScenicList',
                    component: fndScenicList
                },{
                    path: '/fnd/menu-list',
                    name: 'fndMenuList',
                    component: fndMenuList
                },
                {
                    path: '/fnd/supplier-list',
                    name: 'fndSupplierList',
                    component: fndSupplierList  
                },{
                    path: '/fnd/bundle',
                    name: 'fndBundle',
                    component: fndBundle  
                },{
                    path: '/fnd/banner-list',
                    name: 'fndBannerList',
                    component: fndBannerList
                },
                {
                    path: '/fnd/menu-bundle-list',
                    name: 'fndMenuBundleList',
                    component: fndMenuBundleList
                },{
                    path: '/fnd/restaurant-list',
                    name: 'fndRestaurantList',
                    component: fndRestaurantList
                },{
                    path: '/fnd/fun-list',
                    name: 'fndFunList',
                    component: fndFunList
                },{
                    path: '/fnd/shopping-point-list',
                    name: 'fndShoppingPointList',
                    component: fndShoppingPointList
                },{
                    path: '/fnd/ticket-type-list',
                    name: 'fndTicketTypeList',
                    component: fndTicketTypeList
                },{
                    path: '/fnd/vendor-list',
                    name: 'fndVendorList',
                    component: fndVendorList
                },{
                    path: '/fnd/service-list',
                    name: 'fndVendorServiceList',
                    component: fndVendorServiceList
                },{
                    path: '/fnd/content-list',
                    name: 'fndContentList',
                    component: fndContentList
                },{
                    path:'/fnd/radio-list',
                    name:'fndRadioList',
                    component:fndRadioList
                },{
                    path: '/fnd/content-add-or-update',
                    name: 'fndContentAddOrUpdate',
                    component: fndContentAddOrUpdate
                },{
                    path: '/fnd/radio-add-or-update',
                    name: 'fndRadioAddOrUpdate',
                    component: fndRadioAddOrUpdate
                },{
                    path: '/fnd/visa-add-or-update',
                    name: 'fndVisaAddOrUpdate',
                    component: fndVisaAddOrUpdate
                },{
                    path: '/fnd/type-list',
                    name: 'fndTypeList',
                    component: fndTypeList
                },{
                    path: '/fnd/tag-list',
                    name: 'fndTagList',
                    component: fndTagList
                },{
                    path: '/fnd/close-scenic',
                    name: 'fndCloseScenic',
                    component: fndCloseScenic
                },{
                    path: '/fnd/custom-swim-list',
                    name: 'fndCustomSwimList',
                    component: fndCustomSwimList
                },{
                    path: '/fnd/email',
                    name: 'fndEmail',
                    component: fndEmail
                },{
                    path: '/fnd/ad-type-list',
                    name: 'fndAdTypeList',
                    component: fndAdTypeList
                },{
                    path: '/fnd/ad-list',
                    name: 'fndAdList',
                    component: fndAdList
                },{
                    path: '/fnd/seller-management',
                    name: 'fndSellerManagement',
                    component: fndSellerManagement
                },{
                    path: '/fnd/seller-add-list',
                    name: 'fndSellerAddList',
                    component: fndSellerAddList
                },{
                    path: '/fnd/seller-add',
                    name: 'fndSellerAdd',
                    component: fndSellerAdd
                },{
                    path: '/fnd/seller-add-staff-list',
                    name: 'fndSellerAddStaffList',
                    component: fndSellerAddStaffList
                },{
                    path: '/fnd/seller-bill',
                    name: 'fndSellerBill',
                    component: fndSellerBill
                },{
                    path: '/fnd/seller-report',
                    name: 'fndSellerReport',
                    component: fndSellerReport
                },{
                    path: '/fnd/seller-settlement',
                    name: 'fndSellerSettlement',
                    component: fndSellerSettlement
                },{
                    path: '/chat',
                    name: 'chat',
                    component: chat
                },{
                    path: '/fnd/wxMenu-list',
                    name: 'fndWxMenuList',
                    component: fndWxMenuList
                },
                {
                    path: '/fnd/store',
                    name: 'fndStore',
                    component: fndStore
                },
                {
                    // 库存日历
                    path: '/stock-calendar',
                    name: 'FtockCalenDar',
                    component: FtockCalenDar
                },
                {
                    path: '/calendar',
                    component: Calendar
                },
                {
                    path: '/use-calendar',
                    component: UseCalendar
                },
                {
                    path: '/use-calendar',
                    component: UseCalendar
                },
                {
                    path: '/gaodemap',
                    component: GaodeMap
                },
                {
                    path: '/use-calendar2',
                    component: UseCalendar2
                },
                {
                    path: '/upload',
                    component: ZzuUpload
                },
                {
                    path: '/parent',
                    component: Parent
                }, {
                    path: '/udc',
                    component: Udc
                },
                //电商
                {
                    path: '/electricity/product-management',
                    name: "productManagement",
                    component: productManagement
                },
                {
                    path: '/product-add',
                    name: "productAdd",
                    component: productAdd
                }, {
                    path: "/product/detailsText",
                    name: "productDetailsText",
                    component: productDetailsText
                },{
                    path: "/product/audit-ist/details-text",
                    name: "productAuditDetailsText",
                    component: productAuditDetailsText
                },
                {
                    path:"/product/settlement/list",
                    name:"productSettlementList",
                    component:productSettlementList
                },{
                    path:"/product/settlement/text",
                    name:"productSettlementText",
                    component:productSettlementText
                },{
                    path:"/product/settlement/view",
                    name:"productSettlementView",
                    component:productSettlementView
                },{
                    path:"/stay/settlement-list",
                    name:"staySettlementList", 
                    component:staySettlementList
                },{
                    path:"/merchantSettlement",
                    name:"merchantSettlement",
                    component:merchantSettlement
                }

            ]
    }]
}) 
