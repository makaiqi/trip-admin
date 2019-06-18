<!--
	酒店房型信息增删改查
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
              <!-- <el-input clearable v-model="tableList.query.search" placeholder="酒店房型名称检索"></el-input> -->
              <zzu-udc
                v-model="tableList.query.search"
                :udc-code="formAddOrUpdate.roomCodeVal"
                placeholder="酒店房型名称检索"
              ></zzu-udc>
            </el-form-item>
            <el-form-item prop="cityId">
              <zzu-city-select v-model="tableList.query.cityId"></zzu-city-select>
            </el-form-item>
            <el-form-item prop="tHotelId">
              <zzu-hotel-select v-model="tableList.query.tHotelId"></zzu-hotel-select>
            </el-form-item>

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
            <!-- <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :key="item.key"  :show-overflow-tooltip="true">
            </el-table-column>-->
            <template v-for="(item,index) in tableList.columns">
              <el-table-column
                :key="index"
                v-if="item.key == 'breakfirst'"
                :fixed="item.fixed"
                :type="item.type"
                width="item.width || 150"
                :label="item.title"
                :sortable="item.sortable"
                :prop="item.key"
              >
                <template slot-scope="scope">{{ scope.row.breakfirst == "true" ? "是" : '否' }}</template>
              </el-table-column>
              <el-table-column
                :key="index"
                v-else-if="item.key == 'wideBand'"
                :fixed="item.fixed"
                :type="item.type"
                width="item.width || 150"
                :label="item.title"
                :sortable="item.sortable"
                :prop="item.key"
              >
                <template slot-scope="scope">{{ scope.row.wideBand == "true" ? "是" : '否' }}</template>
              </el-table-column>
              <el-table-column
                :key="index"
                v-else
                :type="item.type"
                :fixed="item.fixed"
                :width="item.width || 150"
                :label="item.title"
                :sortable="item.sortable"
                :prop="item.key"
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
          <el-form-item label="酒店名称" prop="tblHotelId">
            <zzu-hotel-select
              v-model="formAddOrUpdate.tblHotelId"
              :city-id="formAddOrUpdate.cityId"
              placeholder="酒店名称"
            ></zzu-hotel-select>
          </el-form-item>

          <el-form-item label="酒店房型" prop="roomCode">
            <zzu-udc
              v-model="formAddOrUpdate.roomCode"
              :udc-code="formAddOrUpdate.roomCodeVal"
              placeholder="酒店房型"
            ></zzu-udc>
          </el-form-item>

          <el-form-item label="图片" prop="assetDomainList">
            <zzu-upload
              v-model="formAddOrUpdate.assetDomainList"
              list-type="picture-card"
              :limit="1"
            ></zzu-upload>
            <div style="color:red">请上传尺寸为1500px宽 580px高的图片（宽高比为2.6）</div>
          </el-form-item>
          <el-form-item label="参考价格" prop="price">
            <el-input clearable v-model="formAddOrUpdate.price" placeholder="参考价格"></el-input>
          </el-form-item>
          <el-form-item label="可入住人数" prop="peopleNumber">
            <el-input clearable v-model="formAddOrUpdate.peopleNumber" placeholder="可入住人数"></el-input>
          </el-form-item>
          <el-form-item label="房间面积(平方)" prop="roomArea">
            <el-input clearable v-model="formAddOrUpdate.roomArea" placeholder="房间面积"></el-input>
          </el-form-item>
          <el-form-item label="早餐" prop="breakfirst">
            <el-switch v-model="formAddOrUpdate.breakfirst"></el-switch>
          </el-form-item>
          <el-form-item label="宽带" prop="wideBand">
            <el-switch v-model="formAddOrUpdate.wideBand"></el-switch>
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

import zzuMap from "@/components/map";
import zzuUdc from "@/components/udc";
import zzuCitySelect from "@/components/city-select";
import zzuHotelSelect from "@/components/hotel-select";
import zzuUpload from "@/components/upload";
import zzuUploadDrage from "@/components/upload-drage";
import zzuHotelRoomSelect from "@/components/hotel-room-select";

export default {
  name: "userList",
  components: {
    zzuMap,
    zzuUdc,
    zzuCitySelect,
    zzuHotelSelect,
    zzuUpload,
    zzuUploadDrage,
    zzuHotelRoomSelect
  },
  data() {
    return {
      timePicker: "",
      cfg: {
        formTitle: "添加酒店房型",
        formIcon: "plus",
        resetPwdBtn: true,
        delBtn: true,
        resetPwdModal: false
      },
      formSearch: {
        hotelName: "",
        cityId: ""
      },
      formStatus: false,
      formAddOrUpdate: {
        id: "",
        tblHotelId: "",
        cityId: "",
        price: "",
        peopleNumber: "",
        roomCode: "",
        roomCodeDesc: "",
        roomCodeVal: "UDC_M03_T10",
        breakfirst: false,
        wideBand: false,
        assetDomainList: [],
        hotelName: "",
        address: "",
        tHotelId: "",
        roomArea: ""
      },
      ruleAddOrUpdate: {
        tblHotelId: [
          { required: true, message: "请选择酒店", trigger: "blur" }
        ],
        roomCode: [
          { required: true, message: "请选择酒店房型名称", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入参考价格", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (/^\+?[1-9]+[0-9]*$/.test(value)) {
                callback();
              } else {
                callback(new Error("请输入数字格式的价格"));
              }
            },
            trigger: "blur"
          }
        ],
        peopleNumber: [
          { required: true, message: "请输入入住人数", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (/^\+?[1-9]+[0-9]*$/.test(value)) {
                callback();
              } else {
                callback(new Error("请输入入住人数"));
              }
            },
            trigger: "blur"
          }
        ]
      },
      tableList: {
        title: "酒店房型列表",
        query: {
          search: "", // 酒店名称， 模糊查询
          cityId: "", // 酒店所在城市
          tHotelId: "",
          pageNum: 1, // 第几页
          pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
          sort: "id", // 主表字段名称
          order: "desc", // 正序还是倒序
          roomCode: ""
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
            title: "房型名称",
            key: "roomCodeDesc",
            fixed: "left",
            sortable: true
          },
          {
            title: "酒店名称",
            key: "hotelName",
            sortable: true
          },
          {
            title: "酒店地址",
            width: 320,
            key: "address",
            sortable: true
          },

          {
            title: "参考价格",
            key: "price",
            sortable: true
          },
          {
            title: "房间面积(平方)",
            key: "roomArea",
            sortable: true
          },
          {
            title: "早餐",
            key: "breakfirst"
          },
          {
            title: "宽带",
            key: "wideBand",
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
        this.findPage();
      },
      deep: true
    },
    "tableList.selection"(newValue, oldValue) {
      if (newValue.length > 0) {
        for (let obj in this.formAddOrUpdate) {
          if (obj == "assetDomainList") {
            this.formAddOrUpdate[obj] = newValue[0][obj];
          } else if (obj == "breakfirst" || obj == "wideBand") {
            this.formAddOrUpdate[obj] =
              newValue[0][obj] == "true" ? true : false;
          } else {
            this.formAddOrUpdate[obj] = newValue[0][obj];
          }
        }
        this.formAddOrUpdate.roomCodeVal = "UDC_M03_T10";
      } else {
        this.resetForm();
      }
    },
    timePicker(newValue, oldValue) {}
  },
  mounted() {
    this.findPage();
  },
  methods: {
    findPage() {
      this.$http
        .get(`/biz/HotelRoom/list`, {
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
      // 更新或保存信息
      this.$http
        .post("/biz/HotelRoom/saveOrUpdate", formAddOrUpdate)
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
        } else if (obj == "breakfirst" || obj == "wideBand") {
          this.formAddOrUpdate[obj] = false;
        } else if (obj == "roomCodeVal" || obj == "bedCodeVal") {
          this.formAddOrUpdate[obj] = "UDC_M03_T10";
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
            .post("/biz/HotelRoom/remove", query)
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
      // console.log(val)
      this.tableList.query.pageNum = val;
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/css/core/index";
@import "~@/assets/css/base-block";
</style>
