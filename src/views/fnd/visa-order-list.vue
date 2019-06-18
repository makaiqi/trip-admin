<template>
  <div class="ele-order-list">
    <div class="oreder-list-header">
      <h1>签证订单列表</h1>
    </div>
    <div class="oreder-list-con">
      <el-input clearable v-model="search" placeholder="产品名称,会员/联系人/收件人的姓名或手机号以及收件人的具体地址" style="width: 35%;"></el-input>
      订单编号：<el-input clearable v-model="orderNo" style="width: 20%;"></el-input><br>
      订单状态：<zzu-udc v-model="orderStatusCode" udc-code="UDC_M03_T08" style="display: inline-block"></zzu-udc>
      退款状态：<zzu-udc v-model="refundStatusCode" udc-code="UDC_M05_T27" style="display: inline-block"></zzu-udc>
      订单来源：<zzu-udc v-model="orderSourceCode" udc-code="UDC_M00_T02" style="display: inline-block"></zzu-udc>
      支付类型：<zzu-udc v-model="paymentTypeCode" udc-code="UDC_M03_T07" style="display: inline-block"></zzu-udc><br>

      <label for="">下单时间</label>
      <el-date-picker
        class="data_picker"
        value-format="yyyy-MM-dd"
        v-model="place_order_time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <label for="">支付时间</label>
      <el-date-picker
        class="data_picker"
        value-format="yyyy-MM-dd"
        v-model="place_order_useTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-button @click="searchFun()">搜索</el-button>
      <a :href="excelUrl" class="dingdan">
        导出订单
      </a>

      <el-table
        ref="multipleTable"
        :data="tableDataOrder"
        tooltip-effect="dark"
        border
        style="width: 100%;margin-top: 10px;">
        <template v-for="(item,index) in columns" >
          <el-table-column v-if="item.key == 'operate'" fixed="right" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
            <template slot-scope="scope">
              <div v-if="scope.row.orderStatusCode == 'V011'">
                <el-button type="text" @click="operateOrder('true',scope.row.id)">确认订单</el-button>
                <el-button type="text" @click="operateOrder('false',scope.row.id)">取消订单</el-button>
              </div>
            </template>
           </el-table-column>
          <el-table-column v-else-if="item.key == 'refundAmt'" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
            <template slot-scope="scope">
              <p v-if="scope.row.refundStatusCode=='V001'">无退款</p>
              <p v-else>{{scope.row.refundAmt}}</p>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.key === 'address'" :label="item.title" :sortable="item.sortable" :prop="item.key">
            <template slot-scope="scope">
              {{scope.row.provinceName}} {{scope.row.cityName}} {{scope.row.areaName}} {{scope.row.address}}
            </template>
          </el-table-column>

          <el-table-column v-else :width="item.width || 100" :label="item.title" :sortable="item.sortable" :prop="item.key">
          </el-table-column>
        </template>
      </el-table>

      <el-pagination background
                     @size-change="handlePageSizeChange"
                     @current-change="handlePageCurrentChange"
                     :current-page="page.currentPage"
                     :page-sizes="page.pageSizes"
                     :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total">
      </el-pagination>

    </div>
  </div>
</template>

<script>
  import zzuUdc from "@/components/udc";
  export default {
    components: {
      zzuUdc
    },
    data() {
      return {
        tableDataOrder: [],
        excelUrl: "",
        multipleSelection: [],
        orderNo: "",
        orderStatusCode: "",
        refundStatusCode: "",
        orderSourceCode: "",
        paymentTypeCode: "",
        search:"",
        queryBeginDate:"",
        queryEndDate:"",
        place_order_time: [],
        place_order_useTime:[],
        useBeginDate:"",
        useEndDate:"",
        columns: [
          {title: "订单编号", key: "orderNo", sortable: true,},
          {title: "产品名称", key: "vsaName", sortable: true},
          {title: "签证次数", key: "vsaNumber", sortable: true},
          {title: "下单时间", key: "createdTime", sortable: true,width: 90},
          {title: "支付时间", key: "paymentTime", sortable: true},
          {title: "数量", key: "qty", sortable: true},
          {title: "会员姓名", key: "memberName", sortable: true},
          {title: "会员手机号", key: "memberMobile", sortable: true},
          {title: "联系人姓名", key: "concatsName", sortable: true},
          {title: "联系人手机号", key: "concatsMobile", sortable: true},
          {title: "收件人姓名", key: "receiverName", sortable: true},
          {title: "收件人手机号", key: "receiverMobile", sortable: true},
          {title: "收件人具体地址", key: "address", sortable: true,width:180},
          {title: "买家留言", key: "custMsg", sortable: true},
          {title: "订单金额", key: "orderAmt", sortable: true},
          {title: "退款金额", key: "refundAmt", sortable: true},
          {title: "订单状态", key: "orderStatusCodeDesc", sortable: true},
          {title: "退款状态", key: "refundStatusCodeDesc", sortable: true},
          {title: "支付类型", key: "paymentTypeCodeDesc", sortable: true},
          {title: "订单来源", key: "orderSourceCodeDesc", sortable: true},
          {title: "操作人", key: "opUserName", sortable: true},
          {title: "操作", key: "operate", sortable: false},
        ],

        page: {
          currentPage: 1,
          pageSizes: this.$appCfg.paginationCfg.pageSizes,
//					pageSizes:[1,2,3,4],
          pageSize: 30,
          total:0,
          pageNum:1,
        },
      }
    },
    mounted(){
      console.log(1)
      this.createdFun()
    },
    watch : {
      'page.currentPage': {
        handler() {
          this.searchFun()
        },
        deep: true
      },
      'page.pageSize': {
        handler() {
          this.searchFun()
        },
        deep: true
      },
      'place_order_time': {
        handler: function (newval, oldval) {
          if (newval && newval.length > 0) {
            this.queryBeginDate = newval[0]
            this.queryEndDate = newval[1]
          } else {
            this.queryBeginDate = ''
            this.queryEndDate = ''
          }
        },
        deep: true
      },
      'place_order_useTime': {
        handler: function (newval, oldval) {
          if (!newval) {
            this.useBeginDate = ''
            this.useEndDate = ''
          } else {
            this.useBeginDate = newval[0]
            this.useEndDate = newval[1]
          }
        },
        deep: true
      }
    },
    methods: {
      createdFun(){
        this.excelUrl = this.$appCfg.http.baseURL+"sundrytravel/Order/orderListToExcel?search="
        this.$http.get("/sundrytravel/Order/list",
        ).then(res => {
          console.log(res)
          if(res.data.code==0){
            this.tableDataOrder = res.data.data.rows
            this.page.total = res.data.data.total
          }
        })
      },
      //搜索
      searchFun(){
        this.excelUrl = this.$appCfg.http.baseURL+"sundrytravel/Order/orderListToExcel?search="+this.search
          +"&queryBeginDate="+this.queryBeginDate+"&queryEndDate="+this.queryEndDate
          +"&useBeginDate="+this.useBeginDate+"&useEndDate="+this.useEndDate
          +"&orderNo="+this.orderNo+"&orderStatusCode="+this.orderStatusCode+"&refundStatusCode="
          +this.refundStatusCode+"&orderSourceCode="+this.orderSourceCode+"&paymentTypeCode="+this.paymentTypeCode
        this.$http.get('/sundrytravel/Order/list', {
          params:{
            orderStatusCode: this.orderStatusCode,
            refundStatusCode: this.refundStatusCode,
            orderSourceCode: this.orderSourceCode,
            paymentTypeCode: this.paymentTypeCode,
            orderNo: this.orderNo,
            pageSize:this.page.pageSize,
            pageNum:this.page.pageNum,
            search:this.search,
            queryBeginDate:this.queryBeginDate,
            queryEndDate:this.queryEndDate,
            useBeginDate:this.useBeginDate,
            useEndDate:this.useEndDate
          }
        }).then(res => {
          if(res.data.code==0){
            this.tableDataOrder = res.data.data.rows
            this.page.total = res.data.data.total
          } else if (res.data.code == 10) {
            this.$message({
              message: res.data.msg,
              type: "warning"
            })
            this.tableDataOrder = []
            this.page.total = res.data.data.total
          }
        })
      },
      // 确认 取消订单
      operateOrder(confirmOrder,id) {
        this.$confirm(`此操作将改变订单状态, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=> {
          this.$http.get('/sundrytravel/Order/orderToConfirm',{
            params:{
              id:id,
              confirmOrder:confirmOrder
            }
          }).then((res)=> {
            this.$message({
              message: res.data.msg
            })
            this.createdFun()
          }).catch()
        })
      },
      //分页函数
      handlePageSizeChange(val) {
        this.page.pageSize = val;
      },
      //点击获取页码数
      handlePageCurrentChange(val) {
        this.createdFun()
      },
    }
  }
</script>

<style lang="scss" scoped="scoped">
  @import "~@/assets/css/core/index";
  .dingdan{
    font-size: 12px;
    color: #3dc6b6;
    float: right;
    text-decoration: none;
    margin-top: 20px;
    cursor: pointer;
  }
  .ele-order-list{
    padding: $padding;
    .oreder-list-header{
      display: flex;
      justify-content: space-between;
      border-bottom:1px solid #dcdcdc;
      margin-bottom: $padding;
      h1{
        font-family: 'Open Sans', sans-serif;
        font-weight: 300;
        font-size: 30px;
        color: #4c4d5a;
        display: inline-block;
        margin-bottom: 15px;
        text-shadow: 0 1px #fff;
      }
    }
  }
</style>
