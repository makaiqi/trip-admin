<!--
	酒店信息增删改查
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
            <el-form-item >
              <el-input clearable v-model="tableList.query.search" placeholder="标题名称检索"></el-input>
            </el-form-item>
            <el-form-item >
              <zzu-city-select v-model="tableList.query.cityId"></zzu-city-select>
            </el-form-item>
            <el-form-item>
              <zzu-scenic-select clearable :disabled="tableList.query.cityId ? false : true" :cityId="tableList.query.cityId"
               v-model="tableList.query.scenicId" placeholder="景点名称检索"></zzu-scenic-select>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除
              </el-button>
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

              <el-table-column v-if :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title"
                               :sortable="item.sortable" :prop="item.key" :show-overflow-tooltip="true">
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
    <div class="base-block-right">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
        </div>
        <el-form label-position="top" ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate"
                 label-width="80px">
          <el-form-item label="景点名称" prop="title">
            <el-input clearable v-model="formAddOrUpdate.title" placeholder="景点名称"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="cityId">
            <zzu-city-select v-model="formAddOrUpdate.cityId" :obtainCityName="true" @cityName="getCityName" placeholder="城市"></zzu-city-select>
          </el-form-item>
          <el-form-item label="区县" prop="areaId">
            <zzu-city-select :pid="formAddOrUpdate.cityId" v-model="formAddOrUpdate.areaId"
             placeholder="区县"></zzu-city-select>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input clearable v-model="formAddOrUpdate.address" placeholder="详细地址"></el-input>
          </el-form-item>
          <el-form-item label="景点" prop="tScenicId">
            <zzu-scenic-select :disabled="formAddOrUpdate.cityId ? false : true"
             :cityId="formAddOrUpdate.cityId" clearable v-model="formAddOrUpdate.tScenicId" placeholder="景点">
            </zzu-scenic-select>
          </el-form-item>
          <el-form-item label="产品类别" prop="prodTypeId">
            <zzu-product-associated @obtain="getProdTypeId" v-model="formAddOrUpdate.prodTypeId"></zzu-product-associated>
          </el-form-item>

          <el-form-item label="主图" prop="tAssertId">
            <zzu-upload v-model="tAssertId" :limit="1" list-type="picture-card"></zzu-upload>
            <div style="color:red">请上传尺寸为670px宽 390px高的图片（宽高比为1.72）</div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitAddOrUpdate('formAddOrUpdate')">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('formAddOrUpdate')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
  import zzuUdc from '@/components/udc'
  import zzuUpload from '@/components/upload'
  import zzuCitySelect from '@/components/city-select'
  import zzuScenicSelect from '@/components/scenic-select-simple'
  import zzuProductAssociated from '@/components/product-associated'

  export default {
    name: "userList",
    components: {
       zzuUdc, zzuUpload, zzuCitySelect, zzuProductAssociated,zzuScenicSelect
    },
    data() {
      return {
        timePicker: '',
        currentSelected: '',
        cfg: {
          formTitle: '添加酒店',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false
        },
        formSearch: {
          title: "",
          cityId: ''
        },
        formStatus: false,

        tAssertId: [],

        formAddOrUpdate: {
          id: '',
          title: '',
          cityId: '',
          cityName: '',
          tScenicId: '',
          areaId: '',
          tAssertId: '',
          address: '',
          prodTypeId: '',
        },
        ruleAddOrUpdate: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          tAssertId: [
            {required: true, message: '请上传主图', trigger: 'blur'}
          ],
          cityId: [
            {required: true, message: '请输入城市名称', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
          tScenicId: [
            {required: true, message: '请输入景点', trigger: 'blur'}
          ],
        },
        tableList: {
          title: "景点列表",
          query: {
            search: '', // 酒店名称， 模糊查询
            scenicId: '', // 景点ID
            cityId: '', // 酒店所在城市
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
              title: '标题',
              key: 'title',
              width: 150,
              sortable: true
            },{
              title: '景点名称',
              key: 'scenicName',
              width: 150,
              sortable: true
            },{
              title: '类别',
              key: 'typeName',
              width: 150,
              sortable: true
            },
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
        }
      }
    },
    watch: {
      'tableList.query': {
        handler(newValue, oldValue) {
          this.findPage();
        },
        deep: true
      },
      'tableList.query.cityId': {
        handler(newValue, oldValue) {
          this.tableList.query.scenicId = ''
        },
        deep: true
      },
      'tableList.selection'(newValue, oldValue) {
        if (newValue.length > 0) {
          this.currentSelected = newValue[0].id;
          this.getCurrentForm(this.currentSelected)
        } else {
          this.resetForm();
        }
      },
      'tAssertId'(newValue, oldValue) {
        if (newValue.length > 0) {
          this.formAddOrUpdate.tAssertId = newValue[0].id
        } else {
          this.formAddOrUpdate.tAssertId = ""
        }
      },
    },
    mounted() {
      this.findPage();
    },
    methods: {
      findPage() {
        this.$http.get('biz/ScenicPeriphery/list',
          {
            params: this.tableList.query
          }).then(rs => {
          if (rs.data.code == 0) {
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
      submitAddOrUpdate(formName) {
        // 表单验证后可提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveOrUpdate(this.formAddOrUpdate);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      saveOrUpdate(formAddOrUpdate) {
        if (this.formStatus) return;
        this.formStatus = true;
        let data = this.saveOrUpdateAddressAll(formAddOrUpdate);

        // 更新或保存信息
        this.$http.post('biz/ScenicPeriphery/saveOrUpdate',
          data
        ).then(rs => {
          this.formStatus = false;
          if (rs.data.code == 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.findPage();
            this.resetForm();
          } else {
            this.$message({
              type: 'success',
              message: '操作失败!'
            });
          }
        }).catch(this.formStatus = false);
      },
      resetForm(data) {
        let formAddOrUpdate = {};
        for (let obj in this.formAddOrUpdate) {
          formAddOrUpdate[obj] = ''
        }
        this.formAddOrUpdate = formAddOrUpdate;
        this.tAssertId = []
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
          this.$http.post('biz/ScenicPeriphery/remove',
            query
          ).then(rs => {
            if (rs.data.code == 0) {
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
      getProdTypeId(val) {
        if (val.length != 0) {
          this.formAddOrUpdate.prodTypeId = val[val.length-1]
        } else {
          this.formAddOrUpdate.prodTypeId = ''
        }
      },
      getCityName(val) {
        this.formAddOrUpdate.cityName = val
      },
      getCurrentForm(id) {
        this.$http.get('biz/ScenicPeriphery/'+id,).then(rs =>
        {
          if (rs.data.code == 0) {
            let data = rs.data.data;
            for (let obj in this.formAddOrUpdate) {
              if(obj == 'cityId' || obj == 'cityName'|| obj == 'areaId') {
                this.formAddOrUpdate[obj] = data.addressDomain[obj]
              } else {
                this.formAddOrUpdate[obj] = data[obj]
              }
            }
            this.formAddOrUpdate.tAddressId = data.tAddressId
            this.tAssertId = [{url:data.url, id:data.tAssertId}]
          } else {
            this.page.total = 0;
            this.tableList.data.rows = [];
          }
        }).catch(()=> {
          console.log("error")
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
      },
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';


</style>
