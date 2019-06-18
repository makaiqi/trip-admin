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
            <el-form-item prop="search">
              <el-input clearable v-model="tableList.query.search" placeholder="品牌名称检索"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="cityId">
              <zzu-brand-select v-model="tableList.query.cityId"></zzu-brand-select>
            </el-form-item>-->

            <el-form-item>
              <el-button
                :disabled="tableList.selection.length == 0"
                icon="el-icon-delete"
                @click="deleteData"
              >删除</el-button>
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
            class="base-block-table"
          >
            <template v-for="(item,a) in tableList.columns">
              <el-table-column
                v-if="item.img===0"
                :key="a"
                :type="item.type"
                :fixed="item.fixed"
                :width="item.width || 150"
                :label="item.title"
                :sortable="item.sortable"
                :prop="item.key"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                v-else-if="item.img ===1"
                :key="a"
                :fixed="item.fixed"
                :width="item.width || 150"
                :prop="item.key"
                :sortable="item.sortable"
                :show-overflow-tooltip="true"
                :label="item.title"
              >
                <template slot-scope="scope">
                  <!-- {{scope.row.assetDomain.url}} -->
                  <img :src="scope.row.assetDomain.url" height="100%" width="100%">
                </template>
              </el-table-column>
            </template>
          </el-table>

          <el-pagination
            background
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    <div class="base-block-right">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
        </div>
        <el-form
          label-position="top"
          ref="formAddOrUpdate"
          :model="formAddOrUpdate"
          :rules="ruleAddOrUpdate"
          label-width="80px"
        >
          <el-form-item label="品牌名称" prop="brandName">
            <el-input clearable v-model="formAddOrUpdate.brandName" placeholder="品牌名称"></el-input>
          </el-form-item>
          <el-form-item label="LOGO" prop="logoTblAssetId">
            <zzu-upload v-model="logoTblAssetId" :limit="1" list-type="picture-card"></zzu-upload>

            <div style="color:red">请上传尺寸为670px宽 390px高的图片（宽高比为1.72）</div>
          </el-form-item>

          <el-form-item label="官网" prop="url">
            <el-input clearable v-model="formAddOrUpdate.url" placeholder="url"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="summary">
            <el-input
              clearable
              v-model="formAddOrUpdate.summary"
              placeholder="简介"
              autosize
              type="textarea"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="submitAddOrUpdate('formAddOrUpdate')"
            >保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('formAddOrUpdate')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
import zzuUdc from "@/components/udc";
import zzuUpload from "@/components/upload";
import zzuUploadDrage from "@/components/upload-drage";
import zzuBrandSelect from "@/components/brand-select";

export default {
  name: "userList",
  components: {
    zzuUdc,
    zzuUpload,
    zzuUploadDrage,
    zzuBrandSelect
  },
  data() {
    return {
      timePicker: "",

      cfg: {
        formTitle: "添加品牌",
        formIcon: "plus",
        resetPwdBtn: true,
        delBtn: true,
        resetPwdModal: false
      },
      formSearch: {
        brandName: ""
        // cityId: ''
      },
      formStatus: false,

      logoTblAssetId: [],
      assetDomain: [],

      formAddOrUpdate: {
        id: "",
        brandName: "",
        summary: "",
        logoTblAssetId: "",
        url: ""
      },
      ruleAddOrUpdate: {
        brandName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ],
        logoTblAssetId: [
          { required: true, message: "请上传LOGO", trigger: "blur" }
        ],
        url: [
          { required: true, message: "请输入正确的网址", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (
                /(https?:\/\/(w{3}\.)?)?\w+\.\w+(\.[a-zA-Z]+)*(:\d{1,5})?(\/\w*)*(\??(.+=.*)?(&.+=.*)?)?/.test(
                  value
                )
              ) {
                callback();
              } else {
                callback(new Error("请输入正确的网址"));
              }
            },
            trigger: "blur"
          }
        ]
        // fax: [
        //   { required: false, message: '请输入传真', trigger: 'blur'},
        //   { validator:(rule,value,callback)=>{
        //       if( /^(\d{3,4}-)?\d{7,8}$/.test(value)){
        //         callback();
        //       }else{
        //         callback(new Error("请输入正确的传真"));
        //       }
        //     }, trigger: 'blur' }
        // ]
      },
      tableList: {
        title: "品牌列表",
        query: {
          search: "", // 酒店名称， 模糊查询
          cityId: "", // 酒店所在城市
          pageNum: 1, // 第几页
          pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
          sort: "id", // 主表字段名称
          order: "desc" // 正序还是倒序
        },
        selection: [],
        loading: false,
        columns: [
          {
            type: "selection",
            width: 35,
            key: "id",
            align: "center",
            fixed: "left",
            img: 0
          },
          {
            title: "品牌名称",
            key: "brandName",
            width: 260,
            fixed: "left",
            sortable: true,
            img: 0
          },

          {
            title: "简介",
            key: "summary",
            sortable: true,
            width: 330,
            img: 0
          },
          {
            title: "创建时间",
            key: "createdTime",
            sortable: true,
            img: 0
          },
          {
            title: "创建人员",
            key: "ownerName",
            width: 100,
            sortable: true,
            img: 0
          },
          {
            title: "更新时间",
            key: "updatedTime",
            sortable: true,
            img: 0
          },
          {
            title: "修改人员",
            key: "opUserName",
            width: 100,
            sortable: true,
            img: 0
          },
          {
            title: "LOGO",
            key: "assetDomain.url",
            width: 100,
            sortable: true,
            img: 1
          },
          {
            title: "官网",
            key: "url",
            width: 100,
            sortable: true,
            img: 0
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
      }
    };
  },
  watch: {
    "tableList.query": {
      handler(newValue, oldValue) {
        this.findPage();
      },
      deep: true
    },
    "tableList.selection"(newValue, oldValue) {
      if (newValue.length > 0) {
        for (let obj in this.formAddOrUpdate) {
          if (obj == "hotelAmenitiesCodes") {
            this.formAddOrUpdate[obj] = newValue[0][obj] || [];
          } else {
            this.formAddOrUpdate[obj] = newValue[0][obj];
          }
        }
        // this.formAddOrUpdate.hotelAmenitiesCodeVal = 'UDC_M03_T15'
        this.logoTblAssetId = [newValue[0].assetDomain];
        this.assetDomainList = newValue[0].assetDomainList;
      } else {
        this.resetForm();
      }
    },
    logoTblAssetId(newValue, oldValue) {
      if (newValue.length > 0) {
        this.formAddOrUpdate.logoTblAssetId = newValue[0].id;
      } else {
        this.formAddOrUpdate.logoTblAssetId = "";
      }
    },
    assetDomainList: {
      handler(newValue, oldValue) {
        this.formAddOrUpdate.assetDomainList = newValue.map(item => {
          return {
            id: item.id
          };
        });
      },
      deep: true
    }
  },
  mounted() {
    // console.log(this.assetDomain,'111111');
    this.findPage();
  },
  methods: {
    findPage() {
      let self = this;
      self.$http
        .get(`biz/Brand/list`, {
          params: self.tableList.query
        })
        .then(rs => {
          if (rs.data.code == 0) {
            self.page.total = rs.data.data.total;
            rs.data.data.rows.forEach(r => {
              if (
                r.hotelAmenitiesCodeDesc &&
                r.hotelAmenitiesCodeDesc instanceof Array
              ) {
                r.hotelAmenitiesCodeDesc = r.hotelAmenitiesCodeDesc.join("、");
              }
            });
            self.tableList.data.rows = rs.data.data.rows;
            console.log(self.tableList.data.rows, "111000");
            self.tableList.data.rows.map(function(value, index, array) {
              if (value.assetDomain) {
                self.assetDomain.push(value.assetDomain.url);
              }
            });
            //  console.log(self.assetDomain,'111111');
          } else {
            this.page.total = 0;
            this.tableList.data.rows = [];
          }
        })
        .catch(err => {
          this.page.total = 0;
          this.tableList.data.rows = [];
        });
    },
    submitAddOrUpdate(formName) {
      // 表单验证后可提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveOrUpdate(this.formAddOrUpdate);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    saveOrUpdate(formAddOrUpdate) {
      if (this.formStatus) return;
      this.formStatus = true;
      let data = this.saveOrUpdateAddress(formAddOrUpdate);

      // 更新或保存信息
      this.$http
        .post("biz/Brand/saveOrUpdate", data)
        .then(rs => {
          this.formStatus = false;
          if (rs.data.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.resetForm();
            this.findPage();
          } else {
            this.$message({
              type: "success",
              message: "操作失败!"
            });
          }
        })
        .catch((this.formStatus = false));
    },
    resetForm(data) {
      let formAddOrUpdate = {};
      for (let obj in this.formAddOrUpdate) {
        if (obj == "hotelAmenitiesCodes" || obj == "assetDomainList") {
          formAddOrUpdate[obj] = [];
        } else if (obj == "hotelAmenitiesCodeVal") {
          formAddOrUpdate[obj] = "UDC_M03_T15";
        } else {
          formAddOrUpdate[obj] = "";
        }
      }
      this.formAddOrUpdate = formAddOrUpdate;
      this.logoTblAssetId = [];
      this.assetDomainList = [];
    },
    deleteData() {
      let query = [];
      this.tableList.selection.map(item => {
        query.push(item.id);
      });
      // 删除UDC
      this.$confirm(`此操作将永久删除, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("biz/Brand/remove", query)
            .then(rs => {
              if (rs.data.code == 0) {
                this.findPage();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: "删除失败！"
                });
              }
            })
            .catch();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      this.tableList.selection = val.sort(function(a, b) {
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
};
</script>

<style lang="scss">
@import "~@/assets/css/core/index";
@import "~@/assets/css/base-block";
</style>
