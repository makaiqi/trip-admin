<!--
	供应商信息增删改查
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
              <el-input clearable v-model="tableList.query.search" placeholder="供应商名称检索"></el-input>
            </el-form-item>
            <el-form-item prop="cityId">
              <zzu-city-select v-model="tableList.query.cityId"></zzu-city-select>
            </el-form-item>

            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-email" @click="showEmail">发送邮件</el-button>
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
            <template v-for="item in tableList.columns">
              <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
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
          <el-form-item label="供应商类型" prop="vendorTypeCode">
            <zzu-udc v-model="formAddOrUpdate.vendorTypeCode" :udc-code="formAddOrUpdate.vendorTypeCodeVal" placeholder="供应商类型"></zzu-udc>
          </el-form-item>
          <el-form-item v-if="!(formAddOrUpdate.tUserId && (!userInclude))" label="关联登录账号" prop="tUserId">
            <zzu-user-select v-model="formAddOrUpdate.tUserId" @userCodeList="acceptUserCodeList"></zzu-user-select>
          </el-form-item>
          <el-form-item v-if="formAddOrUpdate.tUserId && (!userInclude)" label="关联登录账号" prop="userName">
            <el-input disabled v-model="formAddOrUpdate.userName"></el-input>
          </el-form-item>
          <el-form-item label="供应商名称" prop="vendorName">
            <el-input clearable v-model="formAddOrUpdate.vendorName" placeholder="供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="供应商简称" prop="vendorShortName">
            <el-input clearable v-model="formAddOrUpdate.vendorShortName" placeholder="供应商简称"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brand">
            <el-input clearable v-model="formAddOrUpdate.brand" placeholder="品牌"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="cityId">
            <zzu-city-select v-model="formAddOrUpdate.cityId" placeholder="城市"></zzu-city-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input clearable v-model="formAddOrUpdate.address" placeholder="详细地址" type="textarea" autosize></el-input>
          </el-form-item>
          <el-form-item label="短地址" prop="shortAddress">
            <el-input clearable v-model="formAddOrUpdate.shortAddress" placeholder="短地址"></el-input>
          </el-form-item>

          <!-- <el-form-item label="地址" prop="map">
            <zzu-map v-model="mapData"></zzu-map>
          </el-form-item>
          <el-form-item label="经度" prop="lat">
            <el-input clearable v-model="formAddOrUpdate.lat" placeholder="经度"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="lng">
            <el-input clearable v-model="formAddOrUpdate.lng" placeholder="纬度"></el-input>
          </el-form-item> -->
          <el-form-item label="统一社会信用编号" prop="unifiedSocialNo">
            <el-input clearable v-model="formAddOrUpdate.unifiedSocialNo" placeholder="统一社会信用编号"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" prop="bankTypeCode">
            <zzu-udc v-model="formAddOrUpdate.bankTypeCode" :udc-code="formAddOrUpdate.bankTypeCodeVal" placeholder="开户银行类型编码"></zzu-udc>
          </el-form-item>
          <el-form-item label="银行账户类型" prop="bankAccountTypeCode">
            <zzu-udc v-model="formAddOrUpdate.bankAccountTypeCode" :udc-code="formAddOrUpdate.bankAccountTypeCodeVal" placeholder="银行账户类型"></zzu-udc>
          </el-form-item>
          <el-form-item label="开户行信息" prop="bankAccountInfo">
            <el-input clearable v-model="formAddOrUpdate.bankAccountInfo" placeholder="开户行信息"></el-input>
          </el-form-item>
          <el-form-item label="开户帐号" prop="bankAccountNo">
            <el-input clearable v-model="formAddOrUpdate.bankAccountNo" placeholder="开户帐号"></el-input>
          </el-form-item>
          <el-form-item label="传真" prop="fax">
            <el-input clearable v-model="formAddOrUpdate.fax" placeholder="传真"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input clearable v-model="formAddOrUpdate.tel" placeholder="联系电话"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input clearable v-model="formAddOrUpdate.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件" prop="email">
            <el-input clearable v-model="formAddOrUpdate.email" placeholder="电子邮件"></el-input>
          </el-form-item>
          <el-form-item label="官网url" prop="website">
            <el-input clearable v-model="formAddOrUpdate.website" placeholder="官网url" type="textarea" autosize></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitAddOrUpdate('formAddOrUpdate')">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('formAddOrUpdate')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog title="发送邮件" :visible.sync="email.visible">
      <zzu-email :to="email.list"></zzu-email>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
  import {mapState} from 'vuex'

  import zzuMap from '@/components/map'
  import zzuUdc from '@/components/udc'
  import zzuEmail from '@/components/email'
  import zzuCitySelect from '@/components/city-select'
  import zzuScenicSelect from '@/components/scenic-select'
  import zzuUserSelect from '@/components/user-no-vendor-select'

  export default {
    name: "userList",
    components: {
      zzuMap, zzuUdc, zzuEmail, zzuCitySelect, zzuScenicSelect, zzuUserSelect
    },
    data() {
      return {
        mapData: {
          lng: '',
          lat: ''
        },
        email: {
          visible: false,
          list: []
        },
        cfg: {
          formTitle: '添加供应商',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formSearch: {
          scenicName: "",
          cityId: ''
        },
        userCodeList: [],
        userInclude: true,
        formStatus: false,
        formAddOrUpdate: {
          id: '',
          tUserId: '',
          addressId: '',
          vendorName: '',
          vendorShortName: '',
          addressId: '',
          address: '',
          shortAddress: '',
          lat: '',
          lng: '',
          cityId: '',
          unifiedSocialNo: '',
          vendorTypeCode: '',
          vendorTypeCodeVal: 'UDC_M03_T09',
          brand: '',
          bankAccountTypeCode: '',
          bankAccountTypeCodeVal: 'UDC_M03_T10',
          bankTypeCode: '',
          bankTypeCodeVal: 'UDC_M03_T11',
          bankAccountInfo: '',
          bankAccountNo: '',
          fax: '',
          tel: '',
          mobile: '',
          email: '',
          website: '',
          isService: false,
          userName: ''
        },
        ruleAddOrUpdate: {
          vendorName: [
            {required: true, message: '请输入供应商名称', trigger: 'blur'}
          ],
          vendorTypeCode: [
            {required: true, message: '请选择供应商类型', trigger: 'blur'}
          ],
          cityId:[
            {required: true, message: '请选择城市', trigger: 'blur'}
          ],
          unifiedSocialNo: [
            {required: true, message: '请输入统一社会信用编号', trigger: 'blur'}
          ],
          bankAccountTypeCode: [
            {required: true, message: '请选择银行账户类型', trigger: 'blur'}
          ],
          bankTypeCode: [
            {required: true, message: '请选择开户银行类型', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
        },
        tableList: {
          title: "供货商列表",
          query: {
            search: '', // 供应商名称， 模糊查询
            cityId: '', // 供应商所在城市
            pageNum: 1, // 第几页
            isService: false,
            pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
            sort: 'id', // 主表字段名称
            order: 'desc' // 正序还是倒序
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
              title: '供应商名称',
              key: 'vendorName',
              width: 200,
              fixed: 'left',
              sortable: true
            }, {
              title: "手机号",
              width: 120,
              sortable: true,
              fixed: 'left',
              key: 'mobile'
            },{
              title: '城市',
              width: 100,
              key: 'name',
              sortable: true
            }, {
              title: '供应商类型',
              width: 120,
              key: 'vendorTypeCodeDesc',
              sortable: true
            },{
              title: '供应商简称',
              key: 'vendorShortName',
              width: 120,
              sortable: true
            },{
              title: "联系电话",
              width: 100,
              key: 'tel'
            },{
              title: "统一社会信用编号",
              sortable: true,
              key: 'unifiedSocialNo'

            },{
              title: "银行账户类型",
              sortable: true,
              key: 'bankAccountTypeCodeDesc'

            },{
              title: "开户银行",
              sortable: true,
              width: 120,
              key: 'bankTypeCodeDesc'
            },{
              title: "开户帐号",
              sortable: true,
              width: 300,
              key: 'bankAccountNo'
            },{
              title: "开户行信息",
              sortable: true,
              width: 200,
              key: 'bankAccountInfo'
            },{
              title: "电子邮件",
              sortable: true,
              width: 160,
              key: 'email'
            },{
              title: "官网Url",
              width: 160,
              key: 'website'
            },{
              title: '地址',
              key: 'address',
              width: 360,
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
      'formAddOrUpdate.tUserId'(newVal, oldVal) {
        if (newVal) {
          let result = this.userCodeList.indexOf(newVal)
          console.log(result)
          if (result == -1) {
            this.userInclude = false
          } else {
            this.userInclude = true
          }
        }
      },
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
      },
      mapData: {
        handler: function(newValue, oldValue) {
          console.log(newValue);
          if(newValue.lng) {
            this.formAddOrUpdate.lng = newValue.lng
            this.formAddOrUpdate.lat = newValue.lat
          }
        },
        deep: true
      }
    },
    mounted () {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get(`biz/Vendor/list`,
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
            this.$message({
              message: "请输入完整信息",
              type: "warning"
            })
            return false;
          }
        });
      },
      saveOrUpdate (formAddOrUpdate) {
        if (this.formAddOrUpdate.email) {
          var isEmail = this.$elKit.isEmail.test(this.formAddOrUpdate.email)
          if (!isEmail) {
            this.$message({
              message: "邮箱填写格式错误,请重新填写"
            })
            return
          }
        }
        if(this.formStatus) return;
        this.formStatus = true;
        let data = formAddOrUpdate;
        // let data = this.saveOrUpdateAddress(formAddOrUpdate);

        // 更新或保存信息
        this.$http.post('biz/Vendor/saveOrUpdate',
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
                type: 'error',
                message: rs.data.msg
              });
            }
          }).catch();
      },
      resetForm(data) {
        for (let obj in this.formAddOrUpdate) {
          if(obj == 'isService') {
            this.formAddOrUpdate[obj] = false
          } else if (obj == 'vendorTypeCodeVal' || obj == 'bankAccountTypeCodeVal' || obj == 'bankTypeCodeVal') {

          } else {
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
          this.$http.post('biz/Vendor/remove',
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
                message: rs.data.msg
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
      },
      acceptUserCodeList (val) {
        this.userCodeList = val
      },
      showEmail () {
        this.email.visible = true;
        let list = [];
        this.tableList.selection.map(item => {
          if(item.email) {
            list.push(item.email)
          }
        });
        this.email.list = list;
      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
