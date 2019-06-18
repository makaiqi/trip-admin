<template>
	<div class="image-add">
		<div class="image-add-content">
			<!--<zzu-upload></zzu-upload>-->
			<el-form>
				<el-form-item label="首图" required>
					<zzu-upload :limit="1" v-model="tAssetId" list-type="picture-card" :disabled="disabled"></zzu-upload>
          <div  style="color:red">建议上传800*800的图片（335px以上 宽高1:1）</div>
				</el-form-item>
				<el-form-item label="详情页Banner图片(双击以删除图片，单击查看图片，可拖拽调整图片位置，从左到右依次排序)" required>

				</el-form-item>
        <div>
          <zzu-upload-drage :limit="5" v-model="ruleForm.assetDomainList" multiple :disabled="disabled"></zzu-upload-drage>
          <div  style="color:red">请上传尺寸为1500px宽 860px高的图片（宽高比为1.72）最多上传5张</div>
        </div>

			</el-form>
		</div>
	</div>
</template>

<script>
	import zzuUploadDrage from '@/components/upload-drage'
	import zzuUpload from '@/components/upload'
	import upload from '../../test/zzu-upload'
	export default {
		components: {
			zzuUpload,
			upload,
      zzuUploadDrage
		},
		data () {
			return {
			  disabled: false,
      	listId: this.$route.query.id,
      	tAssetId: [],
				ruleForm: {
          tAssetId: '',
          assetDomainList: []
				}
			}
		},
		watch: {
			ruleForm:{
				handler(val, oldval){
					this.$emit('imgList', this.ruleForm);
				},
				deep:true
			},
			tAssetId (newValue, oldValue) {
    		if(newValue && newValue.length > 0) {
    		  console.log(newValue)
    			this.ruleForm.tAssetId = newValue[0].id || newValue[1].id
          console.log(this.ruleForm.tAssetId)
    		} else {
    			return this.ruleForm.tAssetId = ""
    		}
    	}
		},
    created() {
      this.disabled = this.$route.query.disabled
    },
		mounted () {
			if(this.listId)	this.fetchData();
		},
		methods: {
			fetchData () {
				this.$http.get('/store/Product/findById', {
						params : { //请求参数
				      id: this.listId
				    }
					}).then(res => {
						if(res.data.code==0){
						  if (res.data.data && res.data.data.assetDomain) {
                this.tAssetId = [res.data.data.assetDomain]
              } else {
                this.tAssetId = []
              }
              this.ruleForm.tAssetId = res.data.data.tAssetId
							this.ruleForm.assetDomainList = res.data.data.assetDomainList
							this.$emit('imgList',this.ruleForm);
						}
					})
			}
		}
	}
</script>

<style>
</style>
