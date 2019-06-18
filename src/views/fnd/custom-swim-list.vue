<!--
  定制游列表
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
              <el-input clearable v-model="tableList.query.search" placeholder="内容名称检索"></el-input>
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
            <!--<el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key" v-for="item in tableList.columns" :key="item.key"  :show-overflow-tooltip="true">
            </el-table-column>-->
            <template v-for="item in tableList.columns">
              <el-table-column v-if="item.key == 'adultNumber'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key" >
                <template slot-scope="scope">
                  <p>成人： {{ scope.row.adultNumber}}</p>
                  <p>儿童： {{ scope.row.childrenNumber}}</p>
                  <p>婴儿： {{ scope.row.babyNumber}}</p>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'perCapita'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <span>{{ scope.row.perCapitaMinCost }} 元~ {{ scope.row.perCapitaMaxCost }} 元</span>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'custDomain'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <p v-if="scope.row.custDomain">姓名：{{ scope.row.custDomain.realName || "暂无数据" }}</p>
                  <p v-if="scope.row.custDomain">手机号：{{ scope.row.custDomain.mobile || "暂无数据"}}</p>
                  <p v-if="scope.row.custDomain">邮箱：{{ scope.row.custDomain.email || "暂无数据"}}</p>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'departureCityName'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <p>{{ scope.row.departureCityName }} {{ scope.row.departureCityAreaName }}</p>
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
  </div>
</template>

<script type="text/babel">
  import {mapState} from 'vuex'

  import zzuMap from '@/components/map'
  import zzuUdc from '@/components/udc'
  import zzuCitySelect from '@/components/city-select'

  export default {
    name: "userList",
    components: {
      zzuMap, zzuUdc, zzuCitySelect
    },
    data() {
      return {
        timePicker: '',
        cfg: {
          formTitle: '添加内容',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formSearch: {
          title: "",
          typeId: ''
        },
        tableList: {
          title: "定制游列表",
          query: {
            search: '', // 内容名称， 模糊查询
            pageNum: 1, // 第几页
            pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
            sort: 'id', // 主表字段名称
            order: 'desc' // 正序还是倒序
          },
          selection: [],
          loading: false,
          columns: [
            {
            //   type: 'selection',
            //   width: 60,
            //   key: 'id',
            //   align: 'center',
            //   fixed: 'left'
            // }, {
              title: '定制类型',
              key: 'defTypeCodeDesc',
              fixed: 'left'
            },{
              title: '出发地',
              key: 'departureCityName'
            },{
              title: '目的地',
              key: 'targetCityName'
            },{
              title: '游玩天数',
              key: 'daysOfPlay',
            },{
              title: '出游人数',
              key: 'adultNumber',
            },{
              title: '预算',
              width: 220,
              key: 'perCapita',
            },{
              title: '联系人',
              width: 260,
              key: 'custDomain',
            },{
              title: '其他需求',
              width: 360,
              key: 'requirement',
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
        formAddOrUpdate: {
          id: '',
          title: ''
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
            this.formAddOrUpdate[obj] = newValue[0][obj]
          }
        } else {
          for (let obj in this.formAddOrUpdate) {
            this.formAddOrUpdate[obj] = ''
          }
        }
      }
    },
    mounted () {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get(`sundrytravel/PlanTravel/list`,
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
      addData () {
        this.$router.push({name: 'fndContentAddOrUpdate' })
      },
      updateData () {
        this.$confirm(`此操作将只能编辑右侧显示角色${this.formAddOrUpdate.title}的详情, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({name: 'fndContentAddOrUpdate', query: { id: this.formAddOrUpdate.id }})
        })
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
          this.$http.post('biz/Content/remove',
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


</style>
