<!--
	景点信息增删改查
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
              <el-input clearable v-model="tableList.query.search" placeholder="景点名称检索"></el-input>
            </el-form-item>
            <el-form-item>
              <zzu-city-select v-model="tableList.query.fndCityId"></zzu-city-select>
            </el-form-item>

            <el-form-item>
              <!-- <el-button type="primary" icon="el-icon-search" @click="findPage">搜索</el-button> -->
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
            <template v-for="item in tableList.columns">
              <el-table-column 
                v-if="item.key=='pointErWeima'"
                :type="item.type"
                :fixed="item.fixed"
                :width="item.width || 150"
                :label="item.title"
                :sortable="item.sortable"
                :prop="item.key"
                :key="item.key"
                :show-overflow-tooltip="true"
                >
               <template slot-scope="scope">
                  <div>
                    <el-button type="text"  @click="downLoad(scope.row)">点击下载</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :type="item.type"
                :fixed="item.fixed"
                :width="item.width || 150"
                :label="item.title"
                :sortable="item.sortable"
                :prop="item.key"
                :key="item.key"
                :show-overflow-tooltip="true"
              ></el-table-column>
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
          <el-form-item label="景点名称" prop="scenicName">
            <el-input clearable v-model="formAddOrUpdate.scenicName" placeholder="景点名称"></el-input>
          </el-form-item>
          <el-form-item label="景点级别" prop="scenicType">
            <el-select v-model="formAddOrUpdate.scenicLevel" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <zzu-udc clearable v-model="formAddOrUpdate.scenicTypeCode" udc-code="UDC_M03_T34" placeholder="景点级别" @xy-secnic="handlerSecnicChange"></zzu-udc> -->
          </el-form-item>
          <el-form-item label="图片" prop="assetDomainList">
            <zzu-upload v-model="formAddOrUpdate.assetDomainList" list-type="picture-card"></zzu-upload>
            <div style="color:red">请上传尺寸为670px宽 387px高的图片（宽高比为1.72）</div>
          </el-form-item>
          <el-form-item label="城市" prop="cityName">
            <zzu-city-select
              v-model="formAddOrUpdate.cityName"
              placeholder="城市"
              @xy-change="handlerCityChange"
            ></zzu-city-select>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input
              clearable
              v-model="formAddOrUpdate.address"
              placeholder="请输入详细地址或点击地图选址"
              :city="formAddOrUpdate.cityName"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <gaode-map v-model="formAddOrUpdate" ></gaode-map>
          </el-form-item>-->
          <el-form-item label="地图位置" name="second" v-if="flag">
            <xy-amap
              :point="formAddOrUpdate"
              @xy-click="handleMapClick"
              @xy-marker-dragend="markerUpdateHandler"
              @xy-point-update="mapPonitUpdateHandler"
              v-if="flag"
            />
          </el-form-item>
          <el-form-item label="选择菜单" prop="bundleIds">
            <xyBundleSelect
              :currentValue="formAddOrUpdate.bundleIds"
              labelName="bundleName"
              valueName="id"
              url='/biz/Bundle/findAll'
              :params ='cfg.bundleParams'
              :multiple="cfg.multiple"
              @xy-change="menuChangeHandler"
              placeholder="请选择菜单"
            ></xyBundleSelect>
          </el-form-item>
          <el-form-item label="景点简介" prop="introduction">
            <el-input
              clearable
              v-model="formAddOrUpdate.introduction"
              placeholder="景点简介"
              autosize
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="建议游玩时间" prop="suggestTime">
            <el-input clearable v-model="formAddOrUpdate.suggestTime" placeholder="建议游玩时间"></el-input>
          </el-form-item>
          <el-form-item label="最佳游玩时间" prop="bestPlayTime">
            <el-input clearable v-model="formAddOrUpdate.bestPlayTime" placeholder="最佳游玩时间"></el-input>
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
import { mapState } from "vuex";
import zzuUdc from "@/components/udc";
import zzuCitySelect from "@/components/city-select";
import zzuScenicSelect from "@/components/scenic-select";
import zzuTimePicker from "@/components/time-picker";
import zzuUpload from "@/components/upload";
import xyBundleSelect from "@/components/xy-bundle-select";
// import GaodeMap from  '@/components/xy-map'
import XyAmap from "../../components/xy-amap";
export default {
  name: "userList",
  components: {
    zzuCitySelect,
    zzuScenicSelect,
    zzuTimePicker,
    zzuUpload,
    zzuUdc,
    XyAmap, //  地图,
    xyBundleSelect
    // GaodeMap
  },
  data() {
    let self = this;
    return {
      options: [
        {
          value: 1,
          label: "1A"
        },
        {
          value: 2,
          label: "2A"
        },
        {
          value: 3,
          label: "3A"
        },
        {
          value: 4,
          label: "4A"
        },
        {
          value: 5,
          label: "5A"
        }
      ],

      flag: 0,
      cfg: {
        formTitle: "添加景点",
        formIcon: "plus",
        resetPwdBtn: true,
        delBtn: true,
        resetPwdModal: false,
        multiple: true,
        bundleParams:{}
      },
      formStatus: false,
      formAddOrUpdate: {
        id: "",
        addressId: "",
        scenicName: "",
        scenicType: "",
        scenicTypeCode: "",
        fndCityId: "",
        bundleIds: [],  //菜单分类id
        cityName: "",
        areaId: 1,
        address: "",
        centerLng: "",
        centerLat: "",
        lng: "",
        lat: "",
        shortAddress: "",
        introduction: "",
        suggestTime: "",
        bestPlayTime: "",
        scenicLevel: "",
        scenicLevelName: "",
        assetDomainList: []

        // opUserId:'',
        // ownerId:'',
        // isDelete:'',
        // createdTime:'',
        // updatedTime:'',
        // beginTime:'',
        // endTime:'',
        // fndAddressId:'',
        // fndCityId:'',
        // fndAreaId:'',

        // leftTopLng:'',
        // leftTopLat:'',
        // rightBottomlng:'',
        // rightBottomLat:'',
        // centerLng:'',
        // centerLat:'',
      },
      ruleAddOrUpdate: {
        scenicName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        assetDomainList: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        fndCityId: [{ required: true, message: "请输入城市", trigger: "blur" }],
        address: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ],
       
      },
      tableList: {
        title: "城市列表",
        query: {
          search: "", // 景点名称， 模糊查询
          cityId: "", // 景点所在城市
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
            fixed: "left"
          },
          {
            title: "景点名称",
            key: "scenicName",
            width: 150,
            fixed: "left",
            sortable: true
          },
           {
            title: "景点二维码",
            key: "pointErWeima",
            width: 100,
            fixed: "left",
          },
          {
            title: "城市",
            width: 90,
            key: "cityName",
            sortable: true
          },
          {
            title: "地址",
            width: 250,
            key: "address",
            sortable: true
          },
          {
            title: "景点级别",
            key: "scenicLevelName",
            sortable: true
          },
          {
            title: "景点简介",
            width: 300,
            key: "introduction",
            sortable: false
          },
          {
            title: "建议游玩时间",
            key: "suggestTime",
            sortable: true
          },
          {
            title: "最佳游玩时间",
            key: "bestPlayTime",
            sortable: true
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
    "tableList.selection"(newValue, oldValue) {
      if (newValue.length > 0) {
        for (let obj in this.formAddOrUpdate) {
          if (obj == "assetDomainList") {
            this.formAddOrUpdate[obj] = newValue[0][obj];
          } else {
            this.formAddOrUpdate[obj] = newValue[0][obj];
          }
        }
      } else {
        this.resetForm();
      }
    },
    "formAddOrUpdate.centerLng": {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.formAddOrUpdate.lng = newValue;
        }
      },
      deep: true
    },
    "formAddOrUpdate.centerLat": {
      handler: function(newValue, oldValue) {
        console.log();
        if (newValue) {
          this.formAddOrUpdate.lat = newValue;
        }
      },
      deep: true
    },
    "formAddOrUpdate.cityName": {
      handler(newValue, oldValue) {
        if (newValue) {
          this.flag = 1;
        } else {
          this.flag = 0;
        }
      },
      deep: true
    },
    'formAddOrUpdate.bundleIds'(newValue, oldValue){
        this.formAddOrUpdate.bundleIds= newValue || [];
      },
  },
  mounted() {
    this.findPage();
  },
  methods: {
    handlerCityChange(list) {
      if (list[0]) {
        this.formAddOrUpdate.cityName = list[0].name; //获取选中的城市
        this.formAddOrUpdate.fndCityId = list[0].id;
        this.formAddOrUpdate.centerLng = list[0].lng;
        this.formAddOrUpdate.centerLat = list[0].lat;
        this.formAddOrUpdate.lat = list[0].lat;
        this.formAddOrUpdate.lng = list[0].lng;
      }
    },
    handlerSecnicChange(data) {
      // console.log(data,'000000');
      this.formAddOrUpdate.scenicLevel = data.id;
    },
    findPage() {
      this.$http
        .get(`biz/Scenic/list`, {
          params: this.tableList.query
        })
        .then(rs => {
          if (rs.data.code == 0) {
            this.page.total = rs.data.data.total;
            this.tableList.data.rows = rs.data.data.rows;
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
        .post("biz/Scenic/saveOrUpdate", data)
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
        .catch();
    },
    resetForm(data) {
      for (let obj in this.formAddOrUpdate) {
        if (obj == "assetDomainList") {
          this.formAddOrUpdate[obj] = [];
        } else {
          this.formAddOrUpdate[obj] = "";
        }
      }
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
            .post("biz/Scenic/remove", query)
            .then(rs => {
              if (rs.data.code == 0) {
                this.findPage();
                this.$message({
                  type: "success",
                  message: rs.data.msg
                });
              } else if(rs.data.code == 200) {
                this.findPage();
                this.$message({
                  type: "warning",
                  message: rs.data.msg
                });
              }else{
                this.$message({
                  type: "fail",
                  message: rs.data.msg
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
    },
    menuChangeHandler(id){
      console.log(id,'id')
        this.formAddOrUpdate.bundleIds = id || [];
      },
    handleMapClick(point) {
      console.log("map on click event -> ", point);
      this.formAddOrUpdate.lng = point.lng;
      this.formAddOrUpdate.lat = point.lat;
    },
    markerUpdateHandler(point) {
      console.log("markerUpdateHandler event -> ", point);
    },
    mapPonitUpdateHandler(point) {
      this.formAddOrUpdate.centerLng = point.lng;
      this.formAddOrUpdate.centerLat = point.lat;
      this.formAddOrUpdate.lng = point.lng;
      this.formAddOrUpdate.lat = point.lat;
      console.log("mapPonitUpdateHandler event -> ", point);
    },
    downLoad(item){
     
     let actions = item.avatarUrl;
    
      if(actions == null){ 
         actions = '';
      }
      window.location.href = this.$appCfg.http.baseURL+'/ma/common/createQrCode?scenicId='+item.id+'&title='+item.scenicName+'&logoPath='+actions;
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/css/core/index";
@import "~@/assets/css/base-block";

.base-block-right {
  width: 400px;
}
</style>
