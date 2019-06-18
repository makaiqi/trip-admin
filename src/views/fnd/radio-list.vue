<!--
	音频信息增删改查
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
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            class="base-block-table">

            <template v-for="item in tableList.columns">
              <el-table-column v-if="item.key == 'assetDomain'" :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <div v-if ="scope.row.imgUrl "  style="width: 50px;height: 50px;border: 1px solid #ddd;padding: 4px;">
                    <img :src="scope.row.imgUrl" alt="" style="width: 100%;height: 100%;"/>
                  </div>
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
          title: "音频列表",
          query: {
            search: '', // 内容名称， 模糊查询
            cityId: '', // 内容所在城市
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
              fixed: 'left'
            }, 
            {
              title: '图像',
              key: 'assetDomain',
              width:80,
              fixed: 'left'
            },
             {
              title: '标题',
              key: 'title',
              width:300,
              fixed: 'left',
              sortable: true
            },{
              title: '二级标题',
              width: 260,
              key: 'subtitle',
              sortable: true
            },
            {
              title: '景区',
              width: 200,
              key: 'scenicName',
              sortable: true
            },
            {
              title: '试听',
              width: 150,
              key: 'voiceUrl',
              sortable: true
            },
            // {
            //   title: '类别',
            //   key: 'typeId',
            //   sortable: true
            // },
            {
              title: '作者',
              sortable: true,
              key: 'author',
            },{
              title: '关键词',
              width:300,
              key: 'keyword',
            },
            // {
            //   title: '是否上架',
            //   sortable: true,
            //   key: 'isOnline',
            // },
            // {
            //   title: '是否攻略',
            //   sortable: true,
            //   key: 'isStrategy',
            // },
            {
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
        this.$http.get(`deal/Content/list`,
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
        this.$router.push({name: 'fndRadioAddOrUpdate' })
      },
      updateData () {
        this.$confirm(`此操作将只能编辑右侧显示角色${this.formAddOrUpdate.title}的详情, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({name: 'fndRadioAddOrUpdate', query: { id: this.formAddOrUpdate.id }})
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
