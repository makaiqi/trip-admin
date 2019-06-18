<!--
	商家报表
 -->

<template>
  <div class="base-block">
    <div class="base-block-left">
      <el-card>
        <div class="base-block-container">
          <el-form v-model="query" :inline="true">
            <el-form-item prop="merchantName">
              门店选择：<seller-chart-input @changeVal="handleSubId" :id="query.paySubMerchantId"></seller-chart-input>
            </el-form-item>
            <el-select v-model="query.dateType" placeholder="请选择">
              <el-option
                v-for="item in dateOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-form-item prop="merchantName">
              <el-button @click="search">搜索</el-button>
            </el-form-item>
            <el-form-item prop="merchantName">
              <el-button @click="goBack">返回上一级</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <chart-one ref="chartOne"></chart-one>
    </div>
  </div>
</template>

<script type="text/babel">
import chartOne from '@/components/seller-reports-chart-one'
import sellerChartInput from '@/components/seller-chart-input'
  export default {
    name: "seller-report",
    components: {
      chartOne, sellerChartInput
    },
    data() {
      return {
        query: {
          // 门店ID
          paySubMerchantId: this.$route.params.payId,
          paySubStoreId: '',
          dateType: 'day',
          reportName:'bill',
          number:12
        },
        dateOpt: [
          {
            value: 'day',
            label: '日报表'
          }, {
            value: 'week',
            label: '周报表'
          }, {
            value: 'month',
            label: '月报表'
          }
        ]
      }
    },
    watch: {

    },
    mounted () {
      this.$refs.chartOne.refreshData(this.query)
    },
    methods: {
      search() {
        this.$refs.chartOne.refreshData(this.query)
      },
      handleSubId(val) {
        this.query.paySubStoreId = val
      },
      goBack() {
        this.$router.push({name: "fndSellerManagement"})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
