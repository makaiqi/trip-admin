<!--
	餐厅信息录入
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
          <el-form v-model="tableList.query" :inline="true">
            <el-form-item>
              <el-input clearable v-model="tableList.query.search" placeholder="请输入游玩项目名称"></el-input>
            </el-form-item>
            <el-form-item prop="fndCityId">
              <zzu-city-select v-model="tableList.query.fndCityId"></zzu-city-select>
            </el-form-item>
            <!-- <el-form-item>
              <el-button :disabled="tableList.query.cityId == ''" icon="el-icon-search" @click="findPage">查询</el-button>
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
            <el-table-column
              :type="item.type"
              :fixed="item.fixed"
              :width="item.width || 150"
              :label="item.title"
              :sortable="item.sortable"
              :prop="item.key"
              v-for="item in tableList.columns"
              :key="item.key"
              :show-overflow-tooltip="true"
            ></el-table-column>
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
        <el-tabs type="border-card">
          <el-tab-pane label="添加游玩">
            <el-form
              label-position="top"
              ref="form"
              :model="form"
              :rules="ruleForm"
              label-width="80px"
            >
              <el-form-item label="项目名称" prop="funName">
                <el-input clearable v-model="form.funName" placeholder="项目名称"></el-input>
              </el-form-item>
              <el-form-item label="品牌" prop="brandName">
                <zzu-brand-select v-model="form.tblBrandId" placeholder="品牌"></zzu-brand-select>
              </el-form-item>
              <el-form-item label="游玩时长" prop="funTime">
                <el-input clearable v-model="form.funTime" placeholder="游玩时长"></el-input>
              </el-form-item>
              <el-form-item label="适合年龄" prop="ageRange">
                <el-input clearable v-model="form.ageRange" placeholder="适合年龄"></el-input>
              </el-form-item>
              <el-form-item label="开放时间" prop="showtime">
                <el-input clearable v-model="form.showtime" placeholder="开放时间"></el-input>
              </el-form-item>
              <el-form-item label="活动类别" prop="funType">
                <el-input clearable v-model="form.funType" placeholder="活动类别"></el-input>
              </el-form-item>
              <el-form-item label="无障碍设施安排及注意事项" prop="noteTypeCodes">
                <zzu-udc
                  v-model="form.noteTypeCodes"
                  multiple="multiple"
                  :udc-code="vo.noteTypeCodeVal"
                  placeholder="无障碍设施安排及注意事项"
                  
                ></zzu-udc>
              </el-form-item>
              <el-form-item label="游客须知" prop="notice">
                <el-input clearable v-model="form.notice" placeholder="游客须知"></el-input>
              </el-form-item>
              <el-form-item label="项目内容介绍" prop="content">
                <el-input
                  clearable
                  v-model="form.content"
                  placeholder="项目内容介绍"
                  autosize
                  type="textarea"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="submitForm">保存</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="配置地图坐标" :disabled="!form.id">
            <el-form
              label-position="top"
              ref="pointForm"
              :model="pointForm"
              :rules="rulePointForm"
              label-width="80px"
            >
              <el-form-item label="选择景点" prop="tblScenicId">
                <xyUdcRemote
                  :currentValue="pointForm.tblScenicId"
                  @xy-change="scenicChangeHandler"
                  url="biz/Scenic/findWithCondition"
                  labelName="scenicName"
                  valueName="id"
                  placeholder="请选择景点"
                ></xyUdcRemote>
              </el-form-item>
              <el-form-item label="标题" prop="title">
                <el-input clearable v-model="pointForm.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input clearable v-model="pointForm.address" placeholder="请填写地址"></el-input>
              </el-form-item>
              <el-form-item v-if="pointForm.tblScenicId" label="地图位置" name="second">
                <xy-amap
                  :point="pointForm"
                  @xy-click="handleMapClick"
                  @xy-marker-dragend="markerUpdateHandler"
                  @xy-point-update="mapPonitUpdateHandler"
                />
              </el-form-item>
              <el-form-item label="广告图" prop="tblBannerAssetId">
                <zzu-upload
                  v-model="vo.bannerAsset"
                  list-type="picture-card"
                  @xy-remove="handleRemoveBanner"
                  :limit="1"
                ></zzu-upload>
                <div style="color:red">请上传尺寸为1053px宽 369px高的图片（宽高比为2.85）</div>
              </el-form-item>
              <el-form-item label="简述" prop="summary">
                <el-input clearable v-model="pointForm.summary" placeholder="简单介绍" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="图片" prop="tblAssetId">
                <zzu-upload
                  v-model="vo.assetDomainList"
                  list-type="picture-card"
                  @xy-remove="handleRemovePic"
                  :limit="1"
                ></zzu-upload>
                <div style="color:red">请上传尺寸为500px宽 500px高的图片（宽高比为1:1）</div>
              </el-form-item>
              <el-form-item label="音频" prop="tAssertVoiceId">
                <zzu-upload
                  :audio="true"
                  v-model="vo.radio"
                  :limit="1"
                  list-type="text"
                  @xy-remove="handleRemoveRadio"
                ></zzu-upload>
              </el-form-item>

              <el-form-item label="选择菜单" prop="fndMenuId">
                <xyMenuSelect
                  :currentValue="pointForm.fndMenuId"
                  v-model="pointForm.fndMenuId"
                  labelName="menuName"
                  valueName="id"
                  :multiple="cfg.multiple"
                  @xy-change="menuChangeHandler"
                  placeholder="请选择菜单"
                ></xyMenuSelect>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <richText v-model="pointForm.content" placeholder="请输入內容"></richText>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="scenicPointForm"
                  :disabled="!form.id"
                >保存</el-button>
                <el-button icon="el-icon-refresh" @click="resetForme">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
// import {mapState} from 'vuex'

import zzuCitySelect from "@/components/city-select";
import zzuUdc from "@/components/udc";
import zzuMap from "@/components/map";
import zzuBrandSelect from "@/components/brand-select";
import zzuUpload from "@/components/upload";
// import GaodeMap from  '@/components/xy-map'
import XyAmap from "../../components/xy-amap";
import xyUdcRemote from "@/components/xy-udc-remote";
import richText from "@/components/rich-text";
import xyMenuSelect from "@/components/xy-menu-select";

const defForm = {
  id: null, //id
  // fndCityId: null,//所在城市id
  // fndAreaId: null, //区县id
  tblScenicPoint: "", //项目坐标
  tblBrandId: null, //品牌id
  funTime: "", //游玩时长
  funName: "", //项目名称   //
  ageRange: "", //适合年龄  //
  showtime: "", //开放时间 //
  funType: "", //活动类别 //
  noteTypeCodes: [], //无障碍设施安排及注意事项@UDC_M03_T13 //
  noteTypeCodeVal: "UDC_M03_T13",
  notice: "", //游客须知 //
  content: "" //内容
};

const pointDefForm = {
  centerLat: null, //景区中心纬度
  centerLng: null, //景区中心经度
  lng: null, //经度
  lat: null, //纬度
  tableId: null,
  tableName: "TBL_FUN", //业务表id   关键字
  // cityId: '',		//城市id
  tblScenicId: null, //景区id
  fndAddressId: null, //地址表id
  tblBannerAssetId: null, //广告图id
  address: "", //详细地址,
  fndMenuId: null, //菜单id  下拉选选菜单
  tblAssetId: null, //资源id   上传图片
  voiceAssetId: null, //语音资源id
  title: "", //标题
  summary: "", //简述
  content: "", //内容   富文本
  fileName: ""
};

export default {
  name: "userList",
  components: {
    zzuCitySelect,
    zzuUdc,
    zzuMap,
    zzuBrandSelect,
    xyUdcRemote,
    richText,
    xyMenuSelect,
    zzuUpload,
    XyAmap
  },
  data() {
    return {
      mapData: {
        lng: "",
        lat: ""
      },
      cfg: {
        tabActive: "form",
        formIcon: "plus",
        resetPwdBtn: true,
        delBtn: true,
        resetPwdModal: false,
        tableName: "TBL_FUN" //业务表名
      },
      formStatus: false,

      // 餐厅表单
      form: { ...defForm },
      pointForm: { ...pointDefForm },
      ruleForm: {
        tblScenicId: [
          { required: true, message: "请选择景点", trigger: "blur" }
        ],
        funName: [{ required: true, message: "请填写项目", trigger: "blur" }]
      },
      rulePointForm: {
        title: [{ required: true, message: "标题必填项", trigger: "blur" }]
        // tblScenicId: [{ required: true, message: "景点必填项", trigger: "blur" }]
      },
      // rulePointForm: {
      //   title: [{ required: true, message: "标题必填项", trigger: "blur" }]
      // },
      vo: {
        assetDomainList: [],
        noteTypeCodeVal: "UDC_M03_T13",
        radio: [],
        bannerAsset: []
      },
      tableList: {
        title: "游玩列表",
        query: {
          cityId: "",
          search: "",
          pageNum: 1,
          pageSize: this.$appCfg.paginationCfg.pageSize,
          sort: "id",
          order: "desc"
        },
        selection: [],
        loading: false,
        columns: [
          {
            type: "selection",
            width: 35,
            key: "id",
            align: "center",
            fixed: "left"
          },
          {
            title: "项目名称",
            key: "funName",
            width: 200,
            fixed: "left",
            sortable: true
          },
          {
            title: "活动类别",
            key: "funType",
            width: 200,
            sortable: true
          },
          {
            title: "开放时间",
            key: "showtime",
            width: 200,
            sortable: true
          },
          {
            title: "游玩时长",
            key: "funTime",
            width: 200,
            sortable: true
          },
          {
            title: "适合年龄",
            key: "ageRange",
            width: 200,
            sortable: true
          },
          {
            title: "品牌",
            key: "brandName",
            width: 200,
            sortable: true
          },
          {
            title: "详细地址",
            key: "address",
            width: 300,
            sortable: true
          },
          {
            title: "注意事项",
            key: "notice",
            width: 100,
            sortable: true
          },
          {
            title: "内容描述",
            sortable: true,
            width: 300,
            key: "content"
          },
          {
            title: "无障碍设施安排",
            width: 260,
            key: "noteTypeCodeDesc"
          },
          {
            title: "创建时间",
            key: "createdTime",
            sortable: true
          },
          {
            title: "创建人员",
            key: "ownerName",
            width: 100,
            sortable: true
          },
          {
            title: "更新时间",
            key: "updatedTime",
            sortable: true
          },
          {
            title: "修改人员",
            key: "opUserName",
            width: 100,
            sortable: true
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
        this.tableList.query.cityId = newValue.fndCityId;
        this.findPage();
      },
      deep: true
    },
    "form.id": {
      handler(n, o) {
        console.log(this.vo,"rrrr")
        console.log(this.form.noteTypeCodes,"ttttttt")
        if (n) {
          this.cfg.tabActiveName = "form";
          if (this.form.pointDomain) {
            console.log("invoke", this.form.pointDomain);
            this.pointForm = { ...this.form.pointDomain };
            if (this.pointForm.tblAssetId && this.pointForm.assetUrl) {
              this.vo.assetDomainList = [
                { id: this.pointForm.tblAssetId, url: this.pointForm.assetUrl }
              ];
            } else {
              this.vo.assetDomainList = [];
            }
            if (this.pointForm.voiceAssetId && this.pointForm.voiceUrl) {
              this.vo.radio = [
                {
                  id: this.pointForm.voiceAssetId,
                  name: this.pointForm.fileName,
                  url: this.pointForm.voiceUrl
                }
              ];
              // console.log(this.vo.radio,'this.vo.radio');
            } else {
              this.vo.radio = [];
            }
            if (this.pointForm.tblBannerAssetId && this.pointForm.bannerUrl) {
              this.vo.bannerAsset = [
                {
                  id: this.pointForm.tblBannerAssetId,
                  url: this.pointForm.bannerUrl
                }
              ];
            } else {
              this.vo.bannerAsset = [];
            }
          }
        } else {
          this.resetForm();
        }
      }
    }
  },
  mounted() {
    this.findPage();
  },
  methods: {
    handleRemoveBanner(file) {
      if (file) {
        this.pointForm.tblBannerAssetId = null;
      }
    },
    handleRemovePic(file) {
      if (file) {
        this.pointForm.tblAssetId = null;
      }
    },
    handleRemoveRadio(file) {
      if (file) {
        this.pointForm.voiceAssetId = null;
      }
    },
    scenicChangeHandler(list) {
      console.log(list);
      if (list) {
        this.pointForm.tblScenicId = list.id;
        this.pointForm.lat = list.lat;
        this.pointForm.lng = list.lng;
        this.pointForm.cityId = list.cityId;
      } else {
        (this.pointForm.tblScenicId = null), (this.pointForm.lat = null);
        this.pointForm.lng = null;
      }
    },

    menuChangeHandler(id) {
      if (id) {
        this.pointForm.fndMenuId = id;
      } else {
        this.pointForm.fndMenuId = null;
      }
    },

    findPage() {
      // 获取列表数据
      this.$http
        .get("biz/Fun/list", { params: this.tableList.query })
        .then(rs => {
          if (rs.data.code == 0) {
            this.page.total = rs.data.data.total;
            rs.data.data.rows.forEach(r => {
              if (r.footTypeCodeDesc && r.footTypeCodeDesc instanceof Array) {
                r.footTypeCodeDesc = r.footTypeCodeDesc.join("、");
              }
            });
            this.tableList.data.rows = rs.data.data.rows;
          } else {
            this.page.total = 0;
            this.tableList.data.rows = [];
          }
        })
        .catch(() => {
          this.page.total = 0;
          this.tableList.data.rows = [];
        });
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return console.log("error submit!!");
        this.saveOrUpdate();
      });
    },
    saveOrUpdate() {
      if (this.formStatus && !this.form.id) return;
      this.formStatus = true;
      console.log("form data -> ", this.form);
      this.$http
        .post("biz/Fun/saveOrUpdate", this.form)
        .then(rs => {
          if (rs.data.code)
            return this.$message({
              type: "warning",
              message: "操作失败!"
            });

          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.resetForm();
          this.findPage();
        })
        .catch()
        .finally(() => {
          this.formStatus = false;
        });
    },
    // 项目表保存
    scenicPointForm() {
      this.$refs.pointForm.validate(valid => {
        if (!valid) return console.log("error submit!!");
        this.scenicPointSaveOrUpdate();
      });
    },
    scenicPointSaveOrUpdate() {
      if (this.formStatus && !this.form.id) return;

      // this.formStatus = true;
      this.pointForm.tableId = this.form.id;
      this.pointForm.tableName = "TBL_FUN";
      if (this.vo.assetDomainList.length > 0)
        this.pointForm.tblAssetId = this.vo.assetDomainList[
          this.vo.assetDomainList.length - 1
        ].id;
      if (this.vo.radio && this.vo.radio.length > 0) {
        this.pointForm.voiceAssetId = this.vo.radio[
          this.vo.radio.length - 1
        ].id;
      }
      if (this.vo.bannerAsset && this.vo.bannerAsset.length > 0) {
        this.pointForm.tblBannerAssetId = this.vo.bannerAsset[
          this.vo.bannerAsset.length - 1
        ].id;
      }
      console.log("point form -> ", this.pointForm);
      this.$http
        .post("biz/ScenicPoint/saveOrUpdate", this.pointForm)
        .then(rs => {
          if (rs.data.code)
            return this.$message({
              type: "warning",
              message: "操作失败!"
            });

          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.findPage();
          this.resetForme();
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => (this.formStatus = false));
    },

    resetForm() {
      this.form = { ...defForm };
      this.pointForm = { ...pointDefForm };
      this.cfg.tabActiveName = "form";
      this.vo.assetDomainList = [];
      this.vo.radio = [];
      this.vo.bannerAsset = [];
    },
    resetForme() {
      // this.form = {...defForm};
      this.pointForm = { ...pointDefForm };
      this.cfg.tabActiveName = "pointForm";
      this.vo.assetDomainList = [];
      this.vo.radio = [];
      this.vo.bannerAsset = [];
    },
    deleteData() {
      // 删除数据
      let data = [];
      this.tableList.selection.map(item => {
        data.push(item.id);
      });
      this.$confirm(`此操作将永久删除, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post("biz/Fun/remove", data)
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
      console.log("table selected -> ", val);
      this.tableList.selection = val;
      if (val.length) {
        this.form = val[0];
      } else {
        this.resetForm();
      }
    },
    handlePageSizeChange(val) {
      // 每页数量改变
      this.tableList.query.pageSize = val;
    },
    handlePageCurrentChange(val) {
      // 当前页改变
      this.tableList.query.pageNum = val;
    },
    handleMapClick(point) {
      console.log("map on click event -> ", point);
    },
    markerUpdateHandler(point) {
      console.log("markerUpdateHandler event -> ", point);
    },
    mapPonitUpdateHandler(point) {
      this.pointForm.lng = point.lng;
      this.pointForm.lat = point.lat;
      console.log("mapPonitUpdateHandler event -> ", point);
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/css/core/index";
@import "~@/assets/css/base-block";
</style>
