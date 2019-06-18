<!--
	内容新增与修改
 -->

<template>
	<div class="base-block-add">
		<el-form ref="form" :rules="ruleAddOrUpdate" label-position="right" label-width="80px" :model="formAddOrUpdate">
      <el-form-item label="标题" prop="title">
        <el-input clearable v-model="formAddOrUpdate.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="subtitle">
        <el-input clearable v-model="formAddOrUpdate.subtitle" placeholder="副标题"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="typeId">
        <zzu-product-associated @obtain="obtain" typeCode="V003" :tTypeIdList="tTypeIdList"></zzu-product-associated>

      </el-form-item>
      <el-form-item label="主图" prop="tAssertId">
        <zzu-upload :limit="1" list-type="picture-card" v-model="imgArr"></zzu-upload>
        <div  style="color:red">请上传尺寸为428px宽 400px高的图片（宽高比为1）</div>
      </el-form-item>
      <el-form-item label="副图" prop="assetIdList">
        <zzu-upload :limit="1" list-type="picture-card" v-model="subImg"></zzu-upload>
        <div  style="color:red">请上传尺寸为1500px宽 750px高的图片（宽高比为2）</div>
      </el-form-item>
      <!--<el-form-item label="关键词" prop="keyword">-->
        <!--<el-input v-model="formAddOrUpdate.keyword" placeholder="关键词"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="标签" prop="tagDomainList">
        <zzu-tag-list v-model="formAddOrUpdate.tagDomainList" tag-type="discover" name="tagName"></zzu-tag-list>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input clclearable v-model="formAddOrUpdate.author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item label="是否上架" prop="isOnline">
        <el-switch v-model="formAddOrUpdate.isOnline"></el-switch>
      </el-form-item>

      <el-form-item label="是否攻略" prop="isStrategy">
        <el-switch v-model="formAddOrUpdate.isStrategy"></el-switch>
      </el-form-item>

      <template v-if="formAddOrUpdate.isStrategy">
        <el-form-item label="城市" prop="areaId">
          <zzu-city-select v-model="formAddOrUpdate.areaId"></zzu-city-select>
        </el-form-item>
        <el-form-item label="景点" prop="scenicIdList">
          <zzu-scenic-select multiple="multiple" v-model="formAddOrUpdate.scenicIdList" :city-id="formAddOrUpdate.areaId"></zzu-scenic-select>
        </el-form-item>
        <el-form-item label="酒店" prop="hotelIdList">
          <zzu-hotel-select multiple="multiple" v-model="formAddOrUpdate.hotelIdList" :city-id="formAddOrUpdate.areaId"></zzu-hotel-select>
        </el-form-item>
        <el-form-item label="商品" prop="storeIdList">
          <zzu-store-select multiple="multiple" v-model="formAddOrUpdate.storeIdList" :city-id="formAddOrUpdate.areaId"></zzu-store-select>
        </el-form-item>
      </template>

      <el-form-item label="文章内容" prop="content">
        <zzu-rich-text v-model="formAddOrUpdate.content" placeholder="文章内容"></zzu-rich-text>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-add" type="primary" @click="submitForm">提交</el-button>
        <el-button icon="el-icon-back" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>

<script type="text/babel">
  import zzuRichText from '@/components/rich-text'
  import zzuTagList from '@/components/tag-list'
  import zzuCitySelect from '@/components/city-select'
  import zzuScenicSelect from '@/components/scenic-select'
  import zzuHotelSelect from '@/components/hotel-select'
  import zzuStoreSelect from '@/components/store-select'
  import zzuUpload from '@/components/upload'
  import zzuUdcCategories from '@/components/product-categories'
  import zzuProductAssociated from '@/components/product-associated'

	export default {
		name: "contentAddOrUpdate",
		components: {
			zzuRichText, zzuTagList, zzuCitySelect, zzuScenicSelect, zzuHotelSelect, zzuStoreSelect, zzuUpload,zzuUdcCategories,zzuProductAssociated
		},
		data () {
			return {
        imgArr: [],
        subImg: [],
        tTypeIdList: [],
				id: this.$route.query.id,
        formAddOrUpdate: {
          id: this.$route.query.id,
          title: '',
          subtitle: '',
          typeId: '',
          typeIdVal: '',
       		tAssertId: '',
       		author: '',
       		keyword: '',
          tag: '',
          tagDomainList: [],
       		isOnline: false,
          isStrategy: false,
          areaId: '', // 城市
          scenicIdList: [], // 景点列表
          hotelIdList: [], // 酒店列表
          storeIdList: [], // 商品列表
       		content: '',
          assetDomainList: [{id:""}],
          assetIdList:''
        },
        ruleAddOrUpdate: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          typeId: [
            {required: true, message: '请输入类型', trigger: 'blur'}
          ],
          tAssertId: [
            {required: true, message: '请上传主图', trigger: 'blur'}
          ],
          assetIdList: [
            {required: true, message: '请上传副图', trigger: 'blur'}
          ],
          // keyword: [
          //   {required: true, message: '请上传关键词', trigger: 'blur'}
          // ],
          // author: [
          //   {required: true, message: '请选择作者', trigger: 'blur'}
          // ],
          areaId: [
            {required: true, message: '请选择城市', trigger: 'blur'}
          ],
          scenicIdList: [
            {required: true, message: '请选择景点', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请填写文章内容', trigger: 'blur'}
          ]
        },
			}
		},
    watch: {
      imgArr (newValue, oldValue) {
        if(newValue.length > 0) {
          this.formAddOrUpdate.tAssertId = newValue[0].id;
        } else {
          this.formAddOrUpdate.tAssertId = '';
        }
      },
      subImg (newValue, oldValue) {
        console.log(newValue)
        if(newValue && newValue.length > 0) {
          this.formAddOrUpdate.assetDomainList[0].id = newValue[0].id;
          this.formAddOrUpdate.assetIdList = newValue[0].id;
        } else {
          this.formAddOrUpdate.assetDomainList[0].id = '';
          this.formAddOrUpdate.assetIdList = ''
        }
      }
    },
		mounted () {
      if(this.id) {
        this.fetchData();
      }
		},
		methods: {
			fetchData () {
				// 更新或保存信息
        this.$http.get(`biz/Content/findById`,
          {
            params: {
              id: this.id
            }
          }).then(rs => {
          console.log(rs)

          if(rs.data.code == 0) {
            this.formAddOrUpdate = rs.data.data;
            console.log(rs.data.data)
            if(rs.data.data.tAssertId) {
              this.imgArr = [rs.data.data.assetDomain];
            }
            if(rs.data.data.assetDomainList) {
              this.subImg = [rs.data.data.assetDomainList[0]];
            }
            // 不让assetDomainList的值被改变，不然取不到ID
            this.formAddOrUpdate.assetDomainList = [{id:""}]

            this.$http.get('biz/Type/findTypeTreeById', {
              params: {
                typeId: this.formAddOrUpdate.typeId,
                typeCode: "V003"
              }
            }).then(res =>{
              this.tTypeIdList = res.data.data
            })


          } else {

          }
        }).catch();
			},
			submitForm () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 更新或保存信息
            this.$http.post('biz/Content/saveOrUpdate',
              this.formAddOrUpdate
            ).then(rs => {
              if(rs.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                if(!this.formAddOrUpdate.id) {
                  this.resetForm();
                }
                this.$router.push({ name: 'fndContentList' })
              } else {
                this.$message({
                  type: 'success',
                  message: '操作失败!'
                });
              }
            }).catch();
          } else {
            this.$message({
              type: 'success',
              message: '请填写完整数据!'
            });
          }
        })
			},
      resetForm() {
        this.formAddOrUpdate =  {
          id: '',
          title: '',
          subtitle: '',
          typeId: '',
          typeIdVal: '',
          tAssertId: '',
          author: '',
          keyword: '',
          tag: '',
          tagDomainList: [],
          isOnline: false,
          isStrategy: false,
          areaId: '', // 城市
          scenicIdList: [], // 景点列表
          hotelIdList: [], // 酒店列表
          storeIdList: [], // 商品列表
          content: ''
        };
      },
      obtain (val) {
        if (val.length != 0) {
			    this.formAddOrUpdate.typeId = val[val.length-1]
        }
      },
			goBack () {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';
</style>
