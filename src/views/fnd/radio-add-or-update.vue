<!--
	音频新增与修改
 -->

<template>
  <div class="base-block-add">
    <el-form
      ref="form"
      :rules="ruleAddOrUpdate"
      label-position="right"
      label-width="80px"
      :model="formAddOrUpdate"
    >
      <el-form-item
        label="标题"
        prop="title"
      >
        <el-input
          clearable
          v-model="formAddOrUpdate.title"
          placeholder="标题"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="副标题"
        prop="subtitle"
      >
        <el-input
          clearable
          v-model="formAddOrUpdate.subtitle"
          placeholder="副标题"
        ></el-input>
      </el-form-item>
       <el-form-item label="是否上架" prop="isOnline">
        <el-switch v-model="formAddOrUpdate.isOnline"></el-switch>
      </el-form-item>
      <!-- <el-form-item label="类别" prop="typeId">
        <zzu-product-associated @obtain="obtain" typeCode="V003" :tTypeIdList="tTypeIdList"></zzu-product-associated>

      </el-form-item> -->
      <el-form-item
        label="主图"
        prop="tAssertId"
      >
        <zzu-upload
          :limit="1"
          list-type="picture-card"
          v-model="imgArr"
        ></zzu-upload>
        <div style="color:red">请上传尺寸为300px宽 300px高的图片（宽高比为1）</div>
      </el-form-item>
     
      <el-form-item label="音频"  prop="tAssertVoiceId">
        <zzu-upload :limit="1" list-type="text" v-model="radio"></zzu-upload>
        <!-- <div style="color:red">123123</div> -->
      </el-form-item>

      <el-form-item
        label="作者"
        prop="author"
      >
        <el-input
          clclearable
          v-model="formAddOrUpdate.author"
          placeholder="作者"
        ></el-input>
      </el-form-item>
       <el-form-item label="关键词" prop="keyword">
        <el-input v-model="formAddOrUpdate.keyword" placeholder="关键词"></el-input>
       </el-form-item>
     
          <el-form-item
          label="城市"
          prop="areaId"
        >
          <zzu-city-select v-model="formAddOrUpdate.areaId"></zzu-city-select>
        </el-form-item>

         <el-form-item label="景点" prop="tScenicId">
          <zzu-scenic-select :multiple='false' v-model="formAddOrUpdate.tScenicId" :city-id="formAddOrUpdate.areaId"></zzu-scenic-select>
        </el-form-item>


      <el-form-item
        label="文章内容"
        prop="content"
      >
        <zzu-rich-text
          v-model="formAddOrUpdate.content"
          placeholder="文章内容"
        ></zzu-rich-text>
      </el-form-item>

      <el-form-item>
        <el-button
          icon="el-icon-add"
          type="primary"
          @click="submitForm"
        >提交</el-button>
        <el-button
          icon="el-icon-back"
          @click="goBack"
        >返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/babel">
import zzuRichText from "@/components/rich-text";
import zzuTagList from "@/components/tag-list";
import zzuCitySelect from "@/components/city-select";
import zzuScenicSelect from "@/components/scenic-select";
import zzuHotelSelect from "@/components/hotel-select";
import zzuStoreSelect from "@/components/store-select";
import zzuUpload from "@/components/upload";
import zzuUdcCategories from "@/components/product-categories";
import zzuProductAssociated from "@/components/product-associated";

export default {
  name: "radioAddOrUpdate",
  components: {
    zzuRichText,
    zzuTagList,
    zzuCitySelect,
    zzuScenicSelect,
    zzuHotelSelect,
    zzuStoreSelect,
    zzuUpload,
    zzuUdcCategories,
    zzuProductAssociated
  },
  data() {
    return {
      imgArr: [],
    //   subImg: [],
      radio: [],
    //   tTypeIdList: [],
      id: this.$route.query.id,
      formAddOrUpdate: {
        id: this.$route.query.id,
        title: "",
        subtitle: "",
        // typeId: "",
        // typeIdVal: "",
        tAssertId: "",
        author: "",
        keyword: "",
        tag: "",
        // tagDomainList: [],
        isOnline: false,
        // isStrategy: false,
        areaId: "", // 城市
        tScenicId: [], // 景点列表
        // hotelIdList: [], // 酒店列表
        // storeIdList: [], // 商品列表
        content: "",
        // assetDomainList: [{ id: "" }],
        // assetIdList: "",
        tAssertVoiceId:''
      },
      ruleAddOrUpdate: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        subtitle: [{ required: true, message: "请输入副标题", trigger: "blur" }],
        tAssertId: [{ required: true, message: "请上传主图", trigger: "blur" }],
        // assetIdList: [
        //   { required: true, message: "请上传副图", trigger: "blur" }
        // ],
         tAssertVoiceId: [
          { required: true, message: "请上传音频", trigger: "blur" }
        ],
        keyword: [
          {required: true, message: '请上传关键词', trigger: 'blur'}
        ],
        // author: [
        //   {required: true, message: '请选择作者', trigger: 'blur'}
        // ],
        areaId: [{ required: true, message: "请选择城市", trigger: "blur" }],
        tScenicId: [
          { required: true, message: "请选择景点", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请填写文章内容", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    imgArr(newValue, oldValue) {
      if (newValue.length > 0) {
        this.formAddOrUpdate.tAssertId = newValue[0].id;
      } else {
        this.formAddOrUpdate.tAssertId = "";
      }
    },
    radio(newValue, oldValue) {
      console.log(newValue);
      if ( newValue.length > 0) {
        this.formAddOrUpdate.tAssertVoiceId = newValue[0].id;
        // this.formAddOrUpdate.assetIdList = newValue[0].id;
      } else {
        this.formAddOrUpdate.tAssertVoiceId = "";
        // this.formAddOrUpdate.assetIdList = "";
      }
    }
  },
  mounted() {
    if (this.id) {
      this.fetchData();
    }
  },
  methods: {
    fetchData() {
      // 更新或保存信息
      this.$http
        .get(`deal/Content/${this.id}`)
        .then(rs => {
          console.log(rs);

          if (rs.data.code == 0) {
            this.formAddOrUpdate = rs.data.data;
            console.log(rs.data.data);
            if (rs.data.data.tAssertId) {
              this.imgArr = [rs.data.data.assetDomain];
            }
            if (rs.data.data.tAssertVoiceId) {
              this.radio = [rs.data.data.assetVoiceDomain];
            }
            // 不让assetDomainList的值被改变，不然取不到ID
            // this.formAddOrUpdate.assetDomainList = [{ id: "" }];

            this.$http
              .get("biz/Type/findTypeTreeById", {
                params: {
                //   typeId: this.formAddOrUpdate.typeId,
                  typeCode: "V003"
                }
              })
              .then(res => {
                // this.tTypeIdList = res.data.data;
              });
          } else {
          }
        })
        .catch();
    },
    submitForm() {
        console.log(this.formAddOrUpdate,'hresetetet')
      this.$refs["form"].validate(valid => {
        if (valid) {
          // 更新或保存信息
          this.$http
            .post("deal/Content/saveOrUpdate", this.formAddOrUpdate)
            .then(rs => {
                console.log(rs,'hres')
              if (rs.data.code == 0) {
                this.$message({
                  type: "success",
                  message: "操作成功!"
                });
                if (!this.formAddOrUpdate.id) {
                  this.resetForm();
                }
                this.$router.push({ name: "fndRadioList" });
              } else {
                this.$message({
                  type: "success",
                  message: "操作失败!"
                });
              }
            })
            .catch();
        } else {
          this.$message({
            type: "success",
            message: "请填写完整数据!"
          });
        }
      });
    },
    resetForm() {
      this.formAddOrUpdate = {
        id: "",
        title: "",
        subtitle: "",
        // typeId: "",
        // typeIdVal: "",
        tAssertId: "",
        author: "",
        keyword: "",
        tag: "",
        // tagDomainList: [],
        isOnline: false,
        // isStrategy: false,
        areaId: "", // 城市
        tScenicId: [], // 景点列表
        // hotelIdList: [], // 酒店列表
        // storeIdList: [], // 商品列表
        content: "",
        tAssertVoiceId:''
      };
    },
    // obtain(val) {
    //   if (val.length != 0) {
    //     this.formAddOrUpdate.typeId = val[val.length - 1];
    //   }
    // },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/core/index";
@import "~@/assets/css/base-block";
</style>
