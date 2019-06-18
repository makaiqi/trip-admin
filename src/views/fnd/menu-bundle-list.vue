<!--
  菜单范围
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
              <el-input clearable v-model="tableList.query.search" placeholder="请输入关键字"></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-input clearable v-model="tableList.query.menuNo" placeholder="请输入菜单编号"></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="menuDelete">删除</el-button>
            </el-form-item>
          </el-form>
          <el-table ref="multipleTable" :data="tableList.data.rows" tooltip-effect="dark" style="width: 100%" class="base-block-table" border stripe @selection-change="handleSelectionChange">
           <template v-for="(item,index) in tableList.columns">
            <el-table-column :label="item.title" :prop="item.key" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :key="index"  :show-overflow-tooltip="true">
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
          <el-form label-position="top" ref="formAddOrUpdate" :label-width="formAddOrUpdateConfig.formLabelWidth" :model="formAddOrUpdate" :rules="ruleAddOrUpdate">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input clearable v-model="formAddOrUpdate.menuName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单编号" prop="menuNo">
                <el-input clearable v-model="formAddOrUpdate.menuNo" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="url地址" prop="url">
                <el-input clearable v-model="formAddOrUpdate.url" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                <el-input clearable v-model="formAddOrUpdate.icon" auto-complete="off"></el-input> 
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input clearable v-model="formAddOrUpdate.remark" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单排序" prop="seq">
                <el-input clearable v-model="formAddOrUpdate.seq" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="css类" prop="cssClass">
                <el-select v-model="formAddOrUpdate.cssClass" placeholder="请选择css类" clearable>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="menuSubmit('formAddOrUpdate')">保存</el-button>
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
    name: "fndMenuBundleList",
    components: {
      zzuCitySelect, zzuUdc 
    },
    data() {
      return {
        options: [
        {
          value: "dingwei", 
          label: "定位"
        },
        {
          value: "gouwu",
          label: "购物"
        },
        {
          value:"tingche",
          label: "停车"
        },
        {
          value: "weishengjian",
          label: "卫生间"
        },
        {
          value: "xiuxishi",
          label: "休息室"
        },
        {
          value: "yinshi",
          label: "饮食"
        },
        {
          value:"youlejingdian",
          label:"游乐景点"
        }
      ],
        tableList: {
          title: "菜单范围列表",
          query: {
            pageNum: 1, // 第几页
            pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
            sort: 'id', // 主表字段名称
            order: 'desc', // 正序还是倒序
            search: '',
            menuTypeCode:'V002',
          },
          selection: [],
          data: {
            total: 0,
            rows: []
          },
          columns: [
            {
              type: 'selection',
              width: 35,
              key: 'id',
              align: 'center',
              fixed: 'left'
            }, {
              title: '菜单名称',
              key: 'menuName',
              fixed: 'left',
              width: 200,
              sortable: true
            },
             {
              title: '菜单编号',
              key: 'menuNo',
              width: 200,
              sortable: true
            },
             {
              title: ' url地址',
              key: 'url',
              width: 200,
              sortable: true
            },
             {
              title: '图标',
              key: 'icon',
              width: 100,
              sortable: true
            },
             {
              title: '备注',
              key: 'remark',
              width: 250,
              sortable: true
            },
             {
              title: '菜单排序',
              key: 'seq',
              sortable: true,
              width: 100,
            },
            {
              title: 'CSS类名',
              key: 'cssClass',
              width: 100,
              sortable: true
            },
           
            
          ],
          
        },
        formAddOrUpdate: {
          pid: '',
          id: '',
          level: '1',
          menuName: '',
          menuNo: '',
          menuType: '',
          menuTypeCode:'V002',
          icon: '',
          url: '',
          remark: '',
          cssClass:'',
          seq:'',
        },
        ruleAddOrUpdate: {
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          menuType: [
            { required: true, message: '请输入首字母', trigger: 'blur' }
          ],
          seq: [
            { required: true, message: '请输入菜单编号', trigger: 'blur' }
          ],
          cssClass:[
            {required: true, message: '请选择css类', trigger: 'blur'  }
          ]
        },
        formAddOrUpdateConfig: {
          data: {},
          status: "",
          formLabelWidth: '80px'
        }
      }
    },
    computed: {
      ...mapState({
        page: state => state.page
      })
    },
    watch: {
     'tableList.query': {
        handler (newValue, oldValue) {
          this.menuLoad();
        },
        deep: true
      },
      'tableList.selection'(newValue, oldValue) {
        if (newValue.length > 0) {
          for (let obj in this.formAddOrUpdate) {
              this.formAddOrUpdate[obj] = newValue[0][obj]
          }
          // this.formAddOrUpdate= newValue[0];
        } else {
          this.resetForm();
        }
      },
    },
    mounted() {
      this.menuLoad();
    },
    methods: {
      menuLoad() {
        this.$http.get('arch/Menu/list',
          {params:this.tableList.query}
          ).then(rs => {
            if(rs.data.code == 0) {
              this.tableList.data.rows = rs.data.data;
            }else{
              this.tableList.data.rows = [];
            }
            // this.resetForm();
          }).catch();
      },
      menuSubmit(formName) {
        // 菜单表单提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.menuSaveOrUpdate(this.formAddOrUpdateConfig.data, this.formAddOrUpdate);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(){
        // this.formAddOrUpdate={};
        let formAddOrUpdate = {};
        for (let obj in this.formAddOrUpdate) {
          if(obj == 'level'){
            formAddOrUpdate[obj] = '1';
          }else if(obj == 'menuTypeCode'){
            formAddOrUpdate[obj] = 'V002';
          }else{
             formAddOrUpdate[obj] = ''
          }
        }
        this.formAddOrUpdate = formAddOrUpdate;
      },
      menuSaveOrUpdate(data, formAddOrUpdate) {
        // 更新或保存菜单信息
        this.$http.post('arch/Menu/saveOrUpdate',
          formAddOrUpdate
          ).then(rs => {
            let msg = this.formAddOrUpdateConfig.status == 'add' ? "添加" : "保存";
            if(rs.data.code == 0) {
              if(this.formAddOrUpdateConfig.status == 'add') {
                this.menuLoad();
              } else {
                data.menuName = formAddOrUpdate.menuName;
                data.menuType = formAddOrUpdate.menuType;
                data.url = formAddOrUpdate.url;
                data.remark = formAddOrUpdate.remark;
                data.icon = formAddOrUpdate.icon;
                data.cssClass = formAddOrUpdate.cssClass;
                data.seq = formAddOrUpdate.seq;
                data.menuNo = formAddOrUpdate.menuNo;
              }
              this.$message({
                type: 'success',
                message: msg + '成功!'
              });
              this.menuLoad();
              this.resetForm();
            } else {
              this.$message({
                type: 'success',
                message: msg + '失败!'
              });
            }
            this.formAddOrUpdateConfig.dialogFormVisible = false;
          }).catch(this.formAddOrUpdateConfig.dialogFormVisible = false);
      },
      menuDelete() {
        let idList = [];
        this.tableList.selection.map(item => {
          idList.push(item.id)
        })
        // console.log(idList,'111111');return;
        // 删除UDC
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('arch/Menu/removeMenu',
            idList
          ).then(rs => {
            if(rs.data.code == 0) {
              this.menuLoad();
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
      handlePageSizeChange(val) {
        this.tableList.query.pageSize = val;
      },
      handlePageCurrentChange(val) {
        this.tableList.query.pageNum = val;
      },
      handleSelectionChange(val) {
        // console.log(val,'333')
        this.tableList.selection = val.sort(function (a, b) {
          return a.id > b.id;
        });
      },
      
    }
  }
</script>

<style lang="scss">
  @import "~@/assets/css/core/vars";
  @import '~@/assets/css/base-block';

  .menu-tree-btns {
    padding-left: 40px;
    display: inline-block;
  }
</style>
