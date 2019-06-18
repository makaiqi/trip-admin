<template>
  <div class="ele-order-list">
    <div class="oreder-list-header">
      <h1>{{merchantName}}流水账单</h1>
      <el-button @click="goBack">返回上一级</el-button>
    </div>
    <div class="oreder-list-con">
      门店名称：<el-input clearable v-model="query.storeName" style="width: 20%;" placeholder="门店名称"></el-input>
      城市名称：<city-select v-model="query.cityId"></city-select>
      <br>

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
      <el-button @click="searchFun()">搜索</el-button>
      <a :href="excelUrl" class="dingdan">
        导出账单
      </a>

      <el-table
        ref="multipleTable"
        :data="tableDataOrder"
        tooltip-effect="dark"
        border
        style="width: 100%;margin-top: 10px;">
        <el-table-column
          prop="merchantName"
          :sortable="true"
          width="100"
          label="景区名称">
        </el-table-column>
        <el-table-column
          prop="storeName"
          :sortable="true"
          width="100"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="payTimeEnd"
          :sortable="true"
          width="150"
          label="付款完成时间">
        </el-table-column>
        <el-table-column
          prop="totalFee"
          :sortable="true"
          width="120"
          label="总金额（元）">
        </el-table-column>
        <el-table-column
          prop="cityName"
          :sortable="true"
          width="100"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="tradeStateCodeDesc"
          :sortable="true"
          width="100"
          label="订单状态">
        </el-table-column>
        <el-table-column
          prop="outTradeNo"
          :sortable="true"
          width="200"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          :sortable="true"
          width="200"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="settlementStatusCodeDesc"
          :sortable="true"
          width="150"
          label="结算状态">
        </el-table-column>
        <el-table-column
          prop="settlementTime"
          :sortable="true"
          width="120"
          label="结算时间">
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          :sortable="true"
          width="200"
          label="修改时间">
        </el-table-column>
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
  import citySelect from '@/components/city-select'
  import zzuUdc from "@/components/udc";
  export default {
    components: {
      citySelect,zzuUdc
    },
    data() {
      return {
        payId: this.$route.params.payId,
        subType: this.$route.params.subType,
        merchantName: '',
        tableDataOrder: [],
        multipleSelection: [],
        query: {
          storeName: '',
          cityId: '',
          payId: this.$route.params.payId,
          subType: this.$route.params.subType,
          isOrder: true,
          pageSize: 30,
          pageNum: 1,
        },
        excelUrl: "",
        place_order_time: [],
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
      this.merchantName = this.$route.params.merchantName;
      this.createdFun()
    },
    watch : {
      'page.currentPage': {
        handler() {
          this.createdFun()
        },
        deep: true
      },
      'page.pageSize': {
        handler() {
          this.createdFun()
        },
        deep: true
      },
    },
    methods: {
      createdFun(){
        this.excelUrl = this.$appCfg.http.baseURL+"deal/FlowBill/orderListToExcel" + '?payId='
          + this.payId + '&subType=' + this.subType;
        this.$http.get("/deal/FlowBill/list",{
          params:{
            payId: this.payId,
            isOrder: true,
            subType: this.subType,
            pageSize:this.page.pageSize,
            pageNum:this.page.pageNum
          }
        }).then(res => {
          if(res.data.code === 0){
            this.tableDataOrder = res.data.data.rows
            this.page.total = res.data.data.total
          } else {
            this.$message({
              message: '暂无数据'
            })
          }
        })
      },
      //搜索
      searchFun(){
        this.query.queryBeginDate = this.place_order_time ? this.place_order_time[0] : '';
        this.query.queryEndDate = this.place_order_time ? this.place_order_time[1] : '';
        this.excelUrl = this.$appCfg.http.baseURL+"deal/FlowBill/orderListToExcel"+
         '?payId=' + this.payId + '&storeName=' + this.query.storeName + '&cityId=' +
          this.query.cityId + '&queryBeginDate=' + this.query.queryBeginDate
        + '&queryEndDate=' + this.query.queryEndDate + '&subType=' + this.subType;
        this.$http.get('/deal/FlowBill/list', {
          params:this.query
        }).then(res => {
          if(res.data.code === 0){
            this.tableDataOrder = res.data.data.rows
            this.page.total = res.data.data.total
          } else if (res.data.code === 10) {
            this.$message({
              message: res.data.msg,
              type: "warning"
            })
            this.tableDataOrder = []
            this.page.total = res.data.data.total
          }
        })
      },
      //分页函数
      handlePageSizeChange(val) {
        this.page.pageSize = val;
      },
      //点击获取页码数
      handlePageCurrentChange(val) {
        this.page.pageNum = val
        this.createdFun()
      },
      goBack () {
        if (this.subType === 'M') {
          this.$router.push({name: "fndSellerManagement"})
        } else {
          this.$router.push({name: "fndSellerAddList", params:{id: this.$route.params.id}})
        }
      }
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
