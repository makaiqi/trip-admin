<!--
	票种信息录入
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
          <el-form ref="formSearch" :inline="true">
            <el-form-item>
              <el-input clearable v-model="tableList.query.search" placeholder="请输入票种名称"></el-input>
            </el-form-item>
            <el-form-item>
              <zzu-city-select v-model="tableList.query.cityId" placeholder="请选择城市"></zzu-city-select>
            </el-form-item>
            <!-- <el-form-item>
              <zzu-scenic-select :city-id="tableList.query.cityId" v-model="tableList.query.tScenicId" placeholder="请选择所在景点"></zzu-scenic-select>
            </el-form-item> -->
            <el-form-item>
              <!-- <el-button type="primary" icon="el-icon-search" @click="findPage">搜索</el-button> -->
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除</el-button>
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
            <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key" v-for="item in tableList.columns" :key="item.key"  :show-overflow-tooltip="true">
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
      </el-card>
    </div>

    <div class="base-block-right">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
        </div>
        <el-form label-position="top" ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate" label-width="80px">
          <el-form-item label="票种名称" prop="ticketName">
            <el-input clearable v-model="formAddOrUpdate.ticketName" placeholder="票种名称"></el-input>
          </el-form-item>
          <el-form-item label="所在城市" prop="tScenicId">
            <zzu-city-select v-model="formAddOrUpdate.cityId" placeholder="请选择城市"></zzu-city-select>
          </el-form-item>
          <el-form-item label="所在景点" prop="tScenicId">
            <zzu-scenic-select :city-id="formAddOrUpdate.cityId" v-model="formAddOrUpdate.tScenicId" placeholder="请选择景点"></zzu-scenic-select>
          </el-form-item>
          <el-form-item label="使用人群" prop="crowdCode">
            <zzu-udc v-model="formAddOrUpdate.crowdCode" :udc-code="formAddOrUpdate.crowdCodeVal" placeholder="使用人群"></zzu-udc>
          </el-form-item>
          <el-form-item label="时间范围" prop="limitScopeCode">
            <zzu-udc v-model="formAddOrUpdate.limitScopeCode" :udc-code="formAddOrUpdate.limitScopeCodeType" placeholder="时间范围"></zzu-udc>
          </el-form-item>
          <el-form-item label="物料类型" prop="materialCode">
            <zzu-udc v-model="formAddOrUpdate.materialCode" :udc-code="formAddOrUpdate.materialCodeType" placeholder="物料类型"></zzu-udc>
          </el-form-item>
          <el-form-item v-if="formAddOrUpdate.materialCode == 'V002' || formAddOrUpdate.materialCode == 'V004'" label="物料信息描述" prop="ticketDesc">
            <el-input clearable v-model="formAddOrUpdate.ticketDesc" placeholder="物料信息描述" type="textarea" autosize></el-input>
          </el-form-item>
          <el-form-item v-if="formAddOrUpdate.materialCode == 'V003' || formAddOrUpdate.materialCode == 'V004'" label="图片" prop="tassetId">
            <zzu-upload  v-model="tAssetList" ></zzu-upload>
          </el-form-item>
          <el-form-item label="门市价格" prop="storePrice">
            <el-input clearable v-model="formAddOrUpdate.storePrice" placeholder="门市价格"></el-input>
          </el-form-item>
          <el-form-item label="其他限制" prop="otherLimitScope">
            <el-input clearable v-model="formAddOrUpdate.otherLimitScope" placeholder="其他限制" type="textarea" autosize></el-input>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitAddOrUpdate('formAddOrUpdate')">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('formAddOrUpdate')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
  import {mapState} from 'vuex'

  import zzuCitySelect from '@/components/city-select'
  import zzuScenicSelect from '@/components/scenic-select'
  import zzuUdc from '@/components/udc'
  import zzuUpload from '@/components/upload'

  export default {
    name: "userList",
    components: {
      zzuCitySelect, zzuScenicSelect, zzuUdc, zzuUpload
    },
    data() {
      return {
        tAssetList: [],
        cfg: {
          formTitle: '添加票种',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formStatus: false,
        formAddOrUpdate: {
          id: '',
          tassetId: [],
          ticketName: '',
          cityId: '',
          tScenicId: '',
          crowdCode: '',
          crowdCodeVal: 'UDC_M06_T03',
          limitScopeCode: '',
          limitScopeCodeType: 'UDC_M03_T06',
          materialCode: '',
          materialCodeType: 'UDC_M06_T21',
          storePrice: '',
          otherLimitScope: '',
          ticketDesc: ''
        },
        ruleAddOrUpdate: {
          ticketName: [
            {required: true, message: '请输入票种名称', trigger: 'blur'}
          ],
          tScenicId: [
            {required: true, message: '请选择所在景点', trigger: 'blur'}
          ]
        },
        tableList: {
          title: "票种列表",
          query: {
            cityId: '',
          	tScenicId: '',
            search: '',
            // crowdCode: '',
            // limitScopeCode: '',
            // materialCode: '',
            pageNum: 1,
            pageSize: this.$appCfg.paginationCfg.pageSize,
            sort: 'id',
            order: 'desc'
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
              title: '票种名称',
              key: 'ticketName',
              width: 260,
              fixed: 'left',
              sortable: true
            }, {
              title: '所在城市',
              key: 'name',
              width: 100,
              sortable: true
            }, {
              title: '所在景点',
              key: 'scenicName',
              sortable: true
            }, {
              title: '可用时段',
              key: 'limitScopeCodeDesc',
              sortable: true
            }, {
              title: '使用人群',
              key: 'crowdCodeDesc',
              sortable: false
            }, {
              title: '门市价格',
              key: 'storePrice',
              sortable: true
            }, {
              title: '物料类型',
              key: 'materialCodeDesc',
              sortable: true
            }, {
              title: '物料信息描述',
              key: 'ticketDesc',
              width: 360,
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
          for (let obj in this.formAddOrUpdate) {
            this.formAddOrUpdate[obj] = newValue[0][obj]
          }
          this.tAssetList = newValue[0].assetDomainList
          this.formAddOrUpdate.crowdCodeVal =  'UDC_M06_T03'
          this.formAddOrUpdate.limitScopeCodeType =  'UDC_M03_T06'
          this.formAddOrUpdate.materialCodeType =  'UDC_M06_T21'
        } else {
          this.resetForm();
        }
      },
      'tAssetList' (newVal,oldVal) {
        if (newVal && newVal.length > 0) {
          this.formAddOrUpdate.tassetId = []
          newVal.forEach(item => {
            this.formAddOrUpdate.tassetId.push(item.id)
          })
        }
      }
    },
    mounted () {
      this.findPage();
    },
    methods: {
      findPage() {
        // 获取列表数据
        console.log("findPage")
        this.$http.get('biz/TicketType/list',
           { params: this.tableList.query }
          ).then(rs => {
            console.log(rs)
            if(rs.data.code == 0) {
              this.page.total = rs.data.data.total;
              this.tableList.data.rows = rs.data.data.rows;
            } else {
              this.page.total = 0;
              this.tableList.data.rows = [];
            }
          }).catch(() => {
              this.page.total = 0;
              this.tableList.data.rows = []
            }
          )
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
        if(this.formStatus) return;
        this.formStatus = true;
        // 更新或保存信息
        this.$http.post('biz/TicketType/saveOrUpdate',
          formAddOrUpdate
          ).then(rs => {
            this.formStatus = false;
            if(rs.data.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.resetForm();
              this.findPage();
            } else {
              this.$message({
                type: 'success',
                message: '操作失败!'
              });
            }
          }).catch();
      },
      resetForm(data) {
        for (let obj in this.formAddOrUpdate) {
          if (obj == 'crowdCodeVal' || obj == 'limitScopeCodeType' || obj == 'materialCodeType') {
            } else {
              this.formAddOrUpdate[obj] = ''
            }
        }
        this.formAddOrUpdate.crowdCodeVal =  'UDC_M06_T03'
        this.formAddOrUpdate.limitScopeCodeType =  'UDC_M03_T06'
        this.formAddOrUpdate.materialCodeType =  'UDC_M06_T21'
      },
      deleteData() {
        // 删除数据
        let data = [];
        this.tableList.selection.map(item => {
          data.push(item.id);
        });
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('biz/TicketType/remove',
            data
          ).then(rs => {
            if(rs.data.code == 0) {
              this.findPage();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败！'
              });
            }
          }).catch();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSelectionChange(val) {
        // table选中改变
        this.tableList.selection = val.sort(function (a, b) {
          return a.id > b.id;
        });
      },
      handlePageSizeChange(val) {
        // 每页数量改变
        this.tableList.query.pageSize = val;
      },
      handlePageCurrentChange(val) {
        // 当前页改变
        this.tableList.query.pageNum = val;
      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
