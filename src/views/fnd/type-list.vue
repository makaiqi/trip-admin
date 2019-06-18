<!--
  type类型共信息维护
 -->
<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">类型信息</span>
        </div>
        <div class="base-block-container">
          <el-form ref="formSearch" :inline="true">
            <el-form-item prop="name">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="type.search">
              </el-input>
            </el-form-item>
            <el-form-item prop="name">
            	<zzu-udc v-model="typeData.value" :udc-code="typeData.udcCode" placeholder="请选择类型"></zzu-udc>
          	</el-form-item>
          </el-form>

          <el-tree
            node-key="id"
            ref="tree"
            :data="type.list"
            highlight-current
            :filter-node-method="typeFilter"
            :expand-on-click-node="false"
            @node-drag-start="handleDragStart"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            :props="type.defaultProps">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.typeName }}</span>
              <div class="type-tree-btns">
                <el-button
                  type="text"
                  size="mini"
                  class="el-icon-plus"
                  @click="() => typeAdd(node, data)">
                </el-button>
                <el-button
                  v-if="data.id != -1"
                  type="text"
                  size="mini"
                  class="el-icon-edit"
                  @click="() => typeEdit(node, data)">
                </el-button>
                <el-button
                  v-if="data.id != -1"
                  type="text"
                  size="mini"
                  class="el-icon-delete"
                  @click="() => typeDelete(node, data)">
                </el-button>
              </div>
            </div>
          </el-tree>

          <el-dialog title="类型信息" :visible.sync="formAddOrUpdateConfig.dialogFormVisible">
            <el-form ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate">
              <el-form-item label="类型名称" :label-width="formAddOrUpdateConfig.formLabelWidth">
                <el-input clearable v-model="formAddOrUpdate.typeName" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="formAddOrUpdateConfig.dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="typeSubmit('formAddOrUpdate')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
  import {mapState} from 'vuex'
  import zzuUdc from '@/components/udc'

  export default {
    name: "userList",
    components: {
    	zzuUdc
    },
    data() {
      return {
      	typeData: {
      		value: '',
      		udcCode: 'UDC_M03_T12'
      	},
        type: {
          search: '',
          list: [
            {
              parentId: '',
              id: -1,
              level: -1,
              typeName: '类型',
              pid: '',
              children: []
            }
          ],
          lastId: 100,
          defaultProps: {
            label: 'typeName',
            children: 'children',
            isLeaf: 'leaf'
          }
        },
        formAddOrUpdate: {
          parentId: '',
          id: '',
          typeName: '',
          typeCode: ''
        },
        ruleAddOrUpdate: {
          typeName: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ]
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
      'type.search'(newValue) {
        this.$refs.tree.filter(newValue);
        this.getCityByFirstLetter(newValue)
      },
      'formAddOrUpdateConfig.dialogFormVisible'(newValue) {
        if (!newValue) {
          this.formAddOrUpdate = {
            parentId: '',
            id: '',
            typeName: ''
          };
        }
      },
      'typeData.value' (newValue, oldValue) {
      	this.typeLoad();
      }
    },
    mounted() {
      this.typeLoad();
    },
    methods: {
      typeLoad () {
        // 获取类型信息
        this.$http.get('biz/Type/list',
            {
              params: {
              	typeCode: this.typeData.value,
                paging: false
              }
            }
          ).then(rs => {
          if(rs.data.code == 0) {
            let transData = rs.data.data.map((item, index) => {
              return Object.assign({children: []}, item)
            });
            this.type.list[0].children = transData;
            console.log(this.type.list)
          } else {
            this.type.list[0].children = [];
          }
        }).catch();
      },
      typeAdd(node, data) {
        // 增加类型
        if(!this.typeData.value) {
        	this.$message({
            type: 'error',
            message: '请选择类型'
          });
        	return false
        }
        this.formAddOrUpdateConfig.data = data;
        this.formAddOrUpdateConfig.node = node;
        this.formAddOrUpdateConfig.status = 'add';
        this.formAddOrUpdateConfig.dialogFormVisible = true;
        console.log(data.level)
        if(data.level == -1) {
          this.formAddOrUpdate.parentId = '';
        } else {
          this.formAddOrUpdate.parentId = data.id;
        }
      },
      typeEdit(node, data) {
        // 编辑类型
        this.formAddOrUpdateConfig.data = data;
        this.formAddOrUpdateConfig.status = 'edit';
        this.formAddOrUpdate = {
          parentId: data.parentId,
          id: data.id,
          typeName: data.typeName,
          typeCode: this.typeData.value
        };
        this.formAddOrUpdateConfig.dialogFormVisible = true;
      },
      typeSubmit(formName) {
        // 类型表单提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.typeSaveOrUpdate(this.formAddOrUpdateConfig.data, this.formAddOrUpdate);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      typeSaveOrUpdate(data, formAddOrUpdate) {
        // 更新或保存类型信息
        let node = this.formAddOrUpdateConfig.node;

  			formAddOrUpdate.typeCode = this.typeData.value;

        this.$http.post('biz/Type/saveOrUpdate',
          formAddOrUpdate
          ).then(rs => {
            let msg = this.formAddOrUpdateConfig.status == 'add' ? "添加" : "修改";
            if(rs.data.code == 0) {
              if(this.formAddOrUpdateConfig.status == 'add') {
                // const newChild =  Object.assign(formAddOrUpdate, {id: rs.data.data, children: []});
                // if (!data.children) {
                //   this.$set(data, 'children', []);
                // }
                // data.children.push(newChild);
                this.typeLoad();
              } else {
                data.typeName = formAddOrUpdate.typeName;
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
      typeDelete(node, data) {
        // 删除类型
        this.$confirm(`此操作将永久删除${ data.typeName }及其子类型, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.typeDeleteNode(node, data);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      typeDeleteNode (node, data) {
        // 接口删除类型信息
        this.$http.post('biz/Type/remove',
          {
            parentId: data.id
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
      typeFilter(value, data) {
        // 类型筛选
        if (!value) return true;
        return data.typeName.indexOf(value) !== -1;
      },
      handleDragStart () {

      },
      handleDragEnd () {

      },
      handleDrop () {

      }
    }
  }
</script>

<style lang="scss">
  @import "~@/assets/css/core/vars";
  @import '~@/assets/css/base-block';

  .type-tree-btns {
    padding-left: 40px;
    display: inline-block;
  }
</style>
