<!--
	内容新增与修改
 -->

<template>
  <div class="base-block-add">
    <el-form ref="form" label-position="right" label-width="80px" :model="formAddOrUpdate">
      <el-form-item label="标题"  required>
        <el-input v-model="formAddOrUpdate.visaTitle" placeholder="标题" ></el-input>
      </el-form-item>
      <el-form-item label="国家"  required>
        <zzu-city-select v-model="formAddOrUpdate.visaCountryId" :level="1" placeholder="国家" ></zzu-city-select>
      </el-form-item>
      <el-form-item label="预订须知" prop="reservationNode">
        <el-input v-model="formAddOrUpdate.reservationNode" placeholder="预订须知"></el-input>
      </el-form-item>
      <el-form-item label="主图"  required>
        <zzu-upload v-model="assetDomain" listType="picture" :limit="1"></zzu-upload>
        <div>请上传宽度为420px 高度为380px的图片（宽高比约为1）</div>
      </el-form-item>
      <el-form-item label="详情页主图"  required>
        <zzu-upload v-model="assetDomainList" listType="picture" :limit="1"></zzu-upload>
        <div>请上传宽度为1400px 高度为440px的图片（宽高比约为3）</div>
      </el-form-item>
      <el-form-item label="签证所需材料模板文件" prop="visaApplyAttach">
        <zzu-upload v-model="visaApplyAttach" listType="text" :limit="1"></zzu-upload>
        <div>任意形式文件都可以（图片，PDF，word...）文件大小不得大于2MB 最多一个文件</div>
      </el-form-item>
      <el-form-item label="在职证明模板文件" prop="incumbencyCertification">
        <zzu-upload v-model="incumbencyCertification" listType="text" :limit="1"></zzu-upload>
        <div>任意形式文件都可以（图片，PDF，word...）文件大小不得大于2MB 最多一个文件</div>
      </el-form-item>
      <el-form-item label="流程须知模板文件" prop="processNodeAttach">
        <zzu-upload v-model="processNodeAttach" listType="text" :limit="1"></zzu-upload>
        <div>任意形式文件都可以（图片，PDF，word...）文件大小不得大于2MB 最多一个文件</div>
      </el-form-item>

      <el-form-item label="套餐" prop="comboDomains">
        <el-table
          ref="comboDomains"
          :data="formAddOrUpdate.comboDomains"
          border
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <template v-for="item in comboDomainsColumns">
            <el-table-column v-if="item.key == 'comboTitle'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.comboTitle" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'price'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" type="number" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'expirationDate'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.expirationDate" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'longestStay'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.longestStay" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'numberOfEntry'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.numberOfEntry" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'handlingTime'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.handlingTime" value-format="yyyy-MM-dd" type="date" :placeholder="item.title"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'visaComboCode'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-select clearable filterable v-model="scope.row.visaComboCode" placeholder="placeholder" @change="handleChange">
                  <el-option
                    v-for="(item, index) in udcDatas"
                    :key="index"
                    :label="item.udcName"
                    :value="item.udcVal"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'isInterview'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.isInterview"></el-switch>
              </template>
            </el-table-column>
          </template>

          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addRow('comboDomains', scope.$index)">新增</el-button>
              <el-button type="text" size="small" @click="removeRow('comboDomains', scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="流程须知" prop="processNodeDomains">
        <el-table
          ref="processNodeDomains"
          :data="formAddOrUpdate.processNodeDomains"
          border
          stripe
          tooltip-effect="dark"
          style="width: 100%">
          <template v-for="item in processNodeDomainsColumns">
            <el-table-column v-if="item.key == 'title'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.title" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'summary'" :fixed="item.fixed" :type="item.type" :width="item.width" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.summary" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="item.key == 'seq'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
              <template slot-scope="scope">
                <el-input v-model="scope.row.seq" :placeholder="item.title"></el-input>
              </template>
            </el-table-column>
          </template>

          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addRow('processNodeDomains', scope.$index)">新增</el-button>
              <el-button type="text" size="small" @click="removeRow('processNodeDomains', scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
  import zzuUdc from '@/components/udc'
  import zzuUpload from '@/components/upload'

  export default {
    name: "visaAddOrUpdate",
    components: {
      zzuCitySelect, zzuUdc, zzuUpload
    },
    data () {
      return {
        assetDomain: [],
        assetDomainList: [],
        visaApplyAttach: [],
        udcDatas: [],
        incumbencyCertification: [],
        processNodeAttach: [],
        isOk: true,
        id: this.$route.query.id,
        comboDomainsColumns: [
          {
            title: '签证次数编码',
            key: 'visaComboCode'
          },
          {
            title: '价格',
            key: 'price',
          },{
            title: '有效期限',
            key: 'expirationDate'
          },{
            title: '最长停留',
            key: 'longestStay'
          },{
            title: '入境次数',
            key: 'numberOfEntry'
          },{
            title: '办理时间',
            key: 'handlingTime'
          },{
            title: '是否面试',
            key: 'isInterview'
          }
        ],
        processNodeDomainsColumns: [
          {
            title: '标题',
            key: 'title'
          },{
            title: '描述内容',
            key: 'summary'
          },{
            title: '排序',
            key: 'seq'
          }
        ],
        formStatus: false,
        formAddOrUpdate: {
          id: this.$route.query.id,
          visaTitle: '',
          visaCountryId: '',
          reservationNode: '',
          tAssetId: '',
          barImageTAssetId: '',
          visaApplyAttach: '',
          incumbencyCertification: '',
          processNodeAttach: '',
          comboDomains: [
            {
              comboTitle: '',
              price: '',
              expirationDate: '',
              longestStay: '',
              numberOfEntry: '',
              handlingTime: '',
              visaComboCode: '',
              isInterview: false
            }
          ],
          processNodeDomains: [
            {
              title: '',
              summary: '',
              seq: ''
            }
          ]
        },
        ruleAddOrUpdate: {
          visaTitle: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ]
        },
      }
    },
    watch : {
      'assetDomainList' (newVal,oldVal) {
        if (newVal && newVal.length > 0) {
          this.formAddOrUpdate.barImageTAssetId = newVal[0].id
        }
      },
      'assetDomain' (newVal,oldVal) {
        if (newVal && newVal.length > 0) {
          this.formAddOrUpdate.tAssetId = newVal[0].id
        }
      },
      'visaApplyAttach' (newVal,oldVal) {
        if (newVal && newVal.length > 0) {
          this.formAddOrUpdate.visaApplyAttach = newVal[0].id
        } else {
          this.formAddOrUpdate.visaApplyAttach = ''
        }
      } ,
      'incumbencyCertification' (newVal,oldVal) {
        if (newVal && newVal.length > 0) {
          this.formAddOrUpdate.incumbencyCertification = newVal[0].id
        } else {
          this.formAddOrUpdate.incumbencyCertification = ''
        }
      },
      'processNodeAttach' (newVal,oldVal) {
        if (newVal && newVal.length > 0) {
          this.formAddOrUpdate.processNodeAttach = newVal[0].id
        } else {
          this.formAddOrUpdate.processNodeAttach = ''
        }
      }
    },
    mounted () {
      if(this.id) {
        this.fetchData()
        this.fetchUdc()
      }
    },
    methods: {
      fetchUdc() {
        this.$http.get('fund/Udc/udcCode?udcCode=UDC_M08_T01'
        ).then(rs => {
          if(rs.data.code == 0) {
            let list = [];
            list = rs.data.data.map(item => {
              return Object.assign(item, { disabled: false });
            })
            this.udcDatas = list;
          } else {
            this.udcDatas = []
          }
          this.handleChange()
        }).catch(this.udcDatas = []);
      },
      fetchData () {
        // 更新或保存信息
        this.$http.get(`sundrytravel/Inst/findById`,
          {
            params: {
              id: this.id
            }
          }).then(rs => {
          console.log(rs)
          if(rs.data.code == 0) {
            this.formAddOrUpdate = rs.data.data;
            this.assetDomain = [rs.data.data.assetDomain]
            this.assetDomainList = [rs.data.data.assetDomainList]

            if (rs.data.data.incumbencyCertificationDomain) {
              this.incumbencyCertification = [rs.data.data.incumbencyCertificationDomain]
              this.incumbencyCertification[0].name = this.incumbencyCertification[0].keyName
            }

            if (rs.data.data.processNodeAttachDomain) {
              this.processNodeAttach = [rs.data.data.processNodeAttachDomain]
              this.processNodeAttach[0].name = this.processNodeAttach[0].keyName
            }

            if (rs.data.data.visaApplyAttachDomain) {
              this.visaApplyAttach = [rs.data.data.visaApplyAttachDomain]
              this.visaApplyAttach[0].name = this.visaApplyAttach[0].keyName
            }

            this.handleChange()
          } else {

          }
        }).catch();
      },
      // 移除不可选项
      handleChange(val) {
        var combos = []
        var udcVals = []
        this.formAddOrUpdate.comboDomains.forEach(item=> {
          combos.push(item.visaComboCode)
        })
        this.udcDatas.forEach(it=> {
          udcVals.push(it.udcVal)
          return it.disabled = false
        })
        combos.forEach(item=> {
          if (udcVals.indexOf(item) != -1) {
            this.udcDatas[udcVals.indexOf(item)].disabled = true
          }
        })
      },
      submitForm () {
        if(this.formStatus) return;
        this.formStatus = true;
        // 更新或保存信息
        this.isOk = true
        this.validateForm()
        if (!this.isOk) {
          return
        }

        this.$http.post('sundrytravel/Inst/saveOrUpdate',
          this.formAddOrUpdate
        ).then(rs => {
          this.formStatus = false;
          if(rs.data.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.$router.push({name:"fndVisaList"})
          } else {
            this.$message({
              type: 'success',
              message: '操作失败!'
            });
          }
        }).catch();
      },
      goBack () {
        this.$router.go(-1);
      },
      addRow (data, ind) {
        let item = {
          comboTitle: '',
          price: '',
          expirationDate: '',
          longestStay: '',
          numberOfEntry: '',
          handlingTime: '',
          visaComboCode: '',
          isInterview: false
        };

        if(data == 'processNodeDomains') {
          item =   {
            title: '',
            summary: '',
            seq: ''
          };
        }

        this.formAddOrUpdate[data].push(item);
      },
      removeRow (data, ind) {
        if (this.formAddOrUpdate[data].length == 1) {
          this.$message({
            message: "请至少保留一条数据",
            type: "warning"
          })
          return
        }
        this.formAddOrUpdate[data].splice(ind, 1);
        this.handleChange()
      },
      resetForm () {
        this.formAddOrUpdate = {
          id: '',
          visaTitle: '',
          visaCountryId: '',
          reservationNode: '',
          tAssetId: '',
          barImageTAssetId: '',
          visaApplyAttach: '',
          incumbencyCertification: '',
          processNodeAttach: '',
          comboDomains: [
            {
              comboTitle: '',
              price: '',
              expirationDate: '',
              longestStay: '',
              numberOfEntry: '',
              handlingTime: '',
              visaComboCode: '',
              isInterview: false
            }
          ],
          processNodeDomains: [
            {
              title: '',
              summary: '',
              seq: ''
            }
          ]
        }
      },
      validateForm () {
        if (this.formAddOrUpdate.visaTitle == '' || this.formAddOrUpdate.visaCountryId == ''
          || this.formAddOrUpdate.tAssetId == '' || this.formAddOrUpdate.barImageTAssetId == '') {
          this.$message({
            type: 'error',
            message: '请将必要信息填写完整!'
          })
          this.formStatus = false;
          return this.isOk = false
        }
        this.formAddOrUpdate.comboDomains.forEach(item => {
          if (item.comboTitle == '' || item.price == '' || item.expirationDate == '' || item.longestStay == '' ||
            item.numberOfEntry == '' || item.handlingTime == '' || item.visaComboCode == '') {
            this.$message({
              type: 'error',
              message: '请将套餐中信息填写完整!'
            })
            this.formStatus = false;
            return this.isOk = false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
