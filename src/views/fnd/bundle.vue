<!--
	景点信息增删改查
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
            <el-form-item prop="scenicName">
              <el-input clearable v-model="tableList.query.search" placeholder="名称检索"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- <el-button type="primary" icon="el-icon-search" @click="findPage">搜索</el-button> -->
              <el-button
                :disabled="tableList.selection.length == 0"
                icon="el-icon-delete"
                @click="deleteData"
              >删除</el-button>
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
            class="base-block-table"
          >
            <el-table-column
              :type="item.type"
              :fixed="item.fixed"
              :width="item.width || 150"
              :label="item.title"
              :sortable="item.sortable"
              :prop="item.key"
              v-for="item in tableList.columns"
              :key="item.key"
              :show-overflow-tooltip="true"
            ></el-table-column>
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
          ></el-pagination>
        </div>
      </el-card>
    </div>
    <div class="base-block-right">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
        </div>
        <el-form label-position="top"  ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate" label-width="80px">
          <el-form-item label="菜单范围名称" prop="bundleName">
            <el-input clearable v-model="formAddOrUpdate.bundleName" placeholder="请输入菜单模板名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuIds">
            <xyBundleSelect
              :currentValue="formAddOrUpdate.menuIds"
              labelName="menuName"
              valueName="id"
              url='/arch/Menu/list?paging=false'
              :params ='tableList.query'
              :multiple="cfg.multiple"
              @xy-change="menuChangeHandler"
              placeholder="请选择菜单"
            ></xyBundleSelect>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitAddOrUpdate('formAddOrUpdate')">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
  import xyBundleSelect from  '@/components/xy-bundle-select'
  export default {
    name: "userList",
    components:{xyBundleSelect},
    data() {
      return {
        cfg: {
          formTitle: '添加菜单范围',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false,
          multiple:true
        },
        formSearch: {
          scenicName: "",
          fndCityId: ''
        },
        formStatus: false,
        formAddOrUpdate: {
          id: '',
          bundleName:'',
          menuIds:[],
          menuTypeCode:'V002'
        },
        ruleAddOrUpdate: {
          bundleName: [
            {required: true, message: '请输入菜单模板名称', trigger: 'blur'}
          ],
          menuIds: [
            {required: true, message: '请选择菜单', trigger: 'blur'}
          ],
        },
        tableList: {
          title: "景区菜单模板",
          query: {
            search: '', // 景点名称， 模糊查询
            cityId: '', // 景点所在城市
            pageNum: 1, // 第几页
            pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
            sort: 'id', // 主表字段名称
            order: 'desc', // 正序还是倒序
            menuTypeCode:'V002'
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
              title: '景区菜单模板定义',
              key: 'bundleName',
              width: 260,
              fixed: 'left',
              sortable: true
            }, {
              title: '菜单',
              width: 600,
              key: 'menuNames',
              sortable: true,
              align: 'center',
            },
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
        console.log(newValue,'newValue')
        if (newValue.length > 0) {
          for (let obj in this.formAddOrUpdate) {
            if(obj == 'menuTypeCode'){
              this.formAddOrUpdate[obj] = 'v002';
            }else{
              this.formAddOrUpdate[obj] = newValue[0][obj];
            }
          }
        } else {
          this.resetForm();
        }
      },
      'formAddOrUpdate.menuIds'(newValue, oldValue){
        this.formAddOrUpdate.menuIds= newValue || [];
      },
    },
    mounted () {
      this.findPage();
    },
    methods: {
      menuChangeHandler(id){
        this.formAddOrUpdate.menuIds = id || [];
      },
      findPage() {
        this.$http.get(`biz/Bundle/list`,
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
        if(this.formStatus) return;
        this.formStatus = true;
        let data = this.saveOrUpdateAddress(formAddOrUpdate);
        // 更新或保存信息
        this.$http.post('biz/Bundle/saveOrUpdate',
          data
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
                type: 'warning',
                message: '操作失败!'
              });
            }
          }).catch();
      },
      resetForm() {
        for (let obj in this.formAddOrUpdate) {
          if(obj == 'menuTypeCode') {
            this.formAddOrUpdate[obj] = 'v002';
          } else if(obj == 'menuIds') {
            this.formAddOrUpdate[obj] = [];
          }else{
            this.formAddOrUpdate[obj] = ''
          }
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
          this.$http.post('biz/Bundle/remove',
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
@import "~@/assets/css/core/index";
@import "~@/assets/css/base-block";

.base-block-right{
  width: 600px
}
</style>
