<!--
  基础区域信息维护
 -->
<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">区域信息</span>
        </div>
        <div class="base-block-container">
          <el-form ref="formSearch" :inline="true">
            <el-form-item prop="name">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="area.search">
              </el-input>
            </el-form-item>

            <el-form-item prop="cityName">
              <zzu-city-select placeholder="请选择城市" v-model="citySelect.value"></zzu-city-select>
            </el-form-item>
          </el-form>

          <el-tree
            node-key="id"
            ref="tree"
            :data="area.list"
            highlight-current
            :filter-node-method="areaFilter"
            :expand-on-click-node="false"
            @node-drag-start="handleDragStart"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            :props="area.defaultProps">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <div class="area-tree-btns">
                <el-button
                  type="text"
                  size="mini"
                  class="el-icon-plus"
                  @click="() => areaAdd(node, data)">
                </el-button>
                <el-button
                  v-if="data.id != -1"
                  type="text"
                  size="mini"
                  class="el-icon-edit"
                  @click="() => areaEdit(node, data)">
                </el-button>
                <el-button
                  v-if="data.id != -1"
                  type="text"
                  size="mini"
                  class="el-icon-delete"
                  @click="() => areaDelete(node, data)">
                </el-button>
              </div>
            </div>
          </el-tree>

          <el-dialog title="区域信息" :visible.sync="formAddOrUpdateConfig.dialogFormVisible">
            <el-form ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate">
              <el-form-item label="区域名称" :label-width="formAddOrUpdateConfig.formLabelWidth">
                <el-input clearable v-model="formAddOrUpdate.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="首字母" :label-width="formAddOrUpdateConfig.formLabelWidth">
                <el-input clearable v-model="formAddOrUpdate.firstLetter" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="formAddOrUpdateConfig.dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="areaSubmit('formAddOrUpdate')">确 定</el-button>
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

  export default {
    name: "userList",
    components: {
      zzuCitySelect
    },
    data() {
      return {
        citySelect: {
          value: "",
          list: [],
          timeout: null
        },
        area: {
          search: '',
          list: [
            {
              parentId: '',
              id: -1,
              level: -1,
              firstLetter: "q",
              name: '区域',
              nameEn: "area",
              namePinyin: "quyu",
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
          parentId: '',
          id: '',
          level: '',
          name: '',
          firstLetter: '',
          nameEn: '',
          namePinYin: ''
        },
        ruleAddOrUpdate: {
          name: [
            { required: true, message: '请输入城市名称', trigger: 'blur' }
          ],
          firstLetter: [
            { required: true, message: '请输入首字母', trigger: 'blur' }
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
      'area.search'(newValue) {
        this.$refs.tree.filter(newValue);
        this.getCityByFirstLetter(newValue)
      },
      'formAddOrUpdateConfig.dialogFormVisible'(newValue) {
        if (!newValue) {
          this.formAddOrUpdate = {
            parentId: '',
            id: '',
            level: '',
            name: '',
            firstLetter: '',
            nameEn: '',
            namePinYin: ''
          };
        }
      },
      'citySelect.value' (newValue, oldValue) {
        let data = this.getCityContain(newValue);

        data.then(function(ResultJson){
          console.log(111, ResultJson)
        }).catch(function(ErrMsg){
          console.log(22, ErrMsg)
        })
      }
    },
    mounted() {
      this.areaLoad();
    },
    methods: {
      areaLoad () {
        // 获取区域信息
        this.$http.get('fund/Area/allArea',
            {
              params: {
                paging: false
              }
            }
          ).then(rs => {
          if(rs.data.code == 0) {
            let transData = rs.data.data.map((item, index) => {
              return Object.assign({children: []}, item)
            });
            this.area.list[0].children = transData;
            console.log(this.area.list)
          } else {
            this.area.list[0].children = [];
          }
        }).catch();
      },
      areaAdd(node, data) {
        // 增加区域
        this.formAddOrUpdateConfig.data = data;
        this.formAddOrUpdateConfig.node = node;
        this.formAddOrUpdateConfig.status = 'add';
        this.formAddOrUpdateConfig.dialogFormVisible = true;
        console.log(data.level)
        if(data.level == -1) {
          this.formAddOrUpdate.level = 0;
          this.formAddOrUpdate.parentId = '';
        } else {
          this.formAddOrUpdate.level = data.level + 1;
          this.formAddOrUpdate.parentId = data.id;
        }
      },
      areaEdit(node, data) {
        // 编辑区域
        this.formAddOrUpdateConfig.data = data;
        this.formAddOrUpdateConfig.status = 'edit';
        this.formAddOrUpdate = {
          parentId: data.parentId,
          id: data.id,
          level: data.level,
          name: data.name,
          firstLetter: data.firstLetter,
          nameEn: data.nameEn,
          namePinYin: data.namePinYin
        };
        this.formAddOrUpdateConfig.dialogFormVisible = true;
      },
      areaSubmit(formName) {
        // 区域表单提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.areaSaveOrUpdate(this.formAddOrUpdateConfig.data, this.formAddOrUpdate);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      areaSaveOrUpdate(data, formAddOrUpdate) {
        // 更新或保存区域信息
        let node = this.formAddOrUpdateConfig.node;

        this.$http.post('fund/Area/saveOrUpdate',
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
                this.areaLoad();
              } else {
                data.name = formAddOrUpdate.name;
                data.firstLetter = formAddOrUpdate.firstLetter;
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
      areaDelete(node, data) {
        // 删除区域
        this.$confirm(`此操作将永久删除${ data.name }及其子区域, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.areaDeleteNode(node, data);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      areaDeleteNode (node, data) {
        // 接口删除区域信息
        this.$http.post('fund/Area/remove',
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
      areaFilter(value, data) {
        // 区域筛选
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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

  .area-tree-btns {
    padding-left: 40px;
    display: inline-block;
  }
</style>
