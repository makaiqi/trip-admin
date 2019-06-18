<!--商户结算提现列表-->
<template>
  <div class="settlement">
    <div class="settlement-header">
      <h1>待结算列表</h1>
    </div>
    <div class="settlement-content">
      景区：
      <el-select
        v-model="search.isService"
        placeholder="请选择"
        clearable
        style="width:10%;"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.merchantName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      门店：
       <el-select
        v-model="search.store"
        placeholder="请选择"
        clearable
        style="width:10%;"
      >
        <el-option
          v-for="item in options2"
          :key="item.id"
          :label="item.storeName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <!-- <zzu-udc v-model="search.settlementStatusCode" :udc-code="udcCode" style="display: inline-block;" :disabled="disabled"></zzu-udc> -->
      	<el-date-picker
				value-format="yyyy-MM-dd"
	      v-model="timePicker"
	      type="daterange"
	      range-separator="至"
	      start-placeholder="开始日期"
	      end-placeholder="结束日期">
	    </el-date-picker>
      	<!-- <el-input clearable v-model="search.search" placeholder="模糊查询/人名、结算编号、手机号码" style="width: 20%;"></el-input> -->
			<el-button @click="searchFun()">搜索</el-button>
      <el-button @click="agreedListFun()">批量结算</el-button>
      <span style="margin:0 30px">共计{{totalMoney | retainedDecimal}}元</span>
      <!-- <el-button @click="refusedListFun()">批量拒绝</el-button> -->
      <el-radio
        v-model="radio"
        label="false"
        @change="createdFun(selectedStore)"
        
      >待结算</el-radio>
      <el-radio
        v-model="radio"
        label="true"
        @change="createdFun(selectedStore)"
      >已结算</el-radio>
     <a :href="excelUrl" class="dingdan">
        下载excel
      </a>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%;margin-top: 10px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed="left"
          type="selection"
          width="55"
        >
        </el-table-column>

        <el-table-column
          prop="merchantName"
          label="景区名称"
          :sortable="true"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="storeName"
          label="店铺名称"
          :sortable="true"
          width="160"
        >
        </el-table-column>
        <el-table-column
          prop="outTradeNo"
          label="订单编号"
          :sortable="true"
          width="180"
        >
        </el-table-column>
        <el-table-column
          label="订单金额"
          prop="totalFee"
          :sortable="true"
          width="120"
        >

        </el-table-column>
        <el-table-column
          label="结算金额"
          prop="settlementTotalFee"
          :sortable="true"
          width="120"
        >

        </el-table-column>

        <el-table-column
          prop="createdTime"
          :sortable="true"
          label="下单时间"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="payTimeEnd"
          :sortable="true"
          label="支付时间"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="settlementStatusCodeDesc"
          label="结算状态"
          :sortable="true"
          width="120"
        >
        </el-table-column>

      </el-table>

      <el-pagination
        background
        @size-change="handlePageSizeChange"
        @current-change="handlePageCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
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
      radio: "false",
      totalMoney: 0,
      dialogVisible: false,
      dialogVisibles: false,
      selectedStore: "",
      timePicker: "",
      tableData: [],
      disabled: false,
      udcCode: "",
      excelUrl: "",
      search: {
        settlementStatusCode: "",
        search: "",
        queryBeginDate: "",
        queryEndDate: "",
        isService: null,
        store:null
      },
      options: [],
      options2:[],
      page: {
        currentPage: 1,
        pageSizes: this.$appCfg.paginationCfg.pageSizes,
        //					pageSizes:[1,2,3,4],
        pageSize: 20,
        total: 0,
        pageNum: 1
      },
      multipleSelection: [],

      refusedObj: {
        id: "",
        refusal: "",
        orderType: ""
      },
      refusedObjs: { refusal: "" }
    };
  },
  watch: {
    "page.pageSize": {
      handler(newVal, oldVal) {
        this.createdFun(this.selectedStore);
      },
      deep: true
    },
    "page.pageNum": {
      handler(newVal, oldVal) {
        this.createdFun(this.selectedStore);
      },
      deep: true
    },
    "search.isService": {
      handler(newVal, oldVal) {
        console.log(newVal);
        this.search.store = null;
        if (newVal == "") {
          this.createdFun();
        } else {
          this.selectedStore = newVal;
          this.createdFun(newVal);
          this.getStore(newVal)
        }
      },
      deep: true
    },
    "search.store":{
       handler(newVal, oldVal) {
         this.createdFun(this.search.isService,newVal)
      },
      deep: true
    },
    timePicker(newval, oldval) {
      if (newval) {
        this.search.queryBeginDate = newval[0];
        this.search.queryEndDate = newval[1];
      } else {
        this.search.queryBeginDate = "";
        this.search.queryEndDate = "";
      }
    }
  },
  mounted() {
    this.createdFun();
    this.getSpot();
  },
  methods: {
    searchFun(){
      this.excelUrl = this.$appCfg.http.baseURL+"/deal/FlowBill/settlementListToExcel" + '?paySubMerchantId='
          +this.search.isService + '&paySubStoreId=' + this.search.store+'&queryBeginDate='+this.search.queryBeginDate
          +'&queryEndDate'+this.search.queryEndDate;
      this.createdFun(this.search.isService,this.search.store)
    },
    createdFun(id,storeId) {
        this.excelUrl = this.$appCfg.http.baseURL+"/deal/FlowBill/settlementListToExcel" + '?paySubMerchantId='
          +this.search.isService + '&paySubStoreId=' + this.search.store;
      var that = this;
      this.$http
        .get("/deal/FlowBill/settlementList", {
          params: {
            pageSize: that.page.pageSize,
            pageNum: that.page.pageNum,
            paySubMerchantId: id,
            settlementStatus: that.radio,
            paySubStoreId:storeId,
            queryBeginDate:that.search.queryBeginDate,
            queryEndDate:that.search.queryEndDate
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.tableData = res.data.data.rows;
            this.page.total = res.data.data.total;
          } else if (res.data.code == 10) {
            this.tableData = res.data.data.rows;
            this.page.total = res.data.data.total;
          }
        });
    },

    getSpot() {
      this.$http.get(`/deal/SubMerchant/list?${false}`).then(rs => {
        if (rs.data.code == 0) {
          this.options = rs.data.data.rows;
          console.log(this.options);
        }
      });
    },
    getStore(id){
      this.$http.get(`/deal/SubStore/list?paySubMerchantId=${id}`).then(rs =>{
        this.options2 = rs.data.data.rows;
        console.log(rs,'二级列表')

      })
    },
    
    //批量同意
    agreedListFun() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请先选择",
          type: "warning"
        });
      } else {
        const params = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          params.push(this.multipleSelection[i].id);
        }

        console.log(params);
        this.$confirm("确定同意结算吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http
              .post("/deal/FlowBill/completeSettlement", params)
              .then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    type: "success",
                    message: "已同意结算!"
                  });
                  console.log(1);
                  this.createdFun(this.selectedStore);
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消同意结算"
            });
          });
      }
    },

    //多选
    handleSelectionChange(val) {
      this.totalMoney = 0;
      console.log(val);
      this.multipleSelection = [];
      val.forEach(item => {
        this.multipleSelection.push({
          id: item.id,
          money: item.settlementTotalFee,
          orderType: item.orderType
        });
        this.totalMoney += item.settlementTotalFee;
      });
      console.log(this.multipleSelection, "multipleSelection");
    },
    //单个同意
    agreedFun(val) {
      //    	console.log(val)
      //   const params = {
      //     id: val.id,
      //     refusal: "",
      //     orderType: val.orderType
      //   };
      const data = {
        id: val
      };
      //   data.settlementInstDomains.push(params);
      console.log(data);
      this.$http.post("/deal/FlowBill/completeSettlement", data).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "已同意",
            type: "success"
          });
          this.createdFun(this.selectedStore);
        }
      });
    },

    //是否可选
    selectable(val) {
      if (val.settlementStatusCode != "V003") {
        return false;
      } else {
        return true;
      }
    },

    //查看详情
    detailsFun(val) {
      console.log(val);
      this.$router.push({
        name: "productSettlementView",
        query: {
          id: val.id,
          orderType: val.orderType,
          isService: val.isServices
        }
      });
    },

    //订单详情
    orderNoFun(val, all) {
      console.log(val, "000");
      this.$router.push({
        name: "productSettlementText",
        query: {
          id: val.id,
          orderType: val.orderType,
          isService: all.isServices
        }
      });
    },
    //分页函数
    handlePageSizeChange(val) {
      this.page.pageSize = val;
      console.log(val);
    },
    //点击获取页码数
    handlePageCurrentChange(val) {
      this.page.pageNum = val;
      this.createdFun(this.selectedStore);
    }
  }
};
</script>

<style lang="scss" scoped="scoped">
@import "~@/assets/css/core/index";
.settlement {
  padding: $padding;
  .settlement-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: $padding;
    h1 {
      font-family: "Open Sans", sans-serif;
      font-weight: 300;
      font-size: 30px;
      color: #4c4d5a;
      display: inline-block;
      margin-bottom: 15px;
      text-shadow: 0 1px #fff;
    }
  }
}
.dingdan{
    font-size: 12px;
    color: #3dc6b6;
    // float: right;
    text-decoration: none;
    margin-top: 20px;
    cursor: pointer;
  }
</style>
