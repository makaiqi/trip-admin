<!--
  广告管理
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
          <el-form ref="formSearch" :inline="true">
            <el-form-item>
              <el-input clearable v-model="tableList.query.search" placeholder="请输入广告名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除</el-button>
            </el-form-item>
          </el-form>

          <el-table
            ref="multipleTable"
            :data="tableList.data.rows"
            border
            stripe
            height="400"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            class="base-block-table">

            <template v-for="item in tableList.columns">
              <el-table-column v-if="item.key == 'isStrategy'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <span>{{ scope.row.isStrategy ? "是" : "否" }}</span>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'img'" :fixed="item.fixed" :type="item.type" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key">
                <template slot-scope="scope">
                  <el-button @click="showPreviewer(scope.row.assetDomain.url)" class="ad-img">点击查看图片</el-button>
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

    <div class="base-block-right">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
        </div>
        <el-form label-position="top" ref="formAddOrUpdate" :model="formAddOrUpdate" :rules="ruleAddOrUpdate" label-width="80px">
          <el-form-item label="广告区位名称" prop="tAdvertisingConfigId">
            <zzu-ad-type-select v-model="formAddOrUpdate.tAdvertisingConfigId" @changeSize="handleSize" @adAreaCodeDesc="adAreaCodeDesc"></zzu-ad-type-select>
          </el-form-item>
          <el-form-item label="图片" prop="tAssertId">
            <zzu-upload v-model="formAddOrUpdate.imgList" list-type="picture-card" :limit="1"></zzu-upload>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input clearable v-model="formAddOrUpdate.title" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item label="口号" prop="slogan">
            <el-input clearable v-model="formAddOrUpdate.slogan" placeholder="口号"></el-input>
          </el-form-item>
         <!-- <el-form-item label="供应商" prop="tVendorId">
            <zzu-vendor-select v-model="formAddOrUpdate.tVendorId"></zzu-vendor-select>
          </el-form-item>-->
          <el-form-item label="链接地址" prop="url">
            <el-input clearable v-model="formAddOrUpdate.url" placeholder="链接地址"></el-input>
          </el-form-item>
          <el-form-item label="是否攻略" prop="isStrategy" v-if="strategyShow">
            <el-switch v-model="formAddOrUpdate.isStrategy"></el-switch>
          </el-form-item>

          <el-form-item label="城市" prop="cityId" v-if="formAddOrUpdate.isStrategy">
            <zzu-city-select v-model="formAddOrUpdate.cityId" placeholder="城市"></zzu-city-select>
          </el-form-item>
          <el-form-item v-if="formAddOrUpdate.isStrategy" label="文章" prop="tContentId">
            <zzu-content-select v-model="formAddOrUpdate.tContentId" :city-id="formAddOrUpdate.cityId" placeholder="请选择文章"></zzu-content-select>
          </el-form-item>
          <el-form-item v-if="formAddOrUpdate.isStrategy" label="景点" prop="tScenicId">
            <zzu-scenic-select v-model="formAddOrUpdate.tScenicId" :city-id="formAddOrUpdate.cityId" :tContentId="formAddOrUpdate.tContentId" placeholder="请选择景点"></zzu-scenic-select>
          </el-form-item>
          <el-form-item label="排序（1~2000越大重要性越高）" prop="seq">
            <el-input clearable v-model="formAddOrUpdate.seq" placeholder="排序" autosize type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input clearable v-model="formAddOrUpdate.remark" placeholder="备注" autosize type="textarea"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitAddOrUpdate('formAddOrUpdate')">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('formAddOrUpdate')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-dialog :visible.sync="previewer.visible">
      <img style="width: 100%" :src="previewer.img">
    </el-dialog>
  </div>
</template>

<script type="text/babel">
  import zzuUdc from '@/components/udc'
  import zzuCitySelect from '@/components/city-select'
  import zzuVendorSelect from '@/components/vendor-select'
  import zzuAdTypeSelect from '@/components/ad-type-select'
  import zzuUpload from '@/components/upload'
  import zzuScenicSelect from '@/components/scenic-article'
  import zzuContentSelect from '@/components/article-select'

  export default {
    name: "adList",
    components: {
      zzuUdc, zzuCitySelect, zzuVendorSelect, zzuAdTypeSelect, zzuUpload, zzuScenicSelect, zzuContentSelect
    },
    data() {
      var validateReq = (rule, value, callback) => {
        if (value > 2000 || value < 1) {
          callback(new Error('请输1~2000的数字'));
        }
          callback()
        }
    return {
      previewer: {
        img: '',
        visible: false
      },
      strategyShow: false,
      cfg: {
        formTitle: '添加广告',
        formIcon: 'plus',
        resetPwdBtn: true,
        delBtn: true,
        resetPwdModal: false
      },
      formStatus: false,
      formAddOrUpdate: {
        id: '',
        seq:'',
        tAdvertisingConfigId: '',
        tAssertId: '',
        imgList: [],
        title: '',
        cityId: '',
        tVendorId: '',
        slogan: '',
        url: '',
        remark: '',
        isStrategy: false,
        tScenicId: '',
        tContentId: ''
      },
      ruleAddOrUpdate: {
        tAdvertisingConfigId: [
          {required: true, message: '请选择广告区位名称', trigger: 'blur'}
        ],
        title:[
          {required: true, message: '请输入广告名称', trigger: 'blur'}
        ],
        tAssertId:[
          {required: true, message: '请上传图片', trigger: 'blur'}
        ],
        seq:[
          {required: true, message: '请填写排序', trigger: 'blur'},
          { validator: validateReq, trigger: 'blur'}
        ],
        tContentId:[
          {required: true, message: '请选择文章', trigger: 'blur'},
        ] ,
        url:[
          {required: true, message: '填写链接地址', trigger: 'blur'},
        ]
      },
      tableList: {
        title: "广告管理",
        query: {
          search: '',
          pageNum: 1,
          pageSize: this.$appCfg.paginationCfg.pageSize,
          sort: 'id',
          order: 'desc'
        },
        // 图片尺寸
        selection: [],
        loading: false,
        columns: [
          {
            type: 'selection',
            width: 35,
            key: 'id',
            align: 'center',
            fixed: 'left'
          }, {
            title: '广告名称',
            key: 'title',
            width: 220,
            sortable: true,
            fixed: 'left'
          }, {
            title: '广告区位名称',
            key: 'adAreaCodeDesc'
          },{
            title: "图片",
            key: "img"
          }, {
            title: "城市",
            width: 90,
            key: "name"
          }, {
            title: "链接地址",
            width: 300,
            key: "url"
          }, {
            title: "是否攻略",
            width: 100,
            key: "isStrategy"
          }, {
            title: "备注",
            width: 260,
            key: "remark"
          },{
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
      size: {
        height: '',
        weight: ''
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
      'formAddOrUpdate.cityId' (newVal,oldVal) {
        if (!newVal) {
          this.formAddOrUpdate.tScenicId = ''
          this.formAddOrUpdate.tContentId = ''
        }
      },
      'formAddOrUpdate.tContentId' (newVal,oldVal) {
        if (!newVal) {
          this.formAddOrUpdate.tScenicId = ''
        }
      },
      'tableList.query': {
        handler (newValue, oldValue) {
          this.findPage();
        },
        deep: true
      },
      'tableList.selection'(newValue, oldValue) {
        if (newValue.length > 0) {
          for (let obj in this.formAddOrUpdate) {
            if(obj == 'imgList') {
              this.formAddOrUpdate[obj] = [newValue[0].assetDomain]
            } else {
              this.formAddOrUpdate[obj] = newValue[0][obj]
            }
          }
        } else {
          this.resetForm();
        }
      },
      "formAddOrUpdate.imgList" (newValue, oldValue) {
        console.log(newValue)
        if(newValue.length > 0) {
          this.formAddOrUpdate.tAssertId = newValue[0].id;
        } else {
          this.formAddOrUpdate.tAssertId = ''
        }
      }
    },
    mounted() {
      this.findPage();
    },
    methods: {
      handleSize (val) {
        if (val) {
          var a = val.height
          this.size.height = val.height
          this.size.weight = val.weight
        }
      },
      adAreaCodeDesc(val) {
        if (val) {
          if (val.indexOf("旅游")!= -1) {
            this.strategyShow = true
          } else {
            this.strategyShow = false
            this.formAddOrUpdate.isStrategy = false
          }
        } else {
          this.strategyShow = false
          this.formAddOrUpdate.isStrategy = false
        }
      },
      findPage() {
        this.$http.get('biz/AdvertisingInst/list',
           { params: this.tableList.query}
          ).then(rs => {
            if(rs.data.code == 0) {
              this.page.total = rs.data.data.total;
              this.tableList.data.rows = rs.data.data.rows;
            } else {
              this.$message({message: rs.data.msg})
              this.page.total = 0;
              this.tableList.data.rows = [];
            }
          }).catch(() => {
              this.page.total = 0;
              this.tableList.data.rows = []
            }
          )
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
      saveOrUpdate (formAddOrUpdate) {
        if(this.formStatus) return;
        this.formStatus = true;
        console.log(formAddOrUpdate)

        if (!this.strategyShow) {
          delete this.formAddOrUpdate.isStrategy
        }
        this.$http.post('biz/AdvertisingInst/saveOrUpdate',
          formAddOrUpdate
          ).then(rs => {
            this.formStatus = false;
            if(rs.data.code == 0) {
              this.$message({
                type: 'success',
                message: rs.data.msg
              });
              this.resetForm();
              this.findPage();
            } else {
              this.$message({
                type: 'success',
                message: rs.data.msg
              });
            }
          }).catch();
      },
      resetForm(data) {
        for (let obj in this.formAddOrUpdate) {
          if(obj == 'imgList') {
            this.formAddOrUpdate[obj] = []
          } else if (obj == 'isStrategy') {
            this.formAddOrUpdate[obj] = false;
          } else {
            this.formAddOrUpdate[obj] = ''
          }
        }
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
          this.$http.post('biz/AdvertisingInst/remove',
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
      },
      showPreviewer (data) {
        this.previewer.img = data;
        this.previewer.visible = true;
      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>

<style lang="scss">
  .ad-img {
    max-width: 100%;
    max-height: 100px;
    margin: 0 auto;
  }
</style>
