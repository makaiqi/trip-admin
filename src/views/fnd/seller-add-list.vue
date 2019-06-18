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
        prop="storeNo"
        label="门店编号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="门店名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="手机号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="城市"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="seq"
        label="排序"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="创建时间"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @mouseenter.native="handleDownload(scope.row.id)" type="text" size="small"><a :href="imgHref">下载二维码</a></el-button>
          <el-button @click="handleRemove(scope.row)" type="text" size="small">删除门店</el-button>
          <!--<el-button @click="handleAddStaff(scope.row)" type="text" size="small">添加门店收营员</el-button>-->
          <!--<el-button @click="handleBill(scope.row)" type="text" size="small">门店流水账单</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="handleAdd()">添加新门店</el-button>
    <el-button icon="el-icon-back" @click="goBack">返回</el-button>
  </div>
</template>

<script type="text/babel">

  export default {
    name: "seller-add",
    components: {
    },
    mounted() {
      this.fetchData()
    },
    data () {
      return {
        id: this.$route.params.id,
        tableData: [],
        imgHref: ''
      }
    },
    mounted () {
      if(this.id) {
        this.fetchData();
      }
    },
    methods: {
      fetchData () {
        // 更新或保存信息
        this.$http.get(`/deal/SubStore/list`,
          {
            params: {
              paySubMerchantId: this.id
            }
          }).then(rs => {
          if(rs.data.code === 0) {
            this.tableData = rs.data.data.rows;
          } else {
            this.tableData = [];
            this.$message({
              message: '暂无数据！'
            })
          }
        }).catch();
      },
      handleBill (data) {
        this.$router.push({name: "fndSellerBill", params:{payId:data.id, subType: 'S',id:this.id}})
      },
      handleDownload (id) {
        this.imgHref = this.$appCfg.http.baseURL + `/deal/SubMerchant/create?id=${id}&subType=S`
      },
      handleAdd () {
        let id = this.id;
        this.$router.push({name: "fndSellerAdd", params:{id:id}})
      },
      handleRemove (data) {
        this.$confirm(`此操作将永久此门店, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          idList.push(data.id);
          this.$http.post('deal/SubStore/remove',
            idList
          ).then(rs => {
            if(rs.data.code === 0) {
              this.fetchData();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'warning',
                message: rs.data.msg
              });
            }
          })
        })
      },
      handleEdit (data) {
        let id = this.id;
        this.$router.push({name: "fndSellerAdd", params:{id:id, data: data}})
      },
      handleAddStaff (data) {
        let id = data.id;
        this.$router.push({name: "fndSellerAddStaffList", params:{id:id, data: data}})
      },
      goBack () {
        let id = this.id;
        this.$router.push({name: "fndSellerManagement"})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
