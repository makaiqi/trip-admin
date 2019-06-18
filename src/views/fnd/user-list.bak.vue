<!--
	用户管理
 -->

<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ tableList.title }}</span>
          <span class="line-gray">(共{{tableList.data.total}}数据)</span>
        </div>
        <div class="base-block-container">
          <el-form ref="formSearch" v-model="formSearch" :inline="true">
            <el-form-item prop="userName">
              <el-input v-model="formSearch.userName" placeholder="登录名、手机号 搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="refreshTable">搜索</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-refresh" @click="resetPassword">重置密码</el-button>
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
            <el-table-column :type="item.type" :width="item.width" :label="item.title" :sortable="item.sortable"
                             :prop="item.key" v-for="item in tableList.columns" :key="item.key">
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
            :current-page="tableList.query.page"
            :page-sizes="tableList.query.pageSizes"
            :page-size="tableList.query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableList.query.rows">
          </el-pagination>
        </div>
      </el-card>
    </div>
    <div class="base-block-right">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
        </div>
        <el-form ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate" label-width="80px">
          <el-form-item label="登录账户" prop="userName">
            <el-input v-model="formAddOrUpdate.userName" placeholder="登录账户"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="formAddOrUpdate.mobile" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitForm('formAddOrUpdate')">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('formAddOrUpdate')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
  import {mapState} from 'vuex'

  export default {
    name: "userList",
    data() {
      return {
        cfg: {
          formTitle: '添加城市',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formSearch: {
          userName: ""
        },
        formAddOrUpdate: {
          userName: '',
          mobile: ''
        },
        ruleAddOrUpdate: {
          userName: [
            {required: true, message: '请输入用户名称', trigger: 'blur'}
          ],
          mobile: [
            {required: true, type: 'regexp', pattern: /^\d{11}$/, message: '请填写正确的手机号码', trigger: 'blur'}
          ]
        },
        tableList: {
          title: "城市列表",
          query: {
            search: '',
            page: 1,
            rows: this.$appCfg.queryCfg.pageSize,
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
              title: '用户名称',
              key: 'userName',
              fixed: 'left',
              sortable: true
            }, {
              title: '手机号码',
              key: 'mobile',
              sortable: true
            }, {
              title: '操作人',
              key: 'opUserId'
            }, {
              title: '最近登陆时间',
              key: 'lastLogin',
              sortable: true
            }, {
              title: '创建时间',
              key: 'createdTime',
              sortable: true
            }, {
              title: '更新时间',
              key: 'updatedTime',
              sortable: true
            }
          ],
          data: {
            total: 0,
            rows: [
              {
                id: 1,
                userName: "戚瑞印1",
                mobile: "15021417505",
                opUserId: "戚瑞印",
                lastLogin: "2018/04/10",
                createdTime: "2017/09/10",
                updatedTime: "2018/03/20"
              }, {
                id: 2,
                userName: "戚瑞印2",
                mobile: "15021417505",
                opUserId: "戚瑞印",
                lastLogin: "2018/04/10",
                createdTime: "2017/09/10",
                updatedTime: "2018/03/20"
              }
            ]
          }
        }
      }
    },
    computed: {
      ...mapState({
        page: state => state.page
      })
    },
    watch: {
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
    mounted() {
    },
    methods: {
      refreshTable() {

      },
      submitForm(data) {

      },
      resetForm(data) {

      },
      resetPassword() {

      },
      deleteData() {

      },
      handleSelectionChange(val) {
        this.tableList.selection = val.sort(function (a, b) {
          return a.id > b.id;
        });
      },
      handlePageSizeChange() {

      },
      handlePageCurrentChange() {

      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
