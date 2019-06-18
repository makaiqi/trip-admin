<template>
	<div class="ele-order-list">
		<div class="oreder-list-header">
			<h1>电商订单列表</h1>
		</div>
		<div class="oreder-list-con">
			<el-input clearable v-model="search" placeholder="会员姓名/手机号，收件人姓名/手机号" style="width: 20%;"></el-input>
      订单编号：<el-input clearable v-model="orderLineNo" style="width: 20%;"></el-input>
      供应商：<zzu-line-supplier v-model="tVendorsId"></zzu-line-supplier>
      订单状态：<zzu-udc v-model="orderStatusCode" style="display: inline-block" udc-code="UDC_M03_T21"></zzu-udc>
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
			<el-button @click="staySettlement()" style="margin-top: 10px;">申请结算</el-button>
      <a :href="excelUrl" class="dingdan">
        导出订单
      </a>

			<el-table
		    ref="multipleTable"
		    :data="tableDataOrder"
		    tooltip-effect="dark"
		    border
		    style="width: 100%;margin-top: 10px;">
		    <el-table-column
		    	prop="orderLineNo"
          :sortable="true"
		      label="订单编号">
		    </el-table-column>
		    <!--<el-table-column
		    	prop="refundTransactionNo"
		      label="退款交易单号"
		      >
		    </el-table-column>-->
		    <el-table-column
		      prop="tvendor"
          :sortable="true"
          width="100"
		      label="供应商">
		    </el-table-column>
		    <el-table-column
		      prop="productName"
          :sortable="true"
          width="260"
		      label="产品名称">
		    </el-table-column>
		    <el-table-column
		      prop="orderAmt"
          :sortable="true"
          width="100"
		      label="订单金额">
		    </el-table-column>
		    <el-table-column
          width="120"
          prop="memberName"
          :sortable="true"
		      label="会员姓名">
		    </el-table-column>
        <el-table-column
          width="120"
          prop="memberMobile"
          :sortable="true"
		      label="会员手机">
		    </el-table-column>

        <el-table-column
          width="120"
          prop="custName"
          :sortable="true"
		      label="收件人姓名">
		    </el-table-column>
        <el-table-column
          width="120"
          prop="mobile"
          :sortable="true"
		      label="收件人手机">
		    </el-table-column>
		    <el-table-column
		      prop="orderSourceCodeDesc"
          :sortable="true"
		      label="订单来源">
		    </el-table-column>
        <el-table-column
          prop="createdTime"
          width="145"
          :sortable="true"
          label="下单时间">
        </el-table-column>
		    <el-table-column
		      prop="paymentTime"
          width="145"
          :sortable="true"
		      label="支付时间">
		    </el-table-column>
		    <el-table-column
		      prop="paymentTypeCodeDesc"
          :sortable="true"
		      label="支付类型">
		    </el-table-column>
		    <el-table-column
		      prop="orderStatusCodeDesc"
          :sortable="true"
		      label="订单状态">
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
  import zzuLineSupplier from '@/components/line-supplier'
  import zzuUdc from "@/components/udc";
	export default {
    components: {
      zzuLineSupplier,zzuUdc
    },
    data() {
      return {
        tableDataOrder: [],
        multipleSelection: [],
        orderLineNo: "",
        orderStatusCode: "",
        search:"",
        tVendorsId:"",
        excelUrl: "",
        queryBeginDate:"",
        queryEndDate:"",
        place_order_time: [],
        place_order_useTime:[],
        useBeginDate:"",
        useEndDate:"",

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
        this.excelUrl = this.$appCfg.http.baseURL+"store/Order/orderListToExcel?search="+this.search
          +"&queryBeginDate="+this.queryBeginDate+"&queryEndDate="+this.queryEndDate
          +"&useBeginDate="+this.useBeginDate+"&useEndDate="+this.useEndDate
          +"&orderLineNo="+this.orderLineNo+"&tVendorsId="+this.tVendorsId
    		this.$http.get("/store/Order/list", {
    			params:{
            isOrder: true,
						pageSize:this.page.pageSize,
	      		pageNum:this.page.pageNum
					}
    		}).then(res => {
    			console.log(res)
    			if(res.data.code==0){
    				this.tableDataOrder = res.data.data.rows
    				this.page.total = res.data.data.total
    				for(let i=0;i<this.tableDataOrder.length;i++){
    					if(this.tableDataOrder[i].isDeleted == false){
    						this.tableDataOrder[i].isDeleted = '未删除'
    					}else if(this.tableDataOrder[i].isDeleted == null){
    						this.tableDataOrder[i].isDeleted = null
    					}else{
    						this.tableDataOrder[i].isDeleted = '已删除'
    					}
    				}
    			}
    		})
    	},
    	//搜索
    	searchFun(){
        this.excelUrl = this.$appCfg.http.baseURL+"store/Order/orderListToExcel?search="+this.search
          +"&queryBeginDate="+this.queryBeginDate+"&queryEndDate="+this.queryEndDate
          +"&useBeginDate="+this.useBeginDate+"&useEndDate="+this.useEndDate
          +"&orderLineNo="+this.orderLineNo+"&tVendorsId="+this.tVendorsId
    		this.$http.get('/store/Order/list', {
    			params:{
            isOrder: true,
            orderLineNo: this.orderLineNo,
            orderStatusCode: this.orderStatusCode,
            tVendorsId: this.tVendorsId,
						pageSize:this.page.pageSize,
	      		pageNum:this.page.pageNum,
	      		search:this.search,
            queryBeginDate:this.queryBeginDate,
            queryEndDate:this.queryEndDate,
            useBeginDate:this.useBeginDate,
            useEndDate:this.useEndDate
					}
    		}).then(res => {
    			console.log(res)
    			if(res.data.code==0){
    				this.tableDataOrder = res.data.data.rows
            this.page.total = res.data.data.total
    				for(let i=0;i<this.tableDataOrder.length;i++){
    					if(this.tableDataOrder[i].isDeleted == false){
    						this.tableDataOrder[i].isDeleted = '未删除'
    					}else if(this.tableDataOrder[i].isDeleted == null){
    						this.tableDataOrder[i].isDeleted = null
    					}else{
    						this.tableDataOrder[i].isDeleted = '已删除'
    					}
    				}
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
    	staySettlement(){
    		this.$router.push({name:"staySettlementList"})
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
