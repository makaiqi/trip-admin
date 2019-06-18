<!--
	购物点信息录入
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
              <el-input clearable v-model="tableList.query.search" placeholder="请输入购物点名称"></el-input>
            </el-form-item>
            <el-form-item>
              <zzu-udc v-model="tableList.query.shopTypeCode" placeholder="请选择购物点类型" :udc-code="tableList.query.shopType"></zzu-udc>
            </el-form-item>
            <el-form-item>
              <zzu-city-select v-model="tableList.query.cityId" placeholder="请选择城市名"></zzu-city-select>
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
            <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key" v-for="item in tableList.columns" :key="item.key" >
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
          <el-form-item label="购物点名称" prop="shoppingName">
            <el-input clearable v-model="formAddOrUpdate.shoppingName" placeholder="购物点名称"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="shopTypeCode">
            <zzu-udc v-model="formAddOrUpdate.shopTypeCode" :udc-code="tableList.query.shopType"></zzu-udc>
          </el-form-item>
          <el-form-item label="所在城市" prop="cityId">
            <zzu-city-select v-model="formAddOrUpdate.cityId" placeholder="请选择城市名"></zzu-city-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input clearable v-model="formAddOrUpdate.address" placeholder="详细地址" type="textarea" autosize></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="tel">
            <el-input clearable v-model="formAddOrUpdate.tel" placeholder="电话"></el-input>
          </el-form-item>
          <el-form-item label="主营产品" prop="mainProduct">
            <el-input clearable v-model="formAddOrUpdate.mainProduct" placeholder="主营产品"></el-input>
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
  import zzuUdc from '@/components/udc'

  export default {
    name: "userList",
    components: {
      zzuCitySelect, zzuUdc
    },
    data() {
      return {
        cfg: {
          formTitle: '添加购物点',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formStatus: false,
        formAddOrUpdate: {
          id: '',
          addressId: '',
          shoppingName: '',
          cityId: '',
          areaId: 1,
          shopTypeCode: '',
          mainProduct: '',
          address: '',
          tel: '',
          lng: '',
          lat: '',
          shortAddress: ''
        },
        ruleAddOrUpdate: {
          shoppingName: [
            {required: true, message: '请输入购物点名称', trigger: 'blur'}
          ],
          cityId: [
            {required: true, message: '请选择所在城市', trigger: 'blur'}
          ],
          shopTypeCode: [
            {required: true, message: '请选择购物点类型', trigger: 'blur'}
          ],
        },
        tableList: {
          title: "购物点列表",
          query: {
          	cityId: '',
            search: '',
            shopType: 'UDC_M03_T02',
            shopTypeCode: '',
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
              title: '购物点名称',
              key: 'shoppingName',
              width:260,
              fixed: 'left',
              sortable: true
            }, {
              title: '所在城市',
              key: 'name',
              width: 100,
              sortable: true
            }, {
              title: '详细地址',
              key: 'address',
              width: 300,
              sortable: true
            }, {
              title: '主营产品',
              key: 'mainProduct',
              sortable: true
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
          this.resetForm();
        }
      }
    },
    mounted () {
      this.findPage();
    },
    methods: {
      findPage() {
        // 获取列表数据
        this.$http.get('biz/ShoppingPoint/list',
           { params: this.tableList.query }
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
        this.$http.post('biz/ShoppingPoint/saveOrUpdate',
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
                type: 'success',
                message: '操作失败!'
              });
            }
          }).catch();
      },
      resetForm(data) {
        // 重置输入框
        for (let obj in this.formAddOrUpdate) {
          this.formAddOrUpdate[obj] = ''
        }
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
          this.$http.post('biz/ShoppingPoint/remove',
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
