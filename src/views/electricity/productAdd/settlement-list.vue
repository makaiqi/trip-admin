<!--结算列表-->
<template>
	<div class="settlement">
		<div class="settlement-header">
			<h1>结算列表</h1>
		</div>
		<div class="settlement-content">
      合作商：
      <el-select v-model="search.isService" placeholder="请选择" clearable style="width:15%;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
			<zzu-udc v-model="search.settlementStatusCode" :udc-code="udcCode" style="display: inline-block;" :disabled="disabled"></zzu-udc>
			<el-date-picker
				value-format="yyyy-MM-dd"
	      v-model="timePicker"
	      type="daterange"
	      range-separator="至"
	      start-placeholder="开始日期"
	      end-placeholder="结束日期">
	    </el-date-picker>
			<el-input clearable v-model="search.search" placeholder="模糊查询/人名、结算编号、手机号码" style="width: 20%;"></el-input>
			<el-button @click="searchFun()">搜索</el-button>
			<el-button @click="agreedListFun()">批量同意</el-button>
			<el-button @click="refusedListFun()">批量拒绝</el-button>
			<el-table
		    ref="multipleTable"
		    :data="tableData"
		    border
        stripe
		    tooltip-effect="dark"
		    style="width: 100%;margin-top: 10px;"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		    	fixed="left"
		      type="selection"
		      :selectable="selectable"
		      width="55">
		    </el-table-column>
		    <el-table-column
		    	prop="settlementNo"
		      label="结算编号"
          :sortable="true"
		      width="160">
		    </el-table-column>
		    <el-table-column
		      label="包含结算订单编号"
          :sortable="true"
		      width="150"
		      >
		      <template slot-scope="scope">
		      	<!--<span>{{scope}}</span>-->
            <div v-if="scope.row.freeTravelOrder">
              <p @click="orderNoFun(item,scope.row)" style="cursor:pointer;" v-for="(item) in scope.row.freeTravelOrder">订单号：{{item.orderNo}}</p>
            </div>
            <div v-if="scope.row.eccOrders">
              <p @click="orderNoFun(item,scope.row)" style="cursor:pointer;" v-for="(item) in scope.row.eccOrders">订单号：{{item.orderNo}}</p>
            </div>
            <div v-if="scope.row.ticketOrder">
              <p @click="orderNoFun(item,scope.row)" style="cursor:pointer;" v-for="(item) in scope.row.ticketOrder">订单号：{{item.orderNo}}</p>
            </div>
            <div v-if="scope.row.groupTravelOrder">
              <p @click="orderNoFun(item,scope.row)" style="cursor:pointer;" v-for="(item) in scope.row.groupTravelOrder">订单号：{{item.orderNo}}</p>
            </div>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="结算总金额"
          :sortable="true"
		      width="120">
          <template slot-scope="scope" >
            <div v-if="!scope.row.isServices">
              <div v-if="scope.row.freeTravelOrder" v-for="(item,index) in scope.row.freeTravelOrder">
                <p>订单{{index+1}}:{{item.settlementPrice}}</p>
              </div>

              <div v-if="scope.row.eccOrders" v-for="(item,index) in scope.row.eccOrders">
                <p>订单{{index+1}}:{{item.settlementPrice}}</p>
              </div>

              <div v-if="scope.row.groupTravelOrder" v-for="(item,index) in scope.row.groupTravelOrder">
                <p>订单{{index+1}}:{{item.settlementPrice}}</p>
              </div>

              <div v-if="scope.row.ticketOrder" v-for="(item,index) in scope.row.ticketOrder">
                <p>订单{{index+1}}:{{item.settlementPrice}}</p>
              </div>

              <div>
                <p>总金额：{{scope.row.settlementAmt || "未结算"}}</p>
              </div>
            </div>
          </template>
		    </el-table-column>
        <el-table-column
          label="提现总金额"
          :sortable="true"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.isServices">
              <div v-if="scope.row.freeTravelOrder" v-for="(item,index) in scope.row.freeTravelOrder">
                <p>订单{{index+1}}:{{item.commissionAmount}}</p>
              </div>

              <div v-if="scope.row.eccOrders" v-for="(item,index) in scope.row.eccOrders">
                <p>订单{{index+1}}:{{item.commissionAmount}}</p>
              </div>

              <div v-if="scope.row.groupTravelOrder" v-for="(item,index) in scope.row.groupTravelOrder">
                <p>订单{{index+1}}:{{item.commissionAmount}}</p>
              </div>

              <div v-if="scope.row.ticketOrder" v-for="(item,index) in scope.row.ticketOrder">
                <p>订单{{index+1}}:{{item.commissionAmount}}</p>
              </div>

              <div>
                <p>总金额：{{scope.row.commissionAmount || "未提现"}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
		    <el-table-column
		      prop="applicantName"
          :sortable="true"
		      label="申请人"
		      width="120">
		    </el-table-column>
		    <el-table-column
		      prop="isServices"
		      label="申请人类型"
          :sortable="true"
		      width="120">
		      <template slot-scope="scope">
		      	<span v-if="scope.row.isServices == false">供应商</span>
		      	<span v-if="scope.row.isServices == true">服务商</span>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="beginTime"
          :sortable="true"
		      label="申请日期"
		      width="140">
		    </el-table-column>
		    <el-table-column
		      prop="opUserName"
          :sortable="true"
		      label="操作人"
		      width="120">
		    </el-table-column>
		    <el-table-column
		      prop="settlementStatusCodeDesc"
		      label="结算状态"
          :sortable="true"
		      width="120">
		    </el-table-column>
		    <el-table-column
		    	fixed="right"
		      label="操作"
		      width="130">
		      <template slot-scope="scope">
		      	<el-button @click="agreedFun(scope.row)" type="text" v-if="scope.row.settlementStatusCode == 'V003'">同意</el-button>
		      	<el-button @click="refusedFun(scope.row)" type="text" v-if="scope.row.settlementStatusCode == 'V003'">拒绝</el-button>
		      	<el-button @click="detailsFun(scope.row)" type="text">查看</el-button>
		      </template>
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

          <!--拒绝理由-->
          <el-dialog
					  title="提示"
					  :visible.sync="dialogVisible"
					  width="30%">
					  <span>拒绝理由</span>
					  <el-input
						  type="textarea"
						  :rows="2"
						  placeholder="请输入内容"
						  v-model="refusedObj.refusal">
						</el-input>
					  <span slot="footer" class="dialog-footer">
					    <el-button @click="dialogVisible = false">取 消</el-button>
					    <el-button type="primary" @click="dialogVisibleFun()">确 定</el-button>
					  </span>
					</el-dialog>
					<!--批量拒绝-->
          <el-dialog
					  title="提示"
					  :visible.sync="dialogVisibles"
					  width="30%">
					  <span>拒绝理由</span>
					  <el-input
						  type="textarea"
						  :rows="2"
						  placeholder="请输入内容"
						  v-model="refusedObjs.refusal">
						</el-input>
					  <span slot="footer" class="dialog-footer">
					    <el-button @click="dialogVisibles = false">取 消</el-button>
					    <el-button type="primary" @click="dialogVisiblesFun()">确 定</el-button>
					  </span>
					</el-dialog>

		</div>
	</div>
</template>

<script>
	import zzuUdc from '@/components/udc'
	 export default {
	 	components: {
			zzuUdc
		},
    data() {
      return {
      	dialogVisible:false,
      	dialogVisibles:false,

      	timePicker:"",
        tableData: [],
        disabled: false,
        udcCode: "",
        search:{
					settlementStatusCode:"",
					search:"",
					queryBeginDate:"",
        	queryEndDate:"",
          isService: null
				},
        options: [
          {
            value: false,
            label: '供应商'
          },{
            value: true,
            label: '服务商'
          }
        ],
				page: {
          currentPage: 1,
          pageSizes: this.$appCfg.paginationCfg.pageSizes,
//					pageSizes:[1,2,3,4],
          pageSize: 30,
          total:0,
          pageNum:1,
        },
        multipleSelection: [],

        refusedObj:{
        	id:"",
        	refusal:"",
        	orderType:""
        },
        refusedObjs:{refusal:""}
      }
    },
    watch:{
      'page.pageSize' :{
        handler (newVal, oldVal) {
          this.createdFun()
        },
        deep: true
      },
      'page.pageNum' :{
        handler (newVal, oldVal) {
          this.createdFun()
        },
        deep: true
      },
      'search.isService': {
        handler (newVal, oldVal) {
          this.search.settlementStatusCode = ""
          if (newVal === true) {
            this.udcCode = "UDC_M03_T29"
            this.disabled = false
          } else if (newVal === false) {
            this.udcCode = "UDC_M03_T27"
            this.disabled = false
          } else {
            this.udcCode = ""
            this.disabled = true
          }
          console.log(this.udcCode)
        },
        deep: true
      },
    	timePicker (newval,oldval) {
        if (newval) {
          this.search.queryBeginDate = newval[0]
          this.search.queryEndDate = newval[1]
        } else {
          this.search.queryBeginDate = ''
          this.search.queryEndDate = ''
        }
    	},
    },
		mounted(){
			this.createdFun()
		},
    methods: {
    	createdFun(){
    		var that=this
    		this.$http.get('/biz/SettlementInst/findPageSettlementInst', {
    			params:{
						pageSize:that.page.pageSize,
	      		pageNum:that.page.pageNum
					}
    		}).then(res => {
    			console.log(res)
    			if(res.data.code == 0){
    				this.tableData = res.data.data.rows
    				this.page.total = res.data.data.total
    			} else if (res.data.code == 10) {
            this.tableData = res.data.data.rows
            this.page.total = res.data.data.total
          }
    		})
    	},
    	//搜索
    	searchFun(){
    		console.log(this.search)
    		this.$http.get('/biz/SettlementInst/findPageSettlementInst', {
    			params:{
    				pageSize:this.page.pageSize,
	      		pageNum:this.page.pageNum,
	      		settlementStatusCode:this.search.settlementStatusCode,
						search:this.search.search,
            isService:this.search.isService,
						queryBeginDate:this.search.queryBeginDate,
	        	queryEndDate:this.search.queryEndDate,
    			}
    		}).then(res => {
    			console.log(res)
    			if(res.data.code==0){
    				this.tableData = res.data.data.rows
    				this.page.total = res.data.data.total
    			}else if(res.data.code==10){
    				this.tableData = res.data.data.rows
    				this.page.total = res.data.data.total
    			}
    		})
    	},
    	//批量同意
    	agreedListFun(){
    		if(this.multipleSelection.length<1){
    			this.$message({
	          message: '请先选择',
	          type: 'warning'
	        });
    		}else{
    			const params=[]
	    		for(let i=0;i<this.multipleSelection.length;i++){
	    			params.push({
		      		id:this.multipleSelection[i].id,
		      		refusal:"",
		      		orderType:this.multipleSelection[i].orderType
		      	})
	    		}
	    		const data={
	      		settlementInstDomains:[]
	      	}
	      	data.settlementInstDomains=params
	    		console.log(data)
	    		this.$confirm('确定同意结算吗?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			      }).then(() => {
				      this.$http.post('/biz/SettlementInst/saveOrUpdateSettlementOrder', data).then(res => {
								if(res.data.code == 0){
									this.$message({
				            type: 'success',
				            message: '已同意结算!'
				          });
									console.log(1)
										this.createdFun()
									}
								})
			      }).catch(() => {
			        this.$message({
			          type: 'info',
			          message: '已取消同意结算'
			        });
			      });
    		}
    	},
    	//批量拒绝
    	refusedListFun(){
    		if(this.multipleSelection.length<1){
    			this.$message({
	          message: '请先选择',
	          type: 'warning'
	        });
    		}else{
    			this.dialogVisibles=true
    		}
    	},
    	//批量拒绝
    	dialogVisiblesFun(){
    		if(this.refusedObjs.refusal == ""){
    			this.$message({
	          message: '拒绝理由不能为空',
	          type: 'warning'
	        });
    		}else{
    			const params=[]
	    		for(let i=0;i<this.multipleSelection.length;i++){
	    			params.push({
			      	id:this.multipleSelection[i].id,
			      	refusal:this.refusedObjs.refusal,
			      	orderType:this.multipleSelection[i].orderType
			      })
	    		}
	    		const data={
		      		settlementInstDomains:[]
		      	}
		      data.settlementInstDomains=params
		    	console.log(data)
		    	this.$http.post('/biz/SettlementInst/saveOrUpdateSettlementOrder', data).then(res => {
	      		if(res.data.code==0){
	      			this.$message({
			          message: '已拒绝',
			          type: 'success'
			        });
	      			this.createdFun()
	      			this.dialogVisibles=false
	      		}
	      	})
    		}
    	},
    	//多选
      handleSelectionChange(val) {

      	console.log(val)
        this.multipleSelection=[]
        val.forEach(item => {
          this.multipleSelection.push({
            id:item.id,
            orderType:item.orderType
          })
        })
	        console.log(this.multipleSelection,'multipleSelection')
      },
      //单个同意
      agreedFun(val){
//    	console.log(val)
      	const params={
      		id:val.id,
      		refusal:"",
      		orderType:val.orderType
      	}
      	const data={
      		settlementInstDomains:[]
      	}
      	data.settlementInstDomains.push(params)
      	console.log(data)
      	this.$http.post('/biz/SettlementInst/saveOrUpdateSettlementOrder', data).then(res => {
      		if(res.data.code==0){
      			this.$message({
		          message: '已同意',
		          type: 'success'
		        });
      			this.createdFun()
      		}
      	})
      },
      //单个拒绝
      refusedFun(val){
      	this.dialogVisible=true
      	this.refusedObj.id = val.id
      	this.refusedObj.orderType = val.orderType
      },
      dialogVisibleFun(){
      	if(this.refusedObj.refusal == ""){
      		this.$message({
	          message: '拒绝理由不能为空',
	          type: 'warning'
	        });
      	}else{
      		const data={
	      		settlementInstDomains:[]
	      	}
	      	data.settlementInstDomains.push(this.refusedObj)
	      	console.log(data)
	      	this.$http.post('/biz/SettlementInst/saveOrUpdateSettlementOrder', data).then(res => {
	      		if(res.data.code==0){
	      			this.$message({
			          message: '已拒绝结算',
			          type: 'success'
			        });
	      			this.createdFun()
	      			this.dialogVisible=false
	      		}
	      	})
      	}
      },

      //是否可选
      selectable(val){
      	if(val.settlementStatusCode != 'V003'){
      		return false
      	}else{
      		return true
      	}
      },

      //查看详情
      detailsFun(val){
    	  console.log(val)
      	this.$router.push({name:'productSettlementView' ,  query:{id:val.id, orderType:val.orderType,isService:val.isServices}})
      },

      //订单详情
      orderNoFun(val,all){
      	console.log(val,'000')
      	this.$router.push({name:'productSettlementText' ,  query:{id:val.id, orderType:val.orderType,isService:all.isServices}})
      },
      //分页函数
      handlePageSizeChange(val) {
      this.page.pageSize = val;
				console.log(val)
      },
      //点击获取页码数
      handlePageCurrentChange(val) {
        this.page.pageNum=val
        this.createdFun()
      },
    }
  }
</script>

<style lang="scss" scoped="scoped">
	@import "~@/assets/css/core/index";
	.settlement{
		padding:$padding;
		.settlement-header{
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
