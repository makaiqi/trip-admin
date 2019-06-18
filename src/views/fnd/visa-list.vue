<!--
	签证信息增删改查
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
              <el-input clearable v-model="tableList.query.search" placeholder="根据标题/套餐名称搜索"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button icon="el-icon-add" @click="addData">新增</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="updateData">编辑</el-button>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除</el-button>
            </el-form-item>
          </el-form>

          <el-table
            ref="multipleTable"
            :data="tableList.data.rows"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            class="base-block-table">

            <el-table-column  type="expand">
              <template slot-scope="scope">
                <h3>套餐</h3>
                <el-table border :data="scope.row.comboDomains" style="width: 100%">
                  <el-table-column prop="comboTitle" label="套餐标题"></el-table-column>
                  <el-table-column prop="price" label="价格"></el-table-column>
                  <el-table-column prop="expirationDate" label="有效期限"></el-table-column>
                  <el-table-column prop="longestStay" label="最长停留"></el-table-column>
                  <el-table-column prop="numberOfEntry" label="入境次数"></el-table-column>
                  <el-table-column prop="handlingTime" label="办理时间"></el-table-column>
                  <el-table-column prop="visaComboCodeDesc" label="签证次数"></el-table-column>
                  <el-table-column prop="isInterview" label="是否面试">
                    <template slot-scope="prop">
                      {{ prop.row.isInterview ? "是" : "否" }}
                    </template>
                  </el-table-column>
                </el-table>

                <h3>流程须知</h3>
                <el-table border :data="scope.row.processNodeDomains" style="width: 100%">
                  <el-table-column prop="title" label="标题"></el-table-column>
                  <el-table-column prop="summary" label="描述内容"></el-table-column>
                  <el-table-column prop="seq" label="排序"></el-table-column>
                </el-table>
              </template>
            </el-table-column>

            <template v-for="item in tableList.columns">

              <el-table-column v-if="item.key == 'barImageTAssetId'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <el-button @click="showPreviewer(scope.row.barImageTAssetUrl)" class="ad-img">点击查看图片</el-button>
                </template>
              </el-table-column>

              <el-table-column v-else-if="item.key == 'tAssetId'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <el-button @click="showPreviewer(scope.row.tassetUrl)" class="ad-img">点击查看图片</el-button>
                </template>
              </el-table-column>
              <el-table-column v-else :type="item.type" :fixed="item.fixed" :width="item.width" :label="item.title" :sortable="item.sortable" :prop="item.key" :show-overflow-tooltip="true">
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
    <el-dialog :visible.sync="previewer.visible">
      <img style="width: 100%" :src="previewer.img">
    </el-dialog>

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
        previewer: {
          img: '',
          visible: false
        },
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
          title: "签证列表",
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
              type: 'selection',
              width: 35,
              key: 'id',
              align: 'center',
              // fixed: 'left'
            }, {
              title: '标题',
              key: 'visaTitle',
              // fixed: 'left',
              sortable: true,
              width: 150
            },{
              title: '国家',
              key: 'countryName',
              width: 120
            },{
              title: '预定须知',
              key: 'reservationNode',
            },{
              title: '主图',
              key: 'tAssetId',
            },{
              title: '详情页主图',
              key: 'barImageTAssetId',
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
          visaTitle: ''
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
        this.$http.get(`sundrytravel/Inst/list`,
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
        this.$router.push({name: 'fndVisaAddOrUpdate' })
      },
      updateData () {
        this.$confirm(`此操作将只能操作“${this.formAddOrUpdate.visaTitle}”的详情, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({name: 'fndVisaAddOrUpdate', query: { id: this.formAddOrUpdate.id }})
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
          this.$http.post('sundrytravel/Inst/remove',
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
      showPreviewer (data) {
        console.log(data)
        this.previewer.img = data;
        this.previewer.visible = true;
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
