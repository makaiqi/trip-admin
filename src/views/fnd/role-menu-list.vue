<!--
  角色菜单权限信息维护
 -->

<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">角色菜单权限信息：{{ role.roleName }}</span>
        </div>
        <div class="base-block-container">
          <el-form ref="formSearch" :inline="true">
            <el-form-item prop="name">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="menu.search">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-setting" @click="setChecked">设置菜单</el-button>
            </el-form-item>
          </el-form>

          <el-tree
            node-key="id"
            ref="tree"
            :data="menu.list"
            highlight-current
            show-checkbox
            :default-checked-keys="[76]"
            :filter-node-method="menuFilter"
            :expand-on-click-node="false"
            :props="menu.defaultProps">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.menuName }}</span>
            </div>
          </el-tree>
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
        role: {
          id: this.$route.params.id,
          roleName: '',
          menuList: [76],
          roleList: [76]
        },
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
              children: []
            }
          ],
          checked: [],
          defaultProps: {
            label: 'menuName',
            children: 'children',
            isLeaf: 'leaf'
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
      'menu.search'(newValue) {
        this.$refs.tree.filter(newValue);
      }
      // 'menu.list': {
      //   handler: function (val, oldVal) {
      //     this.menu.checked = [-1, 76, 77, 78, 79];
      //     console.log(val, this.menu.checked)
      //   },
      //   deep: true
      // }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData () {
        this.menuLoad();
      },
      getRoleInfo (id) {
        this.$http.get(`arch/Role/findById`,
          {
            params: {
              id: id
            }
          }).then(rs => {
            if(rs.data.code == 0) {
              console.log(rs.data.data)
              rs.data.data.menuDomainList.forEach(item => {
                this.role.menuList.push(item.id)
              })
              this.$refs.tree.setCheckedKeys(this.role.menuList);
              this.role = rs.data.data;
            } else {
              this.$refs.tree.setCheckedKeys([]);
            }
          })
      },
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
                this.getRoleInfo(this.role.id);
              } else {
                this.menu.list[0].children = [];
                this.$refs.tree.setCheckedKeys([]);
              }
            }
          }).catch();
      },
      menuFilter(value, data) {
        // 菜单筛选
        if (!value) return true;
        return data.menuName.indexOf(value) !== -1;
      },
      setChecked () {
        let menuIdList = this.$refs.tree.getCheckedKeys();
        let menuIdNodeList = this.$refs.tree.getHalfCheckedKeys();
        let menuIdLists = menuIdList.concat(menuIdNodeList)
        let menuId = []
        menuIdLists.forEach((item) => {
          if(item > 0) menuId.push(item)
        })
        this.$confirm(`此操作将设置当前角色${ this.role.roleName }的菜单权限, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(`arch/Role/saveMenu`,
            {
              roleId: this.role.id,
              menuIdList
            }
          ).then(rs => {
            if(rs.data.code == 0) {
              this.$message({
                type: 'info',
                message: rs.data.msg
              });
              this.$router.push({name:"fndRoleList"})
            } else {

            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          });
        });
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
