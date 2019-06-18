<!--
	内容新增与修改
 -->

<template>
  <div class="base-block-add">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="staffName"
        label="收银员名称"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @mouseenter.native="handleDownload(scope.row.id)" type="text" size="small"><a :href="imgHref">下载二维码</a></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="handleAdd()">添加新店员</el-button>
    <el-button icon="el-icon-back" @click="goBack">返回</el-button>

    <el-dialog title="收银" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="收银员名称" label-width="120px">
          <el-input v-model="form.staffName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/babel">

  export default {
    name: "seller-add-staff-list",
    components: {
    },
    mounted() {
      this.fetchData()
    },
    data () {
      return {
        imgHref: '',
        dialogFormVisible: false,
        id: this.$route.params.id,
        tableData: [],
        form: {
          paySubStoreId: this.$route.params.id,
          staffName: '',
          id: ''
        }
      }
    },
    mounted () {
      console.log(this.id + 'bababa')
      if(this.id) {
        this.fetchData();
      }
    },
    methods: {
      fetchData () {
        // 更新或保存信息
        this.$http.get(`/deal/StoreStaff/list`,
          {
            params: {
              paySubStoreId: this.$route.params.id
            }
          }).then(rs => {
          if(rs.data.code === 0) {
            this.tableData = rs.data.data.rows;
          } else {

          }
        }).catch();
      },
      handleAdd () {
        this.dialogFormVisible = true
      },
      handleDownload (id) {
        this.imgHref = this.$appCfg.http.baseURL + `/deal/SubMerchant/create?id=${id}&subType=P`
      },
      handleEdit (data) {
        this.form.id = data.id
        this.form.staffName = data.staffName
        this.dialogFormVisible = true
      },
      submitForm () {
        this.$http.post(`/deal/StoreStaff/saveOrUpdate`,
          this.form
          ).then(res => {
          this.dialogFormVisible = false;
          this.form.staffName = '';
          this.form.id = '';
          this.fetchData()
        })
      },
      cancelForm () {
        this.dialogFormVisible = false;
        this.form.staffName = '';
        this.form.id = '';
      },
      goBack() {
        let id = this.$route.params.id;
        this.$router.push({name: "fndSellerAddList", params:{id:id}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
