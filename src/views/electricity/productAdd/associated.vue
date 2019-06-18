<!--关联-->
<template>
  <div class="associated">
    <div class="associated-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm" :disabled="disabled">
        <el-form-item label="供应商名称">
          <!--<tvendor ></tvendor>-->
          <t-vendor v-model="ruleForm.tVendorId"></t-vendor>
        </el-form-item>
        <div style="margin-bottom: 20px;">
          <el-tooltip class="item" effect="dark" content="（输入时自动筛选结果）" placement="top">
            <el-button type="text" class="ass-less-number">制造商/品牌 <i class="el-icon-question"
                                                                     style="color: #1E91CF;"></i></el-button>
          </el-tooltip>
          <zzu-brand-select v-model="ruleForm.eccBrandId"></zzu-brand-select>
        </div>
        <div style="margin-bottom: 20px;">
          <el-tooltip class="item" effect="dark" content="（输入时自动筛选结果）" placement="top">
            <el-button type="text" class="ass-less-number tVendor">产品分类 <i class="el-icon-question"
                                                                           style="color: #1E91CF;"></i></el-button>
          </el-tooltip>
          <zzu-product-associated @obtain="obtain2" :tTypeIdList="tTypeIdList"></zzu-product-associated>
          <!--<zzu-udc v-model="tVendorObj" udc-code="UDC_M03_T12" style="display: inline-block;"></zzu-udc>-->
          <!--<el-form-item>
                    <div class="ass-tVendorId-text">
                        <p  v-for="(item,index) in tVendorName">{{item}}
                            <i class="el-icon-remove" @click="tVendorNameDelect(index)"></i>
                        </p>
                    </div>
                </el-form-item>-->
        </div>
        <div style="margin-bottom: 20px;">
          <el-tooltip class="item" effect="dark" content="（输入时自动筛选结果）" placement="top">
            <el-button type="text" class="ass-less-number assoProduct-name">相关产品<i class="el-icon-question"
                                                                                   style="color: #1E91CF;"></i>
            </el-button>
          </el-tooltip>
          <zzu-product-associated @obtain="obtain"></zzu-product-associated>
          <zzu-product-associated-select v-model="assoProductObj" :typeId="typeId"></zzu-product-associated-select>
          <el-form-item>
            <div class="ass-tVendorId-text assoProductIds-text">
              <p v-for="(item,index) in assoProductName">{{item}}
                <i class="el-icon-remove" @click="assoProductNameDelect(index)"></i>
              </p>
            </div>
          </el-form-item>
        </div>
        <!--<el-form-item label="相关产品">
                  <zzu-related v-model="assoProductObj"></zzu-related>
                  <el-form-item>
                    <div class="ass-tVendorId-text assoProductIds-text">
                        <p v-for="(item,index) in assoProductName">{{item}}
                            <i class="el-icon-remove" @click="assoProductNameDelect(index)"></i>
                        </p>
                    </div>
               </el-form-item>
              </el-form-item>-->
        <el-form-item label="选取物流模板" required>
          <zzu-logistics-select v-model="ruleForm.eccLogisticsTemplateId"></zzu-logistics-select>
          <!--<el-input v-model="ruleForm.eccLogisticsTemplateId"></el-input>-->

          <el-button @click="eccLogisticsTemplateIdPush(0)" type="primary" plain icon="el-icon-plus" style="margin-left: 20px;">新增物流模板</el-button>
          <el-button @click="eccLogisticsTemplateIdBianji(1)" type="primary" plain icon="el-icon-edit">编辑物流模板</el-button>
          <el-button @click="eccLogisticsTemplateIdDelete()" type="warning" plain icon="el-icon-delete">删除物流模板</el-button>
          <el-table class="lgs-table"
                    :data="tableData"
                    border
                    stripe
                    style="width: 100%">
            <el-table-column
              prop="companyName"
              label="物流名称">
            </el-table-column>
            <el-table-column
              prop="cityNames"
              label="送达城市"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.cityNames">{{item}}，</span>
              </template>
            </el-table-column>
            <el-table-column
              :formatter="fmtMoneyStyle"
              prop="firstKgCost"
              label="首重（kg/元）">
            </el-table-column>
            <el-table-column
              :formatter="fmtMoneyStyle"
              prop="continuedPerKgCost"
              label="续重（kg/元）">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button type='primary' @click="editFun(scope.row)"><i class="el-icon-edit"></i></el-button>
                <el-button type='primary' @click="deleteChildren(scope.row.id)"><i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="新增/编辑物流模板" :visible.sync="dialogFormVisible2" @closed="closeDialog">
            <el-form :model="formBlock" ref="formBlock" :rules="dialogRules">
              <el-form-item label="物流模板" :label-width="formLabelWidth" prop="templateName">
                <!--<zzu-logistics-select v-model="formBlock.companyName"></zzu-logistics-select>-->
                <el-input v-model="formBlock.templateName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="计费方式" :label-width="formLabelWidth" prop="isNumberOfCost">
                <el-radio-group v-model="formBlock.isNumberOfCost">
                  <el-radio :label="false" disabled>按重量计费</el-radio>
                  <el-radio :label="true"  disabled>按数量计费</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="物流公司" :label-width="formLabelWidth" prop="logisticsCompanyId">
                <el-switch v-model="logisticsCompany">
                </el-switch>
                <zzu-logistics-wuliu-select
                  v-model="formBlock.logisticsCompanyId"
                  v-if="logisticsCompany"
                ></zzu-logistics-wuliu-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="blockForm()">立即创建</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog title="编辑运费" :visible.sync="dialogFormVisible" :show-close="false">
            <el-form :model="form" >

              <el-form-item label="送达城市" :label-width="formLabelWidth">
                <el-button type="primary" @click="selectCity">点击选择城市</el-button>
                <!--<zzu-city-select v-model="cityID"></zzu-city-select>-->
                <div class="ass-tVendorId-text assoProductIds-text">
					    		<span v-for="(item,index) in cityNames">{{item}}
					    			<i class="el-icon-remove" @click="cityNamesDelect(index)" style="margin-right: 10px;"></i>
					    		</span>
                </div>
              </el-form-item>
              <el-form-item label="首重价格" :label-width="formLabelWidth">
                <el-input v-model="form.firstKgCost"></el-input>
              </el-form-item>
              <el-form-item label="续重价格" :label-width="formLabelWidth">
                <el-input v-model="form.continuedPerKgCost"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="formCancel">取 消</el-button>
              <el-button type="primary" @click="formBtn()">确 定</el-button>
            </div>
          </el-dialog>

          <el-dialog title="选择城市" :visible.sync="dialogFormVisible3" fullscreen>
            <zzu-express @cityVal="obtainCity" @dialogFormVisible3="controlDialogFormVisible3" :cityList="form.cityList"></zzu-express>
          </el-dialog>
          <el-button @click="blockChildren()" type="success" icon="el-icon-plus">新增运费单</el-button>
        </el-form-item>
        <el-form-item label="通用产品代码">
          <el-input v-model="ruleForm.upcNo"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import zzuBrandSelect from '@/components/brand-select'
  import zzuLogisticsSelect from '@/components/logistics-selsect'
  import zzuUdcCategories from '@/components/product-categories'
  import zzuRelated from '@/components/related'
  import zzuProductAssociated from '@/components/product-associated'
  import zzuProductAssociatedSelect from '@/components/product-associated-select'
  import zzuCityInfoSelect from '@/components/city-info-select'
  import zzuLogisticsWuliuSelect from '@/components/logistics-wuliu-select'
  import tVendor from '@/components/tVendorName'
  import zzuExpress from '@/components/express'

  export default {
    components: {
      zzuBrandSelect,
      zzuLogisticsSelect,
      zzuUdcCategories,
      zzuRelated,
      zzuCityInfoSelect,
      zzuLogisticsWuliuSelect,
      tVendor,zzuProductAssociated,zzuProductAssociatedSelect,zzuExpress
    },
    data() {
      return {
        disabled: false,
        logisticsCompany: false,
        tTypeIdList: [],
        ruleForm: {
          eccBrandId: "",
          eccBrandName: "", //品牌名字
          tVendorId: "",
          tTypeId: "", //产品分类
          typeName: "", //产品分类名称
          eccLogisticsTemplateId: "",
          ecctemplateName: "", //物流模块名字
          upcNo: "",
          assoProductIds: "",
          cityList: []
        },

        tableData: [],
        tVendorObj: "",
//      tVendorName:[],
        typeId: '',
        assoProductObj: "",
        assoProductName: [],
        assoProductIdList: [],
        rules: {},
        dialogRules:{
          templateName: [
            {required: true, message: '请输入物流模块名称', trigger: 'blur'}
          ],
        },

        //物流添加 编辑
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        formBlock: {
          id: "",
          templateName: "",
          isNumberOfCost: false,
          logisticsCompanyId: "",  //物流公司名称
        },
//      tableDataBlock: [{
//      	firstKgCost:2,
//        continuedPerKgCost:3,
//      }],
        form: {
          firstKgCost: "",
          continuedPerKgCost: "",
          cityIds: '',
          logisticsCompanyId: "", //物流名称 弃用
          eccLogisticsTemplateId: "", //模块id
        },
        cityNames: [],
//      cityID:"",
        formCityId: "",
        logisticsCompanyIds: "", //子数据编辑回渲id
        cityIDList: [], //城市id数组
        blockID: "",  //物流模块id
        blockIndex: "", //物流模块新增/编辑
        formLabelWidth: '120px',


        listId: "",
        listVal: "",

        newvalID: "",
      };
    },
    watch: {
      ruleForm: {
        handler(val, oldval) {
          this.$emit('assList', this.ruleForm);
        },
        deep: true
      },
//			tVendorObj (newval,oldval) {
//				this.ruleForm.tVendorId = newval.id
//				console.log(this.ruleForm.tVendorId)
//			},
      assoProductObj(newval, oldval) {
        if (newval == "") {
        } else {
          if(this.assoProductIdList.indexOf(newval.id) != -1 ) {
            this.$message({
              message: "已经关联该产品！",
              type: "warning"
            })
            return
          }
          this.assoProductName.push(newval.prodName)
          this.assoProductIdList.push(newval.id)
          this.ruleForm.assoProductIds = this.assoProductIdList.toString()
        }
//				console.log(this.assoProductName)
//				console.log(this.assoProductIdList)
//				console.log(this.ruleForm.assoProductIds)
      },
      logisticsCompany(newVal,oldVal) {
        if(!newVal) {
          this.formBlock.logisticsCompanyId = ""
        }
      },
      listId(newval, oldval) {
        if (newval != "") {
          var that = this
          this.$http.get('/store/Product/findById', {
            params: { //请求参数
              id: newval
            }
          }).then(res => {
            console.log(res.data.data, '0000000关联')
//						this.ruleForm.eccBrandId = res.data.data.eccBrandId
            if (res.data.code == 0) {
              console.log(res.data.data.vendorName)
              this.ruleForm.tVendorId = res.data.data.tVendorId
              this.ruleForm.tTypeId = res.data.data.tTypeId
              this.ruleForm.ecctemplateName = res.data.data.eccLogisticsTemplateId
              this.ruleForm.eccLogisticsTemplateId = res.data.data.eccLogisticsTemplateId
              this.ruleForm.upcNo = res.data.data.upcNo
              this.ruleForm.assoProductIds = res.data.data.assoProductIds
//							this.assoProductObj = res.data.data.assoProduct
//							for(let i=0;i<res.data.data.assoProduct.lenght;i++){
//								this.assoProductName.push(res.data.data.assoProduct[i].ProductName)
//							}

              this.ruleForm.eccBrandId = res.data.data.eccBrandId
//							this.eccBrandName=res.data.data.eccBrandId
              if (res.data.data.assoProductNames) {
                for (let i = 0; i < res.data.data.assoProductNames.length; i++) {
                  this.assoProductName.push(res.data.data.assoProductNames[i])
                }
              }
              if (res.data.data.assoProductsIds) {
                for (let i = 0; i < res.data.data.assoProductsIds.length; i++) {
                  this.assoProductIdList.push(res.data.data.assoProductsIds[i])
                }
              }
              this.$emit('assList', this.ruleForm);
//							console.log(this.ruleForm,'关联')
              this.$http.get('biz/Type/findTypeTreeById', {
                params: {
                  typeId: this.ruleForm.tTypeId,
                  typeCode: "V002"
                }
              }).then(res =>{
                this.tTypeIdList = res.data.data
              })
            }

          })
        }
      },
      'ruleForm.eccLogisticsTemplateId'(newval, oldval) {
        if (newval) {
          this.newvalID = newval
          this.$http.get('/store/LogisticsTemplate/findTempTarget', {
            params: {
              id: newval
            }
          }).then(res => {
            if (res.data.code == 0) {
              this.tableData = res.data.data.tempTargetList || [];
              this.blockID = res.data.data.id
            }
          })
        } else {
          this.blockID = ''
          this.tableData = [];
        }
      },
    },
    created() {
      this.listId = this.$route.query.id
      this.listVal = this.$route.query.data
      this.disabled = this.$route.query.disabled
    },
    mounted() {
    },
    methods: {
      controlDialogFormVisible3() {
        this.dialogFormVisible3 = false
      },
      closeDialog() {
        this.formBlock.templateName = ""
        this.logisticsCompany = false
      },
      fmtMoneyStyle(row, column, cellValue, index) {
        if (cellValue) return `¥: ${cellValue.toFixed(2)}`
        return ''
      },
      obtain(val) {
        if (val.length != 0) {
          this.typeId = val[val.length-1]
        } else {
          this.typeId = ''
        }
      },
      obtain2(val) {
        console.log(val)
        if (val.length != 0) {
          this.ruleForm.tTypeId = val[val.length-1]
        } else {
          this.ruleForm.tTypeId = ''
        }
      },
      obtainCity(val) {
        this.cityIDList = []
        this.cityNames = []
        val.forEach(item => {
          this.cityIDList.push(item.id)
          this.cityNames.push(item.name)
        })
        this.form.cityList = this.cityIDList
      },
//  	tVendorNameDelect(index){
//  		this.tVendorName.splice(index,1)
//  	},
      assoProductNameDelect(index) {
        if(this.disabled) return
        this.assoProductName.splice(index, 1)
        this.assoProductIdList.splice(index, 1)
        this.ruleForm.assoProductIds = this.assoProductIdList.toString()
        console.log(this.ruleForm.assoProductIds, '删除')
      },
      //新增物流模块
      eccLogisticsTemplateIdPush(index) {
        this.dialogFormVisible2 = true
        this.blockIndex = index
      },
      //编辑物流模块
      eccLogisticsTemplateIdBianji(index) {

        if (this.blockID == "") {
          this.$message({
            message: '请先选择模板',
            type: 'warning'
          });
          return;
        } else {
          this.dialogFormVisible2 = true
          console.log(this.newvalID)
          var that = this
          this.$http.get('/store/LogisticsTemplate/findById', {
            params: {
              id: that.newvalID
            }
          }).then(res => {
            if (res.data.code == 0) {
              this.formBlock = res.data.data
              if (this.formBlock.logisticsCompanyId) {
                this.logisticsCompany = true
              } else {
                this.logisticsCompany = false
              }
              this.blockIndex = index
            }
          })
        }
      },
      //删除模块
      eccLogisticsTemplateIdDelete() {
        if (this.blockID == "") {
          this.$message({
            message: '请先选择模板',
            type: 'warning'
          });
          return;
        } else {
          this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then (()=> {
            let data = this.newvalID
            this.$http.post('/store/LogisticsTemplate/remove', [data]).then(res => {
              if (res.data.code == 0) {
                this.ruleForm.eccLogisticsTemplateId = " "
                this.tableData = [];
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                });
              }
            })
          })
        }
      },

      //编辑物流子数据
      editFun(val, index) {
        console.log(val)
        this.dialogFormVisible = true
        //回渲 子数据物流名称id
        this.logisticsCompanyIds = val.logisticsCompanyId
        this.form = val
        this.form.logisticsCompanyId = val.companyName
        this.cityNames = val.cityNames
        this.cityIDList = val.cityList
      },
      //删除物流子数据
      deleteChildren(index) {
        var that = this
        this.$http.post('/store/LogisticsTempTarget/remove',
          [index]
        ).then(res => {
          console.log(res)
          if (res.data.code == 0) {
            this.findTempTarget()
          }
        })

      },
      cityNamesDelect(index) {
        this.cityNames.splice(index, 1)
        this.cityIDList.splice(index, 1)
        this.form.cityList = this.cityIDList
      },
      //物流模块
//  	blockBianji(){
//  		this.dialogFormVisible = true
//
//  	},
      selectCity() {
        this.dialogFormVisible3 = true
      },
      formCancel() {
        this.dialogFormVisible = false
        this.findTempTarget()
        this.resetForm()
      },
      blockForm() {
        this.$refs['formBlock'].validate((valid) => {
          if (valid) {
            if (this.blockIndex == 0) {
              this.formBlock.id = ""
            } else {
              this.formBlock.id = this.newvalID
            }
            const data = this.formBlock
            console.log(data)
            this.$http.post('/store/LogisticsTemplate/saveOrUpdate', data).then(res => {
              if (res.data.code == 0) {
                this.ruleForm.eccLogisticsTemplateId = res.data.data.id;
                this.dialogFormVisible2 = false
              }
            })
          } else {
            console.log('error submit!!');
            return
          }
        });
//				console.log(this.blockIndex)
//				console.log(this.formBlock.id)
      },

      //添加子元素弹框
      blockChildren() {
        if (this.blockID == "") {
          this.$message({
            message: '请先选择模板',
            type: 'warning'
          });
          return;
        } else {
          this.dialogFormVisible = true
          this.form = {
            firstKgCost: "",
            continuedPerKgCost: "",
            cityIds: "",
            logisticsCompanyId: "", //物流名称
            eccLogisticsTemplateId: "" //模块id
          }
        }

      },
      //添加子数据
      formBtn() {
        if (this.form.cityList.length == 0) {
          this.$message({
            message: "请至少选择一个城市"
          })
          return
        }

        this.form.eccLogisticsTemplateId = this.blockID
        if (typeof this.form.logisticsCompanyId == 'string') {
          this.form.logisticsCompanyId = this.logisticsCompanyIds
        } else {
          this.form.logisticsCompanyId = this.form.logisticsCompanyId
        }
        const data = this.form
        var that = this
        this.$http.post('/store/LogisticsTempTarget/saveOrUpdate', data).then(res => {
          if (res.data.code == 0) {
            this.dialogFormVisible = false
            this.findTempTarget()
            this.resetForm()
          }else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      },
      resetForm() {
        for (let obj in this.form) {
          if (obj == 'cityList' || obj == 'cityNames') {
            this.form[obj] == []
          } else {
            this.form[obj] = ''
          }
        }
        this.cityNames = [];
      },
      findTempTarget() {
        this.$http.get('/store/LogisticsTemplate/findTempTarget', {
          params: {
            id: this.newvalID
          }
        }).then(res => {
          if (res.data.code == 0 || res.data.code == 10) {
            this.tableData = res.data.data.tempTargetList
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
  @import "~@/assets/css/core/index";

  .associated {
    padding-top: 20px;
  }

  .ass-less-number {
    margin-left: 25px;
    color: #606266;
    margin-right: 6px;
  }

  .tVendor {
    margin-left: 40px;
  }

  .assoProduct-name {
    margin-left: 45px;
  }

  .ass-tVendorId-text {
    height: 150px;
    overflow: auto;
    padding: 9px;
    border-radius: 2px;
    min-height: 20px;
    margin-bottom: 20px;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
    margin-left: 5px;
  }

  .assoProductIds-text {
    margin-left: 6px;
  }

  .lgs-table {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
