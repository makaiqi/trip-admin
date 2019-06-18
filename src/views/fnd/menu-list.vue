<!--
  菜单信息维护
 -->

<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">菜单信息</span>
        </div>
        <div class="base-block-container">
          <el-form ref="formSearch" :inline="true">
            <el-form-item prop="name">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="menu.search">
              </el-input>
            </el-form-item>
          </el-form>

          <el-tree
            node-key="id"
            ref="tree"
            :data="menu.list"
            highlight-current
            draggable
            :filter-node-method="menuFilter"
            :expand-on-click-node="false"
            :props="menu.defaultProps">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.menuName }}</span>
              <div class="menu-tree-btns">
                <el-button
                  type="text"
                  size="mini"
                  class="el-icon-plus"
                  @click="() => menuAdd(node, data)">
                </el-button>
                <el-button
                  v-if="data.id != -1"
                  type="text"
                  size="mini"
                  class="el-icon-edit"
                  @click="() => menuEdit(node, data)">
                </el-button>
                <el-button
                  v-if="data.id != -1"
                  type="text"
                  size="mini"
                  class="el-icon-delete"
                  @click="() => menuDelete(node, data)">
                </el-button>
              </div>
            </div>
          </el-tree>

          <el-dialog title="菜单信息" :visible.sync="formAddOrUpdateConfig.dialogFormVisible">
            <el-form label-position="top" ref="formAddOrUpdate" :label-width="formAddOrUpdateConfig.formLabelWidth" :model="formAddOrUpdate" :rules="ruleAddOrUpdate">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input clearable v-model="formAddOrUpdate.menuName" auto-complete="off"></el-input>
              </el-form-item>
              <!-- <el-form-item label="菜单类型" prop="menuName">
                <el-input clearable v-model="formAddOrUpdate.menuType" auto-complete="off"></el-input>
                <zzu-udc v-model="formAddOrUpdate.menuType" :udc-code="formAddOrUpdate.menuNo" placeholder="请选择菜单类型"></zzu-udc>
              </el-form-item> -->
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
              <el-form-item label="CSS类名" prop="cssClass">
                <el-input clearable v-model="formAddOrUpdate.cssClass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单编号" prop="menuNo">
                <el-input clearable v-model="formAddOrUpdate.menuNo" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="formAddOrUpdateConfig.dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="menuSubmit('formAddOrUpdate')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
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
        citySelect: {
          value: "",
          list: [],
          timeout: null
        },
        menu: {
          search: '',
          list: [
            {
              pid: '',
              id: -1,
              level: -1,
              menuType: "q",
              menuName: '菜单',
              icon: "menu",
              url: "quyu",
              remark: '',
              cssClass:'',
              menuNo:'',
              seq:'',
              children: []
            }
          ],
          lastId: 100,
          defaultProps: {
            label: 'name',
            children: 'children',
            isLeaf: 'leaf'
          }
        },
        formAddOrUpdate: {
          pid: '',
          id: '',
          level: '',
          menuName: '',
          menuNo: 'UDC_M04_T24',
          menuType: '',
          icon: '',
          url: '',
          remark: '',
          cssClass:'',
          menuTypeCode:'V001',
          menuNo:'',
          seq:'',
          isButton: false
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
        },
        formAddOrUpdateConfig: {
          data: {},
          node: {},
          status: "",
          dialogFormVisible: false,
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
      'menu.search'(newValue) {
        this.$refs.tree.filter(newValue);
      },
      'formAddOrUpdateConfig.dialogFormVisible'(newValue) {
        if (!newValue) {
          this.formAddOrUpdate = {
            pid: '',
            id: '',
            level: '',
            menuName: '',
            menuNo: this.formAddOrUpdate.menuNo,
            menuType: '',
            icon: '',
            url: '',
            remark: '',
            cssClass:'',
            menuNo:'',
            seq:'',
            isButton: false
          };
        }
      },
      'citySelect.value' (newValue, oldValue) {
        let data = this.getCityContain(newValue)

        data.then(function(ResultJson){
          // console.log(ResultJson)
            //通过拿到的数据渲染页面
        }).catch(function(ErrMsg){
          // console.log(ErrMsg)
            //获取数据失败时的处理逻辑
        })
      }
    },
    mounted() {
      this.menuLoad();
    },
    methods: {
      menuLoad() {
        this.$http.get('arch/Menu/list',
          {
            params: {
              userId: 1
            }
          }).then(rs => {
            if(rs.data.code == 0) {
              if(rs.data.data.length > 0) {
                let transData = rs.data.data.map((item, index) => {
                  return Object.assign({children: []}, item)
                });
                this.menu.list[0].children = transData;
              } else {
                this.menu.list[0].children = [];
              }
            }
          }).catch();
      },
      menuAdd(node, data) {
        // 增加菜单
        this.formAddOrUpdateConfig.data = data;
        this.formAddOrUpdateConfig.node = node;
        this.formAddOrUpdateConfig.status = 'add';
        this.formAddOrUpdateConfig.dialogFormVisible = true;

        console.log(data.level)
        if(data.level == -1) {
          this.formAddOrUpdate.level = 0;
          this.formAddOrUpdate.pid = '';
        } else {
          this.formAddOrUpdate.level = data.level + 1;
          this.formAddOrUpdate.pid = data.id;
        }
      },
      menuEdit(node, data) {
        // 编辑菜单
        this.formAddOrUpdateConfig.data = data;
        this.formAddOrUpdateConfig.status = 'edit';
        this.formAddOrUpdate = {
          pid: data.pid,
          id: data.id,
          level: data.level,
          menuName: data.menuName,
          // menuNo: this.formAddOrUpdate.menuNo,
          menuType: data.menuType,
          icon: data.icon,
          url: data.url,
          remark: data.remark,
          cssClass:data.cssClass,
          menuNo:data.menuNo,
          seq:data.seq,
          isButton: false
        };
        this.formAddOrUpdateConfig.dialogFormVisible = true;
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
      menuSaveOrUpdate(data, formAddOrUpdate) {
        // 更新或保存菜单信息
        let node = this.formAddOrUpdateConfig.node;

        this.$http.post('arch/Menu/saveOrUpdate',
          formAddOrUpdate
          ).then(rs => {
            let msg = this.formAddOrUpdateConfig.status == 'add' ? "添加" : "修改";
            if(rs.data.code == 0) {
              if(this.formAddOrUpdateConfig.status == 'add') {
                // const newChild =  Object.assign(formAddOrUpdate, {id: rs.data.data, children: []});
                // if (!data.children) {
                //   this.$set(data, 'children', []);
                // }
                // data.isLeaf = false;
                // data.children.push(newChild);

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
            } else {
              this.$message({
                type: 'success',
                message: msg + '失败!'
              });
            }
            this.formAddOrUpdateConfig.dialogFormVisible = false;
          }).catch(this.formAddOrUpdateConfig.dialogFormVisible = false);
      },
      menuDelete(node, data) {
        // 删除菜单
        this.$confirm(`此操作将永久删除${ data.menuName }及其子菜单, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.menuDeleteNode(node, data);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      menuDeleteNode (node, data) {
        // 接口删除菜单信息
        this.$http.post('arch/Menu/remove',
          {
            id: data.id
          }).then(rs => {
            if(rs.data.code == 0) {
              // debugger
              let parent = node.parent,
                  children = parent.childNodes || parent.data,
                  index = children.findIndex(d => d.id === node.id);
              children.splice(index, 1);
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
      },
      menuFilter(value, data) {
        // 菜单筛选
        if (!value) return true;
        return data.menuName.indexOf(value) !== -1;
      }
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
