<!--
	酒店房型信息增删改查
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
            <el-form-item prop="merchantName">
              <el-input clearable v-model="tableList.query.merchantName" placeholder="景区名称"></el-input>
            </el-form-item>
            <el-form-item prop="search">
              <el-input clearable v-model="tableList.query.search" placeholder="电话"></el-input>
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
            <!-- <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :key="item.key"  :show-overflow-tooltip="true">
             </el-table-column>-->
            <template v-for="item in tableList.columns">
              <el-table-column
                v-if="item.key == 'sellerDetail'"
                fixed="right"
                label="操作"
                width="250">
                <template slot-scope="scope">
                  <el-button @click="handleAdd(scope.row)" type="text" size="small">门店管理</el-button>
                  <el-button @click="handleBill(scope.row)" type="text" size="small">流水账单</el-button>
                  <el-button @click="handleReport(scope.row)" type="text" size="small">商家报表</el-button>
                   <el-button @click="handleSettlement(scope.row)" type="text" size="small">结算报表</el-button>
                  <el-button @mouseenter.native="handleDownload(scope.row.id)" type="text" size="small"><a :href="imgHref">下载二维码</a></el-button>
                  <el-button @click="handleRemove(scope.row)" type="text" size="small">删除景区</el-button>
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
    </div>
    <div class="base-block-right">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
        </div>
        <el-form label-position="top" ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate" label-width="80px">
          <el-form-item label="景区名称" prop="merchantName">
            <el-input clearable v-model="formAddOrUpdate.merchantName" placeholder="景区名称"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="cityId">
            <zzu-city-select v-model="formAddOrUpdate.cityId" placeholder="城市"></zzu-city-select>
          </el-form-item>
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input clearable v-model="formAddOrUpdate.phoneNumber" placeholder="联系电话"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="addressId">
            <el-input clearable v-model="formAddOrUpdate.address" placeholder="地址ID"></el-input>
          </el-form-item>
          <el-form-item label="设备号" prop="deviceInfo">
            <el-input clearable v-model="formAddOrUpdate.deviceInfo" placeholder="设备号"></el-input>
          </el-form-item>
          <el-form-item label="开发票入口开放标识" prop="receipt">
            <el-input clearable v-model="formAddOrUpdate.receipt" placeholder="开发票入口开放标识"></el-input>
          </el-form-item>
          <el-form-item label="结算周期(天)" prop="settlementCycle">
            <el-input v-model.number="formAddOrUpdate.settlementCycle" ></el-input>
          </el-form-item>
          <el-form-item label="佣金率(%)" prop="commissionRate" >
            <el-input v-model="formAddOrUpdate.commissionRate"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitAddOrUpdate('formAddOrUpdate')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
  import zzuCitySelect from '@/components/city-select'
  let validPhone=(rule, value,callback)=>{
    let isMobile = /(\+\d+)?1[34578]\d{9}$/;
    if (!value){
      callback(new Error('请输入电话号码'))
    }else  if (!isMobile.test(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  }
  let validSettlementCycle=(rule, value,callback)=>{
    let pass = true
    if (value < 1 || value > 30) {
      pass = false
    }
    if (isNaN(value)) {
      pass = false
    }
    if (!value){
      callback(new Error('请输入结算周期'))
    }else  if (!pass){
      callback(new Error('请输入正确的1到30的整数'))
    }else {
      callback()
    }
  }
  let validCommissionRate=(rule, value,callback)=>{
    let pass = true
    let isTwoPoint = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (value < 0 || value > 100) {
      pass = false
    }
     if (!isTwoPoint.test(value)){
      callback(new Error('请保留小数点后两位'))
    }
    
    if (isNaN(value)) {
      pass = false
    }
    if (!value){
      callback(new Error('请输入结算周期'))
    }else  if (!pass){
      callback(new Error('请输入正确的0到100'))
    }else {
      callback()
    }
  }
  export default {
    name: "userList",
    components: {
       zzuCitySelect
    },
    data() {
      return {
        imgHref: '',
        cfg: {
          formTitle: '添加景区',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formSearch: {
          hotelName: "",
          cityId: ''
        },
        formAddOrUpdate: {
          id: '',
          cityId: '',
          merchantName: '',
          phoneNumber: '',
          addressId: '',
          deviceInfo: '',
          receipt: '',
          address: '',
          settlementCycle: '',
          commissionRate: ''
        },
        ruleAddOrUpdate: {
          merchantName:[
            {required: true, message: '请输入景区名称', trigger: 'blur'}
          ],
          cityId:[
            {required: true, message: '请输入城市', trigger: 'blur'}
          ],
          phoneNumber: [
            {required: true, trigger: 'blur',validator: validPhone}
          ],
          settlementCycle:[
            {required: true, validator: validSettlementCycle, trigger: 'blur'}
          ],
          commissionRate:[
            {required: true, validator: validCommissionRate, trigger: 'blur'}
          ]
        },
        tableList: {
          title: "景区管理列表",
          query: {
            merchantName: '', //
            search: '', //
            pageNum: 1, // 第几页
            pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
          },
          selection: [],
          loading: false,
          columns: [
            {
              type: 'selection',
              width: 35,
              key: 'id',
              align: 'center',
              fixed: 'left'
            }, {
              title: '景区名称',
              key: 'merchantName',
              sortable: true
            },{
              title: '景区账户详情',
              key: 'sellerDetail',
              sortable: true
            },{
              title: '城市',
              key: 'cityName',
              sortable: true
            }, {
              title: '电话',
              key: 'phoneNumber',
              sortable: true
            }, {
              title: '地址',
              key: 'address',
              sortable: true
            }, {
              title: '设备号',
              key: 'deviceInfo',
              sortable: true
            }, {
              title: '开发票入口开放标识',
              key: 'receipt',
              sortable: true
            }, 
             {
              title: '结算周期(天)',
              key: 'settlementCycle',
              sortable: true
            }, {
              title: '佣金率(%)',
              key: 'commissionRate',
              sortable: true
            },
            {
              title: '创建时间',
              key: 'createdTime',
              sortable: true
            },{
              title: '更新时间',
              key: 'updatedTime',
              sortable: true
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
          for (let obj in newValue[0]) {
            this.formAddOrUpdate[obj] = newValue[0][obj]
          }
        } else {
          this.resetForm();
        }
      },
    },
    mounted () {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get(`deal/SubMerchant/list`,
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
      submitAddOrUpdate(formName) {
        // 表单验证后可提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveOrUpdate(this.formAddOrUpdate);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      saveOrUpdate (formAddOrUpdate) {
        // 更新或保存信息
        this.$http.post('deal/SubMerchant/saveOrUpdate',
          formAddOrUpdate
        ).then(rs => {
          if(rs.data.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.resetForm();
            this.findPage();
          } else {
            this.$message({
              type: 'warning',
              message: rs.data.msg
            });
          }
        }).catch();
      },
      resetForm(data) {
        for (let obj in this.formAddOrUpdate) {
          this.formAddOrUpdate[obj] = '';
        }
      },
      handleAdd(data) {
        this.$router.push({name: "fndSellerAddList", params:{id:data.id}})
      },
      handleBill(data) {
        this.$router.push({name: "fndSellerBill", params:{payId:data.id, subType: 'M',merchantName:data.merchantName}})
      },
      handleReport(data) {
        this.$router.push({name: "fndSellerReport", params:{payId:data.id}})
      },
      handleSettlement(data){
        this.$router.push({name: "fndSellerSettlement", params:{payId:data.id}})
      },
      handleRemove(data) {
        this.$confirm(`此操作将永久此景区, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          idList.push(data.id);
          this.$http.post('deal/SubMerchant/remove',
            idList
          ).then(rs => {
            if(rs.data.code === 0) {
              this.findPage();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'warning',
                message: rs.data.msg
              });
            }
          })
        })
      },
      handleDownload (id) {
        this.imgHref = this.$appCfg.http.baseURL + `deal/SubMerchant/create?id=${id}&subType=M`
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
      }
    }
  }
</script>

<style lang="scss" >
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
// .settlement {
//   width: 50px;
// }
</style>
