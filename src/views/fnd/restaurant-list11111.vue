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
          <el-form ref="formSearch" :inline="true">
            <el-form-item>
              <el-input clearable v-model="tableList.query.search" placeholder="请输入餐厅名称"></el-input>
            </el-form-item>
            <el-form-item>
              <zzu-city-select v-model="tableList.query.cityId" placeholder="请选择城市名"></zzu-city-select>
            </el-form-item>
            <!-- <el-form-item>
              <el-button :disabled="tableList.query.cityId == ''" icon="el-icon-search" @click="findPage">查询</el-button>
            </el-form-item> -->
            <el-form-item>
              <el-button :disabled="tableList.selection.length == 0" icon="el-icon-delete" @click="deleteData">删除</el-button>
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
            <el-table-column :type="item.type" :fixed="item.fixed" :width="item.width || 150" :label="item.title" :sortable="item.sortable" :prop="item.key" v-for="item in tableList.columns" :key="item.key"  :show-overflow-tooltip="true">
            </el-table-column>
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
      <el-card >
        <el-tabs type="border-card">
        <!-- <div slot="header" class="clearfix">
          <span class="el-icon-plus">{{ cfg.formTitle }}</span>
          <el-button type="primary" @click="qiehuan(0)">{{ cfg.formTitle }}</el-button>
          <el-button type="primary" @click="qiehuan(1)">选点</el-button>
        </div> -->
        <el-tab-pane label="添加餐厅">
        <el-form label-position="top" ref="formLeft" :model="formAddOrUpdate" :rules="ruleAddOrUpdate" label-width="80px">
          <el-form-item label="餐厅名称" prop="restaurantName">
            <el-input clearable v-model="formAddOrUpdate.restaurantName" placeholder="餐厅名称"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brandName">
            <zzu-brand-select v-model="formAddOrUpdate.tblBrandId" placeholder="品牌"></zzu-brand-select>
          </el-form-item>
           <!-- <el-form-item label="所在城市" prop="cityId">
            <zzu-city-select v-model="formAddOrUpdate.fndCityId" placeholder="请选择城市名"></zzu-city-select>
          </el-form-item>
          <el-form-item label="区县" prop="areaId">
            <zzu-city-select :pid="formAddOrUpdate.fndCityId" v-model="formAddOrUpdate.fndAreaId"
                             placeholder="区县"></zzu-city-select>
          </el-form-item> 
          <el-form-item label="详细地址" prop="address">
            <el-input clearable v-model="formAddOrUpdate.address" placeholder="详细地址"></el-input>
          </el-form-item>  -->
          <el-form-item label="电话" prop="tel">
            <el-input clearable v-model="formAddOrUpdate.tel" placeholder="电话"></el-input>
          </el-form-item>
           <el-form-item label="营业时间" prop="openTime">
            <el-input clearable v-model="formAddOrUpdate.openTime" placeholder="营业时间"></el-input>
          </el-form-item> 
           <el-form-item label="价格范围" prop="priceRange">
            <el-input clearable v-model="formAddOrUpdate.priceRange" placeholder="价格范围"></el-input>
          </el-form-item>
          <el-form-item label="人均消费" prop="perPrice">
            <el-input clearable v-model="formAddOrUpdate.perPrice" placeholder="人均消费"></el-input>
          </el-form-item>
          <el-form-item label="菜式" prop="footTypeCode">
            <zzu-udc v-model="formAddOrUpdate.footTypeCodes" multiple="multiple" :udc-code="vo.footAmenitiesCodeVal" placeholder="菜式"></zzu-udc>
          </el-form-item>
           <el-form-item label="美食体验" prop="foodExperience">
            <el-input clearable v-model="formAddOrUpdate.foodExperience" placeholder="美食体验"></el-input>
          </el-form-item>
           <el-form-item label="餐厅介绍" prop="content">
            <el-input clearable v-model="formAddOrUpdate.content" placeholder="餐厅介绍" autosize type="textarea"></el-input>
          </el-form-item>
         <!--  <el-form-item label="地址" prop="map">
            <zzu-map v-model="mapData"></zzu-map>
          </el-form-item>
          <el-form-item label="经度" prop="lng">
            <el-input clearable :readonly="true" v-model="formAddOrUpdate.lng" placeholder="经度"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input clearable :readonly="true" v-model="formAddOrUpdate.lat" placeholder="纬度"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="短地址" prop="shortAddress">
            <el-input clearable v-model="formAddOrUpdate.shortAddress" placeholder="短地址"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="submitAddOrUpdate('formLeft')">保存</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('formAddOrUpdate')">重置</el-button>
          </el-form-item>
        </el-form>
        </el-tab-pane>

        <el-tab-pane label="项目选点" :disabled="!formAddOrUpdate.id">
            <el-form label-position="top" ref="formRight" :model="pointForm" :rules="rulePointForm"
                     label-width="80px">
              <el-form-item label="选择景点" prop="tblScenicId">
                <xyUdcRemote :currentValue="pointForm.tblScenicId" @xy-change="scenicChangeHandler"
                             url="biz/Scenic/findWithCondition" labelName="scenicName" valueName="id" placeholder='请选择景点'></xyUdcRemote>
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input clearable v-model="pointForm.address" placeholder="点击地图标记选址"></el-input>
              </el-form-item> 
              <el-form-item v-if="pointForm.tblScenicId">
                <gaode-map v-model="pointForm"></gaode-map>
              </el-form-item>
              <el-form-item label="标题" prop="title"> 
                <el-input clearable v-model="pointForm.title" placeholder="请输入标题"></el-input>
              </el-form-item> 
              <el-form-item label="简述" prop="summary">
                <el-input clearable v-model="pointForm.summary" placeholder="简单介绍"></el-input>
              </el-form-item>
              <el-form-item label="图片" prop="tblAssetId">
                <zzu-upload v-model="vo.assetDomainList" list-type="picture-card" :limit="1"></zzu-upload>
                <div style="color:red">请上传尺寸为670px宽 387px高的图片（宽高比为1.72）</div>
              </el-form-item>
              <el-form-item label="音频" prop="tAssertVoiceId">
                <zzu-upload v-model="vo.radio" :limit="1" list-type="text" :disabled="!formAddOrUpdate.id"></zzu-upload>
                <!-- <div style="color:red">123123</div> --> 
              </el-form-item>
              <el-form-item label="选择菜单" prop="fndMenuId">
                <xyMenuSelect :currentValue="pointForm.fndMenuId" v-model="pointForm.fndMenuId" labelName="menuName" valueName="id" :multiple='cfg.multiple'  @xy-change="menuChangeHandler" placeholder='请选择菜单'></xyMenuSelect>
              </el-form-item>
              <el-form-item  label="内容" prop="content">
                <richText v-model="pointForm.content" placeholder="请输入內容"></richText>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-plus" @click="scenicPointSaveOrUpdate()">保存
                </el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
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

  import zzuCitySelect from '@/components/city-select'
  import zzuUdc from '@/components/udc'
  import zzuMap from '@/components/map'
  import zzuBrandSelect from '@/components/brand-select'
  import zzuUpload from '@/components/upload'
  import GaodeMap from  '@/components/xy-map'
  // import xyAmap from  '@/components/xy-amap'
  import xyUdcRemote from  '@/components/xy-udc-remote'
  import richText from '@/components/rich-text'
  import xyMenuSelect from '@/components/xy-menu-select'

  const defForm = {
      id: null,
      // addressId: '',
      // fndAddressId:'',
      tblBrandId: '',
      brandName: '',
      openTime: '',
      priceRange:'',
      perPrice:'',
      foodExperience:'',
      footTypeCodes:[],
      footAmenitiesCodeVal:'UDC_M03_T12',
      content:'',
      restaurantName: '',
      // fndCityId: '',
      // areaId: '',
      // address: '',
      lng: '',
      lat: '',
      tel: '',
      // fndAreaId: '',
      // shortAddress: '',
      // cityName:'',
      footTypeCodeDesc:'',
      pointDomain: {}
    }

    const pointDefForm = {
      centerLat:'',//中心纬度
      centerLng:'',//中心经度
      lng:'',			//经度
      lat:'',			//纬度
      tableName:'TBL_RESTAURANT',	//业务表名
      tableId:null,		//业务表id   关键字
      // cityId:null,		//城市id
      tblScenicId:null,	//景区id
      fndAddressId:null,//地址表id
      address:'',		//详细地址,
      fndMenuId:null,	//菜单id  下拉选选菜单
      tblAssetId:null,	//资源id   上传图片
      voiceAssetId:null,	//语音资源id  
      tAssertVoiceId:null,  
      title:'',		//标题
      summary:'',		//简述
      content:'',	//内容   富文本
        
    }

  export default {
    name: "userList",
    components: {
      zzuCitySelect, zzuUdc, zzuMap, zzuBrandSelect, zzuMap,GaodeMap,xyUdcRemote,richText,xyMenuSelect,zzuUpload
      //  zzuMap, zzuUdc, zzuUpload, zzuCitySelect, zzuBrandSelect, zzuUploadDrage
    },
    data() {
      return {
        // flag:0,
        // xianshi:0,
        // options: [{
        //   value: '',
        //   label: ''
        // }],
        mapData: {
          lng: '',
          lat: ''
        },
        cfg: {
          // formTitle: '添加餐厅',
          formIcon: 'plus',
          resetPwdBtn: true,
          delBtn: true,
          resetPwdModal: false,
          pointTableName: 'TBL_RESTAURANT',//业务表名
          flag: false,
          multiple:false
        },
        formStatus: false,
       
        // 餐厅表单
        formAddOrUpdate: {...defForm},
        pointForm: {...pointDefForm},
        ruleAddOrUpdate: {
          tblScenicId: [
            {required: true, message: '请选择景点', trigger: 'blur'}
          ],
          restaurantName: [
            {required: true, message: '请输入餐厅名称', trigger: 'blur'}
          ],
          // fndCityId: [
          //   {required: true, message: '请选择所在城市', trigger: 'blur'}
          // ],
          // address: [
          //   {required: true, message: '请输入详细地址', trigger: 'blur'}
          // ],
           footTypeCodes: [
            {required: true, message: '请选择菜式', trigger: 'blur'}
          ],
           tel: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {
              validator: (rule, value, callback) => {
                if (/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/.test(value)) {
                  callback();
                } else {
                  callback(new Error("请输入正确的电话号码"));
                }
              }, trigger: 'blur'
            }
          ],
        },
         rulePointForm: {
          title: [
            {required: true, message: '标题必填项', trigger: 'blur'}
          ]
        },
         vo: {
          assetDomainList: [],
          footAmenitiesCodeVal: 'UDC_M03_T12',
          radio:[]
        },
        tableList: {
          title: "餐厅列表",
          query: {
          	cityId: '',
            search: '',
            pageNum: 1,
            pageSize: this.$appCfg.paginationCfg.pageSize,
            sort: 'id',
            order: 'desc'
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
            }, {
              title: '餐厅名称',
              key: 'restaurantName',
              width: 300,
              fixed: 'left',
              sortable: true
            },{
              title: '品牌',
              key: 'brandName',
              width:200,
              sortable: true
            },
            //  {
            //   title: '所在城市',
            //   key: 'cityName',
            //   width: 100,
            //   sortable: true
            // }, {
            //   title: '详细地址',
            //   key: 'address',
            //   width: 300,
            //   sortable: true
            // },
            {
              title: '电话',
              key: 'tel',
              width: 100,
              sortable: true
            }, 
            // {
            //   title: '短地址',
            //   key: 'shortAddress',
            //   sortable: true
            // },
            {
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
            },
             {
              title: "餐厅介绍",
              sortable: true,
              width: 300,
              key: 'content'
            },
             {
              title: '菜式',
              width: 260,
              key: 'footTypeCodeDesc',
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
        handler (newValue, oldValue) {
          this.findPage();
        },
        deep: true
      },
       'pointForm.tblScenicId'(newValue, oldValue) {
          if (newValue) {
            this.pointForm.tblScenicId = newValue;
          } else {
            this.pointForm.tblScenicId = null;
          }
      },
      'pointForm.fndMenuId': {
        handler(newValue, oldValue) {
          if (newValue) {
            this.pointForm.fndMenuId = newValue;
          } else {
            this.pointForm.fndMenuId = null;
          }
        },
        deep: true
      },
      'vo.assetDomainList':{
          handler(newValue, oldValue) {
          if (newValue.length>0) {
            // console.log(newValue ,'新图');
            this.pointForm.tblAssetId = newValue[0].id;
          } else {
            this.pointForm.tblAssetId = null;
          }
        },
        deep: true
      },
      'vo.radio':{
          handler(newValue, oldValue) {
          if (newValue.length>0) {
            // console.log(newValue ,'新图');
            this.pointForm.tAssertVoiceId = newValue[0].id;
          } else {
            this.pointForm.tAssertVoiceId = null;
          }
        },
        deep: true
      },
      // 'tableList.selection'(newValue, oldValue) {
      //   if (newValue.length > 0) {
      //     for (let obj in this.formAddOrUpdate) {
      //       if (obj == "hotelAmenitiesCodes") {
      //         this.formAddOrUpdate[obj] = newValue[0][obj] || []
      //       } else {
      //         this.formAddOrUpdate[obj] = newValue[0][obj]
      //       }
      //     }
      //     this.formAddOrUpdate.hotelAmenitiesCodeVal = 'UDC_M03_T15'
      'tableList.selection'(newValue, oldValue) {
        if (newValue.length > 0) {
          this.saveOrUpdate = newValue[0];

          console.log( newValue[0].id,'newValue[0].id');
          if (this.saveOrUpdate.pointDomain && this.saveOrUpdate.pointDomain.tblAssetId) {
            this.pointForm = this.saveOrUpdate.pointDomain
            this.vo.assetDomainList = [{id: this.pointForm.tblAssetId, url: this.pointForm.assetUrl}];
            this.vo.radio = [{id: this.pointForm.tAssertVoiceId}];
            // console.log(newValue[0].id);
          } else {
            this.vo.assetDomainList = [];
            this.vo.radio = [];
            
          }
          this.pointForm.tableId  = newValue[0].id;
        } else {
          this.resetForm();
          this.vo.assetDomainList = [];
          this.vo.radio = [];
          this.pointForm.tableId  = null;
        }
      },
      mapData: {
        handler: function(newValue, oldValue) {
          // console.log(newValue);
          if(newValue.lng) {
            this.formAddOrUpdate.lng = newValue.lng
            this.formAddOrUpdate.lat = newValue.lat
          }
        },
        deep: true
      }
    },
    mounted () {
      this.findPage();
    },
    methods: {
      // scenicChangeHandler(v){
      //   if(v!=0){
      //     this.xianshi=1;
      //   }else{
      //     this.xianshi=0;
      //   }
      //   this.formAddOrUpdate.scenicPointForm.tblScenicId = v.id;
      //   this.formAddOrUpdate.scenicPointForm.centerLat = v.centerLat;
      //   this.formAddOrUpdate.scenicPointForm.centerLng = v.centerLng;
      // },
      // qiehuan(x){
      //   this.flag =x;
      // },
      scenicChangeHandler(list) {
        if(list){
          this.pointForm.tblScenicId = list.id;
          this.pointForm.centerLat = list.centerLat;
          this.pointForm.centerLng = list.centerLng;
        }else{
          this.pointForm.tblScenicId = null,
          this.pointForm.centerLat = null;
          this.pointForm.centerLng = null;
        }
          
      },

       menuChangeHandler(id){
        if(id){
          this.pointForm.fndMenuId = id;
        }else{
          this.pointForm.fndMenuId = null;
        }
      
      },

      findPage() {
        // 获取列表数据
        this.$http.get('biz/Restaurant/list',
           { params: this.tableList.query }
          ).then(rs => {
            if(rs.data.code == 0) {
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
        let data = this.saveOrUpdateAddress(formAddOrUpdate);
        // 更新或保存信息
        this.$http.post('biz/Restaurant/saveOrUpdate',
          data
          ).then(rs => {
            this.formStatus = false;
            if(rs.data.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.flag=1;
              this.resetForm();
              this.findPage();
              this.formAddOrUpdate.id = rs.data.data.id;
              this.pointForm.tableId = rs.data.data.id;
            } else {
              // this.flag=0;
              this.$message({
                type: 'success',
                message: '操作失败!'
              });
            }
          }).catch();
      },
         // 项目表保存
      scenicPointSaveOrUpdate () {
        // console.log(this.scenicPointForm);
        if(this.formStatus) return;
        this.formStatus = true;
        this.pointForm.tableName = this.cfg.pointTableName;
        this.$http.post('biz/ScenicPoint/saveOrUpdate',
          this.pointForm
          ).then(rs => {
            // console.log('rs',rs);
            this.formStatus = false;
            if(rs.data.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
                
              });
              // this.flag=1;
              this.findPage();
              this.resetForm();
              
            } else {
              // this.flag=0;
              this.$message({
                type: 'fail',
                message: '操作失败!'
              });
            }
          }).catch();
      },
      
      resetForm() {
        // 重置输入框
        // for (let obj in this.formAddOrUpdate) {
        //   this.formAddOrUpdate[obj] = '',
        //   formAddOrUpdate[obj] = 'UDC_M03_T12'
        // }
        //  for (let obj in this.formAddOrUpdate) {
        //     if (obj == "foodTypeCode") {
        //       this.formAddOrUpdate[obj] = newValue[0][obj] || []
        //     } else {
        //       this.formAddOrUpdate[obj] = newValue[0][obj]
        //     }
        //   }
        //   this.formAddOrUpdate.foodAmenitiesCodeVal = 'UDC_M03_T12'
        // let formAddOrUpdate = {};
        // for (let obj in this.formAddOrUpdate) {
        //   if (obj == "footTypeCode") {
        //     formAddOrUpdate[obj] = []
        //   } else if (obj == 'footAmenitiesCodeVal') {
        //     formAddOrUpdate[obj] = 'UDC_M03_T12'
        //   } else {
        //     formAddOrUpdate[obj] = ''
        //   }
        // }
        // this.formAddOrUpdate = formAddOrUpdate;
        this.formAddOrUpdate = {...defForm}
        this.pointForm = {...pointDefForm}
      },
      deleteData() {
        // 删除数据
        let data = [];
        this.tableList.selection.map(item => {
          data.push(item.id);
        });
        this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('biz/Restaurant/remove',
            data
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
        // table选中改变
        this.formAddOrUpdate = val[0];
        this.tableList.selection = val.sort(function (a, b) {
          
          return a.id > b.id;
        });
      },
      handlePageSizeChange(val) {
        // 每页数量改变
        this.tableList.query.pageSize = val;
      },
      handlePageCurrentChange(val) {
        // 当前页改变
        this.tableList.query.pageNum = val;
      }
    }
  }
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
