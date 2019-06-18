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
          <el-form ref="formSearch" :inline="true" v-model="tableList.query">
            <el-form-item prop="tblScenicId">
              <xyUdcRemote
                :currentValue="1"
                @xy-change="scenicSearch"
                url="biz/Scenic/findWithCondition"
                labelName="scenicName"
                valueName="id"
                placeholder="请选择景点"
              ></xyUdcRemote>
            </el-form-item>
            <el-form-item prop="search">
              <el-input v-model="tableList.query.search" clearable placeholder="输入标题查询"></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-button
                :disabled="tableList.query.cityId == ''"
                icon="el-icon-search"
                @click="findPage"
              >查询</el-button>
            </el-form-item> -->
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
          <template v-for="item in tableList.columns">
            <el-table-column
              v-if="item.img ===0" 
              :type="item.type"
              :fixed="item.fixed"
              :width="item.width || 150"
              :label="item.title"
              :sortable="item.sortable"
              :prop="item.key"
             
              :key="item.key"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column 
                v-else-if="item.img ===1" 
                :key="item.key" 
                :fixed="item.fixed"
                :width="item.width || 150"
                :prop="item.key" 
                :sortable="item.sortable"
                :show-overflow-tooltip="true"
                :label="item.title">
                <template slot-scope="scope" >
                  <!-- {{scope.row.assetDomain.url}} -->
　　　　            <img :src="scope.row.assetUrl" height="100%" width="100%" v-if="scope.row.assetUrl"/>
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
        <!-- <el-tab-pane label="添加广告信息" :disabled="!form.id"> -->
        <div slot="header" class="clearfix">
          <span class="el-icon-plus">添加广告信息</span>
        </div>
        <el-form label-position="top" ref="form" :model="form" :rules="ruleForm" label-width="80px">
          <el-form-item label="选择景点" prop="tblScenicId">
            <xyUdcRemote
              v-model="form.tblScenicId"
              :currentValue="form.tblScenicId"
              @xy-change="scenicChangeHandler"
              url="biz/Scenic/findWithCondition"
              labelName="scenicName"
              valueName="id"
              placeholder="请选择景点"
            ></xyUdcRemote>
          </el-form-item>
          <el-form-item label="选择项目" prop="tableName" v-if="form.tblScenicId">
            <el-select v-model="form.tableName" placeholder="请选择" clearable >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择点位" prop="ScenicPoint" v-if="form.tblScenicId && form.tableName">
            <xyPointSelect 
                    :form='form'
                    :currentValue="form.tblScenicPointId" 
                    labelName="itemName" 
                    valueName="pointId"
                    @xy-change="pointChangeHandler"
                    placeholder='请选择项目点位'>
            </xyPointSelect>
          </el-form-item>
          <el-form-item label="主图" prop="tblAssetId">
            <zzu-upload v-model="vo.assetDomainList" list-type="picture-card" @xy-remove="handleRemovePic" :limit='1'></zzu-upload>
            <div style="color:red">请上传尺寸为1053px宽 369px高的图片（宽高比为2.85）</div>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input clearable v-model="form.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <richText v-model="form.content" placeholder="请输入內容"></richText>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  icon="el-icon-plus" @click="submitForm" :disabled="!form.tblScenicId">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script type="text/babel">
// import {mapState} from 'vuex'

import zzuCitySelect from "@/components/city-select";
import zzuUdc from "@/components/udc";
import zzuUpload from "@/components/upload";
import xyUdcRemote from "@/components/xy-udc-remote";
import richText from "@/components/rich-text";
import xyPointSelect from "@/components/xy-point-select";

const defForm = {
  id: null,
  seq: 100,   
  tblScenicId: null,  //景点id
  scenicId:null,
  tblAssetId: null,   //主图id
  title: "",          //标题
  content: "",        //富文本
  tableName: "",      //四张表名
  tblScenicPointId:null  //点位id
};
export default {
  name: "userList",
  components: {
    zzuCitySelect,
    zzuUdc,
    xyUdcRemote,
    richText,
    zzuUpload,
    xyPointSelect
  },
  data() {
    return {
      options: [
        {
          value: "TBL_HOTEL",
          label: "酒店"
        },
        {
          value: "TBL_RESTAURANT",
          label: "餐厅"
        },
        {
          value: "TBL_FUN",
          label: "游玩"
        },
        {
          value: "TBL_STORE",
          label: "门店"
        }
      ],
      cfg: {
        formIcon: "plus",
        resetPwdBtn: true,
        delBtn: true,
        resetPwdModal: false
      },
      formStatus: false,
      form: { ...defForm },
      ruleForm: {
        tblScenicId: [
          { required: true, message: "请选择景点", trigger: "blur" }
        ],
       
        title:[
           { required: true, message: "请输入标题", trigger: "blur" }
        ],
      },
      vo: {
        assetDomainList: []
      },
      tableList: {
        title: "广告列表",
        query: {
          search: "", // 景点名称， 模糊查询
          cityId: "", // 景点所在城市
          pageNum: 1, // 第几页
          pageSize: this.$appCfg.paginationCfg.pageSize, // 每页数量
          sort: "id", // 主表字段名称
          order: "desc", // 正序还是倒序
          scenicId:null,
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
            img:0
          },
          {
            title: "标题",
            key: "title",
            sortable: true,
            width: 200,
            fixed: "left",
            img:0
          },
          {
            title: "banner图",
            key:'assetUrl',
            width: 150,
            sortable: true,
            img:1
          },
          {
            title: "创建时间",
            key: "createdTime",
            sortable: true,
            width: 200,
            img:0
          },
          {
            title: "创建人员",
            key: "ownerName",
            width: 200,
            sortable: true,
            img:0
          },
          {
            title: "更新时间",
            key: "updatedTime",
            sortable: true,
            width: 200,
            img:0
          },
          {
            title: "修改人员",
            key: "opUserName",
            width: 200,
            sortable: true,
            img:0
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
        if (n) {
          console.log("invoke", this.form);
          if (this.form.tblAssetId && this.form.assetUrl) {
            this.vo.assetDomainList = [ { id: this.form.tblAssetId, url: this.form.assetUrl }];
          } else {
            this.vo.assetDomainList = [];
          }
        } else {
          this.resetForm();
        }
      }
    },
    'form':{
       handler(newValue, oldValue) {
         if(newValue.tblScenicId){
            this.form.scenicId = newValue.tblScenicId;
            this.form.pointId = newValue.tblScenicPointId;
         }  
         if(newValue.tableName){
            this.form.tableName = newValue.tableName;
        }
        
      },
      deep: true
    }
  },
  mounted() {
    this.findPage();
  },
  methods: {
    scenicSearch(list){
      if(list){
        this.tableList.query.scenicId = list.id 
      }else{
        this.tableList.query.scenicId =null;
      }
    },
    pointChangeHandler(pointId) {
        if(pointId){
          this.form.tblScenicPointId = pointId; 
        }else{
          this.form.tblScenicPointId = null;
        }
    },
    handleRemovePic(file) {
      if (file) {
        this.form.tblAssetId = null;
      }
    },
    scenicChangeHandler(list) {
      if(list){
          this.form.tblScenicId = list.id;
      }else{
         this.form.tblScenicId = null;
      }
     
    },
    
    findPage() {
      // 获取列表数据
      this.$http
        .get("/biz/AdInst/list", { params: this.tableList.query })
        .then(rs => {
          if (rs.data.code == 0) {
            this.page.total = rs.data.data.total;
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
      if (this.formStatus) return;
      this.formStatus = true;
       if (this.vo.assetDomainList && this.vo.assetDomainList.length > 0) {
          this.form.tblAssetId = this.vo.assetDomainList [this.vo.assetDomainList.length - 1].id
        }
      // 更新或保存信息
      console.log("form data -> ", this.form);
      this.$http
        .post("biz/AdInst/saveOrUpdate", this.form)
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
          this.vo.assetDomainList=[]
          this.findPage();
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          this.formStatus = false;
        });
    },

    resetForm() {
      this.form = { ...defForm };
      this.vo.assetDomainList=[]
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
            .post("biz/AdInst/remove", data)
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
  }
};
</script>

<style lang="scss">
@import "~@/assets/css/core/index";
@import "~@/assets/css/base-block";
</style>
