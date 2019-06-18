<!--
  用户管理
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
          <el-form v-model="tableList.query" :inline="true">
            <el-form-item>
              <el-input clearable v-model="tableList.query.search" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-lock"  @click="lockUser">锁定用户</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-unlock" @click="unlockUser">解除锁定</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="resetPwd">重置密码</el-button>
              <!-- <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除</el-button>
              <el-button :disabled="tableList.selection.length == 0" @click="lockUser"><font-awesome-icon icon="lock" /> 锁定用户</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-lock" @click="unlockUser"><font-awesome-icon icon="unlock" /> 解除锁定</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="resetPwd">重置密码</el-button> -->
            </el-form-item>
          </el-form>

          <el-table
            ref="multipleTable"
            :data="tableList.data.rows"
            border
            stripe
            :fit="true"
            tooltip-effect="dark"
            style="width: 100%"
            :formatter="tableFormatter"
            @selection-change="handleSelectionChange"
            class="base-block-table" >
            <template v-for="item in tableList.columns">
              <!-- <el-table-column :key="item.key" v-if="item.key == 'roleDomainList'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              </el-table-column> -->
              <el-table-column :key="item.key" v-if="item.key == 'roleDomainList'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template  slot-scope="scope">
                  <span v-for="(it, ind) in scope.row.roleDomainList" :key="ind">{{ ind == 0 ? it.roleName : '、' + it.roleName }}</span>
                </template>
              </el-table-column>
              <el-table-column :key="item.key" v-else-if="item.key == 'avatarUrl'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template  slot-scope="scope">
                  <img :src='scope.row.avatarUrl' height="100%" width="100%" v-if="scope.row.avatarUrl">
                </template>
              </el-table-column>
              <el-table-column :key="item.key" v-else :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
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
          <el-form-item label="用户名称（不唯一）" prop="userName">
            <el-input clearable v-model="formAddOrUpdate.userName" placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号码（必须唯一）" prop="mobile">
            <el-input clearable v-model="formAddOrUpdate.mobile" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item v-show="!formAddOrUpdate.id" label="密码" prop="pwd">
            <el-input clearable v-model="formAddOrUpdate.pwd" :readonly="!!formAddOrUpdate.id" type="password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleList">
            <zzu-role v-model="formAddOrUpdate.roleList" :multiple="true" placeholder="用户角色"></zzu-role>
          </el-form-item>
          <el-form-item label="用户头像" prop="avatarAssertId">
            <zzu-upload v-model="avatarAssertId" :limit="1" list-type="picture-card" @xy-remove = 'handleRemovePic'></zzu-upload>
            <div style="color:red">请上传尺寸为670px宽 387px高的图片（宽高比为1.72）</div>
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
  import zzuRole from '@/components/role'
  import zzuUpload from '@/components/upload'
  import moment from 'moment'

  export default {
    name: "userList",
    components: {
      zzuUdc, zzuRole,zzuUpload
    },
    data() {
      return {
        cfg: {
          formTitle: '添加用户',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formStatus: false,
        avatarAssertId:[],
        formAddOrUpdate: {
          id: '',
          userName: '',
          mobile: '',
          pwd: '',
          roleList: [],
          avatarAssertId:null,
          avatarUrl:null,
        },
        ruleAddOrUpdate: {
          userName:[
            {required: true, message: '请输入用户名称', trigger: 'blur'}
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
          ],
          pwd:[
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          // avatarAssertId:[
          //   {required: true, message: '请上传头像', trigger: 'blur'}
          // ],
          roleList:[
            {required: true, message: '请选择角色', trigger: 'blur'}
          ]
        },
       
        tableFormatter({row, rowIndex}) {
          console.log(row)
          if (row.endTime !=null && moment().isBefore(row.endtime)) {
            // console.log('-----')
            return 'strikethrough-table-row';
          }
          return '';
        },
        tableList: {
          title: "用户列表",
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
              fixed: 'left',
              sortable: true
            },{
              title: '用户名称',
              key: 'userName',
              width: 150,
              fixed: 'left',
              sortable: true
            },
            {
              title: '用户头像',
              width: 100,
              key: 'avatarUrl',
              fixed: 'left',
              sortable: true
            },
            {
              title: '手机号码',
              width: 100,
              key: 'mobile',
              // fixed: 'left',
              sortable: true
            },{
              title: '用户角色',
              width: 260,
              key: 'roleDomainList',
              sortable: true
            },
            {
              title: '最近登陆时间',
              key: 'lastLogin',
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
        },
        selection: []
      }
    },
    watch: {
      'tableList.query': {
        handler (newValue, oldValue) {
          this.findPage();
        },
        deep: true
      },
    
     'avatarAssertId': {
        handler: function(newValue, oldValue) {
          console.log(newValue,"222")
          // console.log(newValue)
          if(newValue.length>0){
            this.formAddOrUpdate.avatarAssertId = newValue[0].id;
            this.formAddOrUpdate.avatarUrl = newValue[0].url;
          }else{
            this.formAddOrUpdate.avatarAssertId = null;
             this.formAddOrUpdate.avatarUrl = null;
          }
           // this.formAddOrUpdate.avatarUrl = newValue[0].url;
         
        },
        deep: true
      },
     
     'tableList.selection'(newValue, oldValue) {
        // console.log(newValue)
        if (newValue.length > 0) {
          for (let obj in this.formAddOrUpdate) {
            if(obj == 'roleList') {
              let data = [];
              newValue[0].roleDomainList.map(item => {
                data.push(item.id)
              })
              this.formAddOrUpdate.roleList = data;
            } else if(obj == 'avatarAssertId') {
              console.log(newValue[0].avatarAssertId,"this.formAddOrUpdate.avatarAssertId")
              if(newValue[0].avatarAssertId){

                this.avatarAssertId = [{ id: newValue[0].avatarAssertId, url: newValue[0].avatarUrl }];
                this.formAddOrUpdate[obj] = newValue[0].avatarAssertId;
                // this.formAddOrUpdate.avatarUrl= newValue[0].avatarUrl;
              }else{
                this.avatarAssertId=[]
                this.formAddOrUpdate[obj] = null;
                this.formAddOrUpdate.avatarUrl = null;
              }
            } else if(obj == "pwd") {
              this.formAddOrUpdate.pwd = '1231111233333333333333'
            } else {
              this.formAddOrUpdate[obj] = newValue[0][obj]
              
            }
          }
          // this.avatarAssertId = [newValue[0].assetDomain];
        } else {
          this.resetForm();
        }
      },
      
    },
    mounted() {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get('arch/User/list',
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
              this.tableList.data.rows = [];
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
        // console.log(formAddOrUpdate,'666');
        if(this.formStatus) return;
        this.formStatus = true;
        if(formAddOrUpdate.id) {
          formAddOrUpdate.pwd = '';
        }
        // 更新或保存信息
        this.$http.post('arch/User/saveOrUpdate',
          formAddOrUpdate
          ).then(rs => {
            console.log(rs,'成功');
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
                message: rs.data.msg
              });
            }
            formAddOrUpdate.pwd = '';
          });
      },
      resetForm(data) {
        for (let obj in this.formAddOrUpdate) {
          if(obj == 'roleList') {
            this.formAddOrUpdate.roleList = []
          } else {
            this.formAddOrUpdate[obj] = ''
          }
        }
        this.avatarAssertId = []
        this.formAddOrUpdate.avatarUrl = null;
      },
      resetPwd () {
        let idList = [];
        this.tableList.selection.map(item => {
          idList.push(item.id)
        })
        this.$prompt('请输入密码', '批量修改选中用户的密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '密码格式不正确'
        }).then(({ value }) => {
          this.$http.post('arch/User/resetPwd',
            {
              pwd: value,
              idList
            }).then(rsData => {
              if(rsData.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '密码修改成功'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: '密码修改失败'
                });
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '密码修改失败'
              });
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
        });
      },
      deleteData() {
        let data = this.selection;
        let idList = []
        data.forEach(item => {
          idList.push(item.id)
        })
        // 删除UDC
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('arch/User/remove',
            idList
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
      lockUser() {
        let data = this.formAddOrUpdate;
        console.log(data);
        this.$http.post('arch/User/lockUser',
          [data.id]
        ).then(rs => {
          if(rs.data.code == 0) {
            this.findPage();
            this.$message({
              type: 'success',
              message: '锁定成功!'
            });
          } else {
            this.$message({
              type: 'warning',
              message: '锁定失败！'
            });
          }
        }).catch();
      },
      unlockUser(){
        let data = this.formAddOrUpdate;
        // console.log(data);
        this.$http.post('arch/User/unlockUser',
          [data.id]
        ).then(rs => {
          if(rs.data.code == 0) {
            this.findPage();
            this.$message({
              type: 'success',
              message: '解锁成功!'
            });
          } else {
            this.$message({
              type: 'warning',
              message: '解锁失败！'
            });
          }
        }).catch();
      },
      handleSelectionChange(val) {
        this.selection = val
        this.tableList.selection = val.sort(function (a, b) {
          return a.id > b.id;
        });
      },
       handleRemovePic(file){
          if(file){
              this.formAddOrUpdate.avatarAssertId = null;
          }
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
