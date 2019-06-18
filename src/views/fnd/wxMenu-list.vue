<!--
  微信首页菜单管理
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
              <el-input clearable v-model="tableList.query.search" placeholder="请输入菜单名称"></el-input>
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

            <template v-for="item in tableList.columns">
              <el-table-column v-if="item.key == 'isBindCity'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <span>{{ scope.row.isBindCity ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'iconCode'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <div :class="['menu-icon', scope.row.iconCode ]"></div>
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
          <el-form-item label="菜单类别" prop="typeCode">
            <zzu-udc clearable v-model="formAddOrUpdate.typeCode" :udc-code="formAddOrUpdate.typeCodeVal" disabled></zzu-udc>
          </el-form-item>
          <el-form-item label="菜单名称" prop="title">
            <el-input clearable v-model="formAddOrUpdate.title" :maxlength="4" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="产品类别" prop="typeTableCode">
            <zzu-udc v-model="formAddOrUpdate.typeTableCode" :udc-code="formAddOrUpdate.typeTableCodeVal" placeholder="产品类别"></zzu-udc>
          </el-form-item>
          <el-form-item v-if="formAddOrUpdate.typeTableCode == 'T_TAG'" label="标签" prop="tTagId">
            <zzu-tag-list v-model="tagList" :max="1" tag-type="travel" name="tagName" placeholder="标签"></zzu-tag-list>
          </el-form-item>
          <el-form-item label="图标编码" prop="iconCode">
            <zzu-menu-icon-select v-model="formAddOrUpdate.iconCode"></zzu-menu-icon-select>
            <!-- <zzu-udc v-model="formAddOrUpdate.iconCode" :udc-code="formAddOrUpdate.iconCodeVal" placeholder="图标编码"></zzu-udc> -->
          </el-form-item>
          <el-form-item label="排序" prop="seq">
            <el-input clearable type="number" v-model="formAddOrUpdate.seq" placeholder="排序"></el-input>
          </el-form-item>
          <!--0725暂时隐藏-->
          <!--<el-form-item label="是否绑定客户所在城市" prop="isBindCity">-->
            <!--<el-switch v-model="formAddOrUpdate.isBindCity"></el-switch>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="链接地址" prop="linkUrl">-->
            <!--<el-input clearable v-model="formAddOrUpdate.linkUrl" placeholder="链接地址"></el-input>-->
          <!--</el-form-item>-->
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
  import zzuCitySelect from '@/components/city-select'
  import zzuVendorSelect from '@/components/vendor-select'
  import zzuAdTypeSelect from '@/components/ad-type-select'
  import zzuUpload from '@/components/upload'
  import zzuTagList from '@/components/tag-list'
  import zzuMenuIconSelect from '@/components/menu-icon-select'

  export default {
    name: "wxMenuList",
    components: {
      zzuUdc, zzuCitySelect, zzuVendorSelect, zzuAdTypeSelect, zzuUpload, zzuTagList, zzuMenuIconSelect
    },
    data() {
      return {
        cfg: {
          formTitle: '添加微信首页菜单',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formStatus: false,
        tagList: [],
        formAddOrUpdate: {
          id: '',
          title: '',
          linkUrl: '',
          typeTableCode: '',
          typeTableCodeVal: 'UDC_M03_T31',
          iconCode: '',
          typeCode: 'V001',
          typeCodeVal: 'UDC_M03_T35',
          // iconCodeVal: 'UDC_M03_T30',
          seq: '',
          tTagId: '',
          isBindCity: false,
          remark: ''
        },
        ruleAddOrUpdate: {
          typeCode: [
            {required: true, message: '请选择菜单类型', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '请选择微信首页菜单名称', trigger: 'blur'}
          ],
          linkUrl: [
            {required: true, message: '请输入跳转地址', trigger: 'blur'}
          ],
          seq: [
            {required: true, message: '请填写排序顺序', trigger: 'blur'}
          ]
        },
        tableList: {
          title: "微信首页菜单列表",
          query: {
            search: '',
            pageNum: 1,
            pageSize: this.$appCfg.paginationCfg.pageSize,
            sort: 'id',
            order: 'desc',
            typeCode: 'V001'
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
              title: '菜单名称',
              sortable: true,
              key: 'title',
              fixed: 'left'
            }, {
              title: '产品类别',
              sortable: true,
              key: 'typeTableCodeDesc'
            }, {
              title: '图标编码',
              key: 'iconCode'
            }, {
              title: "排序",
              sortable: true,
              key: "seq"
            },{
              title: "是否绑定客户所在城市",
              key: "isBindCity"
            }, {
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
            },{
              title: "备注",
              key: "remark"
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
            if(obj == 'typeTableCodeVal' || obj == 'iconCodeVal') {

            } else {
              this.formAddOrUpdate[obj] = newValue[0][obj]
            }
          }
        } else {
          this.resetForm();
        }
      },
      "tagList" (newValue, oldValue) {
        if(newValue.length > 0) {
          this.formAddOrUpdate.tTagId = newValue[0].id;
        } else {
          this.formAddOrUpdate.tTagId = '';
        }
      },
      "formAddOrUpdate.typeTableCode" (newValue, oldValue) {
        if(newValue == 'T_TAG') {
          this.formAddOrUpdate.tTagId = '';
        }
      }
    },
    mounted() {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get('biz/MenuConfig/list',
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
        this.$http.post('biz/MenuConfig/saveOrUpdate',
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
          }).catch(this.formStatus = false);
      },
      resetForm() {
        for (let obj in this.formAddOrUpdate) {
          if(obj == 'typeTableCodeVal' || obj == 'iconCodeVal') {

          } else if (obj == 'isBindCity') {
            this.formAddOrUpdate[obj] = false
          } else if (obj == 'tTagId') {
            this.formAddOrUpdate[obj] = ''
          } else {
            this.formAddOrUpdate[obj] = ''
          }
          this.formAddOrUpdate.typeCode = 'V001'
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
          this.$http.post('biz/MenuConfig/remove',
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

  $menuIconW: 30px;

  .menu-icon {
    position: relative;
    height: $menuIconW;
    padding-left: $menuIconW;
    background: no-repeat;
    background-position: center left;
    background-size: auto 60%;
  }

  @for $i from 1 through 12 {
    .menu-icon-#{$i} {
      background-image: url("~@/assets/img/menu-icon/menu-icon-#{$i}.png");
    }
  }
</style>
