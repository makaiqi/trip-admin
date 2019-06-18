<!--
	内容新增与修改
 -->

<template>
  <div class="base-block-add">
    <el-form ref="form" :rules="ruleAddOrUpdate" label-position="right" label-width="120px" :model="formAddOrUpdate">
      <el-form-item label="所在城市" prop="cityId">
        <zzu-city-select v-model="formAddOrUpdate.cityId" placeholder="城市"></zzu-city-select>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input clearable v-model="formAddOrUpdate.address" placeholder="地址" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="seq">
        <el-input clearable type="number" v-model="formAddOrUpdate.seq" placeholder="排序" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="门店名称" prop="storeName">
        <el-input clearable v-model="formAddOrUpdate.storeName" placeholder="门店名称" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input clearable v-model="formAddOrUpdate.phoneNumber" placeholder="手机号" class="inputWidth"></el-input>
      </el-form-item>
      <el-form-item label="结算周期" prop="settlementCycle">
        <el-input-number v-model="formAddOrUpdate.settlementCycle" :min="1" :max="30" label="结算周期"></el-input-number>天
      </el-form-item>
      <el-form-item label="佣金率" prop="commissionRate">
        <el-input-number v-model="formAddOrUpdate.commissionRate" :precision="3" :step="0.001" :min="0" :max="1" label="佣金率"></el-input-number>%
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-add" type="primary" @click="submitForm">提交</el-button>
        <el-button icon="el-icon-back" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/babel">
  import zzuCitySelect from '@/components/city-select'
  let validPhone=(rule, value,callback)=>{
    let isMobile = /(\+\d+)?1[34578]\d{9}$/;
    if (!value){
      callback(new Error('请输入电话号码'))
    }else  if (!isMobile.test(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  }
  export default {
    name: "seller-add",
    components: {
      zzuCitySelect
    },
    data () {
      return {
        formAddOrUpdate: {
          paySubMerchantId: this.$route.params.id,
          cityId: '',
          address: '',
          seq: '',
          storeName: '',
          areaCodeDesc: '',
          phoneNumber: '',
          settlementCycle: '',
          commissionRate: ''
        },
        ruleAddOrUpdate: {
          phoneNumber:[
            {required: true, validator: validPhone, trigger: 'blur'}
          ],
          storeName:[
            {required: true, message: '请输入门店名称', trigger: 'blur'}
          ],
          address:[
            {required: true, message: '请输入地址', trigger: 'blur'}
          ],
          cityId:[
            {required: true, message: '请输入城市', trigger: 'blur'}
          ],
          settlementCycle:[
            {required: true, message: '请输入1到30', trigger: 'blur'}
          ],
          commissionRate:[
            {required: true, message: '请输入佣金率', trigger: 'blur'}
          ],
        },
      }
    },
    watch: {
    },
    mounted () {
      if (this.$route.params.data) {
        this.formAddOrUpdate = this.$route.params.data
      }
    },
    methods: {
      submitForm () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 更新或保存信息
            this.$http.post('/deal/SubStore/saveOrUpdate',
              this.formAddOrUpdate
            ).then(rs => {
              if(rs.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                let id = this.formAddOrUpdate.paySubMerchantId
                this.$router.push({name: "fndSellerAddList", params:{id:id}})
              } else {
                this.$message({
                  type: 'warning',
                  message: rs.data.msg
                });
              }
            }).catch();
          } else {
            this.$message({
              type: 'success',
              message: '请填写完整数据!'
            });
          }
        })
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
  .inputWidth {
    width: 25%;
  }
</style>
