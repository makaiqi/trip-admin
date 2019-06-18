<!--
	数据列表
 -->

<template>
	<div class="data-list">
    <el-table
      ref="multipleTable"
      :data="tableList.data.rows"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="base-block-table">
      <el-table-column :type="item.type" :width="item.width" :label="item.title" :sortable="item.sortable" :prop="item.key" v-for="item in tableList.columns" :key="item.key">
      </el-table-column>
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
</template>

<script type="text/babel">
	export default {
		name: 'zzuDataList',
		props: {
			tableList: Object, // 数据列表
			formSearch: Object // 搜索条件
		},
		data () {
			return {
				// 参考数据结构
				// tableList: {
    //       title: "字典列表",
    //       query: {
    //         search: '',
    //         pageNum: 1,
    //         pageSize: this.$appCfg.paginationCfg.pageSize,
    //         sort: 'id',
    //         order: 'desc'
    //       },
    //       selection: [],
    //       loading: false,
    //       columns: [
    //         {
    //           type: 'selection',
    //           width: 60,
    //           key: 'id',
    //           align: 'center',
    //           fixed: 'left'
    //         }, {
    //           title: '字典名称',
    //           key: 'udcName',
    //           fixed: 'left',
    //           sortable: true
    //         }, {
    //           title: '字典码',
    //           key: 'udcCode',
    //           sortable: true
    //         }, {
    //           title: '字典值',
    //           key: 'udcVal',
    //           sortable: true
    //         }
    //       ],
    //       data: {
    //         total: 0,
    //         rows: []
    //       }
    		//     },
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
      	this.$emit('change', newValue)
      },
      'formSearch' (newValue, oldValue) {
      	this.findPage();
      }
    },
    mounted() {
      this.findPage();
    },
    methods: {
      findPage() {
      	if(this.formSearch) {
      		this.tableList.query = this.tableList.query;
      	}

        this.$http.get('fund/Udc/list',
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
      saveOrUpdate (formAddOrUpdate) {
        // 更新或保存信息
        this.$http.post('fund/Udc/saveOrUpdate',
          formAddOrUpdate
          ).then(rs => {
            if(rs.data.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.findPage();
            } else {
              this.$message({
                type: 'success',
                message: '操作失败!'
              });
            }
          }).catch();
      },
      deleteData(data) {
        // 删除UDC
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('fund/Udc/remove',
          [data.id]
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
