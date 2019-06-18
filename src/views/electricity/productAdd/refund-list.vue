<!--
	退款列表
 -->

<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ tableList.title }}</span>
          <span class="line-gray">(共{{ page.total }}数据)</span>
        </div>
        <div class="base-block-container">
          <el-form ref="formSearch" v-model="tableList.query" :inline="true">
            <el-form-item prop="search">
              <el-input clearable v-model="tableList.query.search" placeholder="内容名称检索"></el-input>
            </el-form-item>
            <el-form-item prop="search">
							<zzu-udc v-model="tableList.query.refundStatusCode" udc-code="UDC_M03_T24"></zzu-udc>
            </el-form-item>
          </el-form>

          <el-table
            ref="multipleTable"
            :data="tableList.data.rows"
            border
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            class="base-block-table">

            <template v-for="(item,index) in tableList.columns">
							<el-table-column v-if="item.key == 'refundNo'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
							</el-table-column>

							<el-table-column v-else-if="item.key == 'soldQty'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
								<template slot-scope="scope">
									<span>{{scope.row.soldQty}}/{{scope.row.totalQty}}</span>
								</template>
							</el-table-column>

							<el-table-column v-else-if="item.key == 'caozuo'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
								<template slot-scope="scope">
									<!--<span>{{scope.row.refundStatusCode}}</span>-->
									<el-button type="text" @click="detailsFun(scope.row)">查看</el-button><br />
									<div v-if="scope.row.refundStatusCode == 'V001' || scope.row.refundStatusCode == 'V002' || scope.row.refundStatusCode == 'V003' || scope.row.refundStatusCode == 'V004'">
										<el-button type="text" @click="agreedFun(scope.row)">同意</el-button><br />
										<el-button type="text" @click="refusedFun(scope.row)">拒绝</el-button><br />
									</div>
								</template>
							</el-table-column>

							<el-table-column v-else :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
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
      </el-card>

			<!--拒绝弹出框-->
			<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
				<label for="">拒绝理由：</label>
				<el-input clearable v-model="refusedObj.confirmRemark" type="textarea" :rows="2"></el-input>
				<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="dialogVisibleFun()">确 定</el-button>
		  	</span>
			</el-dialog>

    </div>
  </div>
</template>

<script type="text/babel">
  import {mapState} from 'vuex'

  import zzuMap from '@/components/map'
  import zzuUdc from '@/components/udc'
  import zzuCitySelect from '@/components/city-select'

  export default {
    name: "refundList",
    components: {
      zzuMap, zzuUdc, zzuCitySelect
    },
    data() {
      return {
      	dialogVisible: false,
				refusedObj: {
					id: "",
					confirmRemark: "",
				},
				refundMoenys: "", //退款金额
        timePicker: '',
        cfg: {
          formTitle: '添加内容',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formSearch: {
          title: "",
          typeId: ''
        },
        tableList: {
          title: "退款列表",
          query: {
            isOrder:false,
            search: '', // 内容名称， 模糊查询
            cityId: '', // 内容所在城市
            refundStatusCode: '',
            pageNum: 1, // 第几页
            pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
            sort: 'id', // 主表字段名称
            order: 'desc' // 正序还是倒序
          },
          selection: [],
          loading: false,
          columns: [
	          {
							type: "selection",
							width: 35,
							fixed: "left",
						},{
							title: '退款编号',
							key: "refundNo",
						},{
							title: "订单编号",
							key: "orderNo",
						},{
							title: "会员姓名",
							key: "memberName",
						},{
							title: "支付金额",
							key: "paymentAmt",
						},{
							title: "退款金额",
							key: "refundAmt",
						},{
							title: "付款时间",
							key: "paymentTime",
						},{
							title: "操作人",
							key: "opUserName",
						},{
							title: "退款状态",
							key: "refundStatusCodeDesc",
						},{
							title: "操作",
							key: "caozuo",
							fixed: "right",
						}
          ],
          data: {
            total: 0,
            rows: []
          }
        },
        page: {
          currentPage: 1,
          pageSizes: this.$appCfg.paginationCfg.pageSizes,
          pageSize: this.$appCfg.paginationCfg.pageSize,
          total: 0
        },
        formAddOrUpdate: {
          id: '',
          title: ''
        }
      }
    },
    watch: {
      'tableList.query': {
        handler (newValue, oldValue) {
          this.findPage();
        },
        deep: true
      },
      'tableList.selection'(newValue, oldValue) {
        if (newValue.length > 0) {
          for (let obj in this.formAddOrUpdate) {
            this.formAddOrUpdate[obj] = newValue[0][obj]
          }
        } else {
          for (let obj in this.formAddOrUpdate) {
            this.formAddOrUpdate[obj] = ''
          }
        }
      }
    },
    mounted () {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get(`store/Order/list`,
          {
            params: this.tableList.query
          }).then(rs => {
            if(rs.data.code == 0) {
              this.page.total = rs.data.data.total;
              this.tableList.data.rows = rs.data.data.rows;
            } else {
              this.page.total = 0;
              this.tableList.data.rows = [];
            }
          }).catch(err => {
            this.page.total = 0;
            this.tableList.data.rows = [];
          });
      },
      handleSelectionChange(val) {
        this.tableList.selection = val.sort(function (a, b) {
          return a.id > b.id;
        });
      },
      handlePageSizeChange(val) {
        this.tableList.query.pageSize = val;
      },
      handlePageCurrentChange(val) {
        this.tableList.query.pageNum = val;
      },

			//查看
			detailsFun(val) {
				this.$router.push({
					name: 'productDetailsText',
					query: {
						id: val.id
					}
				})
			},
			//同意
			agreedFun(val) {
				console.log(val)
				this.$confirm('确定同意退款吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          this.refundMoeny(val);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消同意退款'
					});
				});
			},
			//拒绝
			refusedFun(val) {
				this.refusedID = val.id
				this.dialogVisible = true
			},
			dialogVisibleFun() {
				if(this.refusedObj.confirmRemark != "") {
					this.refusedObj.id = this.refusedID
					this.orderDomains = []
					this.orderDomains.push(this.refusedObj)
					const data = {
						orderDomains: "",
					}
					data.orderDomains = this.orderDomains
					this.$http.post('/store/Order/refund', data).then(res => {
						//					console.log(res)
						if(res.data.code == 0) {
							this.$message({
								showClose: true,
								message: '已拒绝',
								type: 'success'
							});
							this.findPage()
							this.dialogVisible = false
              this.refusedObj.confirmRemark = ""
						}
					})
				} else {
					this.$notify({
						title: '警告',
						message: '请填写拒绝理由',
						type: 'warning'
					});
				}

			},

			//退款金额函数
			refundMoeny(val) {
        let url = "";
        if ("V001" == val.paymentTypeCode) url = "biz/Member/refund";
        else if ("V002" == val.paymentTypeCode) url = "app/aliPay/refund";
				this.$http.post(url, {
						refundOrderNo: val.refundNo, //退款单号
						orderNo: val.orderNo, // 订单编号
						paymentAmt: val.paymentAmt, //  支付金额
						refundAmt: val.refundAmt != null ? val.refundAmt : val.paymentAmt // 退款金额
					}).then(res => {
					if(res.data.code == 0) {
						/*this.$message({
							message: res.data.msg,
							type: 'success'
						});*/
            const params = {
              id: val.id
            }
            this.orderDomains = []
            this.orderDomains.push(params)
            const data = {
              orderDomains: "",
            }
            data.orderDomains = this.orderDomains
            this.$http.post('/store/Order/refund', data).then(res => {
              if(res.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '退款成功!'
                });

//							this.refundMoeny(val)

                this.findPage()
              }
            })
					} else {
						this.$message({
							message: res.data.msg,
							type: 'warning'
						});
					}

				})
			},
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';


</style>
