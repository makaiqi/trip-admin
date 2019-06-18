<!--
	udc
	字典类型：moduleCode
	字典名称：typeName
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
              <el-input clearable v-model="tableList.query.search" placeholder="请输入名称"></el-input>
            </el-form-item>

            <el-form-item>
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
            <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key" v-for="item in tableList.columns" :key="item.key">
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
          <el-form-item label="物流公司名称" prop="companyName">
            <el-input clearable v-model="formAddOrUpdate.companyName" placeholder="物流公司名称"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="codeNo">
            <el-input clearable v-model="formAddOrUpdate.codeNo" placeholder="排序">
            </el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seq">
            <el-input clearable v-model="formAddOrUpdate.seq" placeholder="排序">
            </el-input>
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

  import zzuUdc from '@/components/udc'
  // import zzuDataList from '@/components/data-list'

  export default {
    name: "userList",
    components: {
      zzuUdc
    },
    data() {
      var validateNmuber = (rule, value, callback) => {
        let isNum = /^[0-9]*$/;
        value = isNum.test(value)
        if (!value) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      };
      return {
        cfg: {
          formTitle: '添加物流公司',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formStatus: false,
        formAddOrUpdate: {
          codeNo: '',
          companyName: '',
          seq: ''
        },
        ruleAddOrUpdate: {
          companyName: [
            {required: true, message: '请输入物流公司名称', trigger: 'blur'}
          ],
          codeNo:[
            {required: true, message: '请输入编号', trigger: 'blur'},
            { validator: validateNmuber, trigger: 'blur' }
          ],
          seq:[
            {required: true, message: '请输入排序', trigger: 'blur'},
            { validator: validateNmuber, trigger: 'blur' }
          ]
        },
        formSearch: {
          search: '',
          moduleCode: '',
          pageNum: 1,
          pageSize: this.$appCfg.paginationCfg.pageSize,
          sort: 'id',
          order: 'desc'
        },
        tableList: {
          title: "物流公司列表",
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
              title: '物流公司名称',
              key: 'companyName',
              fixed: 'left',
              sortable: true
            },{
              title: '编号',
              key: 'codeNo',
              fixed: 'left',
              sortable: true
            }, {
              title: '排序',
              key: 'seq',
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
          this.formAddOrUpdate.id = newValue[0].id
        } else {
          this.resetForm();
        }
      }
    },
    mounted() {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get('/store/LogisticsCompany/list',
          { params: this.tableList.query}
        ).then(rs => {
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
      changeSelection (data) {
        if (data.length > 0) {
          for (let obj in this.formAddOrUpdate) {
            this.formAddOrUpdate[obj] = data[0][obj]
          }
          this.formAddOrUpdate.id = newValue[0].id
        } else {
          for (let obj in this.formAddOrUpdate) {
            this.formAddOrUpdate[obj] = ''
          }
        }
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
        this.$http.post('/store/LogisticsCompany/saveOrUpdate',
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
          this.$http.post('/store/LogisticsCompany/remove',
            query
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
