<!--
  角色菜单权限信息维护
 -->

<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-button @click="getCheckedNodes" type="primary" style="position:fixed;right:50px;top:80px">确定</el-button>
      <el-card>
        <div class="base-block-container">
          <el-tree
            node-key="id"
            ref="tree"
            :data="menu.list"
            highlight-current
            show-checkbox
            :expand-on-click-node="false"
            :props="menu.defaultProps">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
            </div>
          </el-tree>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
  import zzuCitySelect from '@/components/city-select'
  import zzuUdc from '@/components/udc'

  export default {
    name: "userList",
    components: {
      zzuCitySelect, zzuUdc
    },
    props: {
      cityList: {
        type: Array
      }
    },
    data() {
      return {
        cityLists: [],
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
              name: '中国',
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
    },
    watch: {
      cityList(newVal) {
        this.cityLists = newVal
      },
      cityLists (newVal) {
        this.$refs.tree.setCheckedKeys(newVal)
      }
    },
    created() {
      this.menuLoad();
    },
    methods: {
      menuLoad() {
        this.$http.get('fund/Area/queryByRecursive',
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
      getCheckedNodes () {
        var val = this.$refs.tree.getCheckedNodes()
        this.$emit('cityVal', val)
        this.$emit('dialogFormVisible3')
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
