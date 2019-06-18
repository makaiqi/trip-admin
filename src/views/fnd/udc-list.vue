<!--
  udc
  字典码：udcCode
  字典名称：udcName
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
              <el-input clearable v-model="tableList.query.search" placeholder="请输入字典名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除
              </el-button>
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
            <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title"
                             :sortable="item.sortable" :prop="item.key" v-for="item in tableList.columns"
                             :key="item.key">
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
        <el-form label-position="top" ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate"
                 label-width="80px">
          <el-form-item label="字典类型" prop="udcCode">
            <el-input clearable v-model="formAddOrUpdate.udcCode" placeholder="字典类型"></el-input>
            <!-- <el-select clearable filterable v-model="formAddOrUpdate.udcCode" placeholder="字典类型">
              <el-option
                v-for="item in udcType.list"
                :key="item.id"
                :label="item.typeName"
                :value="item.udcVal">
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="字典名称" prop="udcName">
            <el-input clearable v-model="formAddOrUpdate.udcName" placeholder="字典名称"></el-input>
          </el-form-item>

          <el-form-item label="字典值" prop="udcVal">
            <el-input clearable v-model="formAddOrUpdate.udcVal" placeholder="字典值"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input clearable v-model="formAddOrUpdate.remark" placeholder="备注" autosize type="textarea"></el-input>
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
  import zzuUdc from '@/components/udc'

  export default {
    name: "userList",
    components: {
      zzuUdc
    },
    data() {
      return {
        udcType: {
          query: {
            search: '',
            isPaging: false
          },
          list: []
        },
        cfg: {
          formTitle: '添加字典',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formStatus: false,
        formAddOrUpdate: {
          id: '',
          udcName: '',
          udcCode: '',
          udcVal: '',
          remark: ''
        },
        ruleAddOrUpdate: {
          udcCode: [
            {required: true, message: '请输入字典类型', trigger: 'blur'}
          ],
          udcName: [
            {required: true, message: '请输入字典名称', trigger: 'blur'}
          ],
          udcVal: [
            {required: true, message: '请输入字典值', trigger: 'blur'}
          ]
        },
        tableList: {
          title: "字典列表",
          query: {
            search: '',
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
              title: '字典名称',
              key: 'udcName',
              width: 220,
              fixed: 'left',
              sortable: true
            }, {
              title: '字典类型',
              key: 'udcCode',
              sortable: true
            }, {
              title: '字典值',
              key: 'udcVal',
              sortable: true
            },{
              title: '备注',
              key: 'remark',
              sortable: true,
              width: 330
            },{
              title: '创建时间',
              key: 'createdTime',
              sortable: true
            },{
              title: '创建人员',
              key: 'ownerName',
              width:100,
              sortable: true
            },{
              title: '更新时间',
              key: 'updatedTime',
              sortable: true
            },{
              title: '修改人员',
              key: 'opUserName',
              width:100,
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
        handler(newValue, oldValue) {
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
          this.resetForm();
        }
      },
      'udcCode'(newValue, oldValue) {

      }
    },
    mounted() {
      this.findPage();
    },
    methods: {
      findPage() {
        this.getUdcType();
        this.$http.get('fund/Udc/list',
          {params: this.tableList.query}
        ).then(rs => {
          if (rs.data.code == 0) {
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
      getUdcType() {
        // 获取字典类型
        this.$http.get('fund/UdcType/list',
          {
            params: {
              search: '',
              paging: false
            }
          }
        ).then(rs => {
          if (rs.data.code == 0) {
            this.udcType.list = rs.data.data;
          } else {
            this.udcType.list = [];
          }
        })
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
      saveOrUpdate(formAddOrUpdate) {
        if (this.formStatus) return;
        this.formStatus = true;
        // 更新或保存信息
        this.$http.post('fund/Udc/saveOrUpdate',
          formAddOrUpdate
        ).then(rs => {
          this.formStatus = false;
          if (rs.data.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.resetForm();
            this.findPage();
          } else {
            this.$message({
              type: 'success',
              message: rs.data.msg
            });
          }
        }).catch();
      },
      resetForm(data) {
        for (let obj in this.formAddOrUpdate) {
          this.formAddOrUpdate[obj] = ''
        }
      },
      deleteData() {
        let query = [];
        this.tableList.selection.map(item => {
          query.push(item.id)
        })
        // 删除UDC
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('fund/Udc/remove',
            query
          ).then(rs => {
            if (rs.data.code == 0) {
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

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
