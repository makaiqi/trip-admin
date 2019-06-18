<!-- 
	邮件发送
 -->

<template>
	<div class="base-block-add">
		<el-form ref="formAddOrUpdate" label-position="right" label-width="80px" :rules="ruleAddOrUpdate" :model="formAddOrUpdate">
      <el-form-item label="收件人" prop="to">
        <zzu-email-tag v-model="formAddOrUpdate.to" :disabled="true"></zzu-email-tag>
        <!-- <el-input v-model="formAddOrUpdate.to[0]" readOnly=true placeholder="收件人"></el-input> -->
      </el-form-item>
      <el-form-item label="抄送" prop="cc">
        <zzu-email-tag v-model="formAddOrUpdate.cc"></zzu-email-tag>
      </el-form-item>
      <el-form-item label="发件人" prop="from">
        <zzu-email-tag v-model="formAddOrUpdate.from" :disabled="true"></zzu-email-tag>
        <!-- <el-input v-model="formAddOrUpdate.from" readOnly placeholder="发件人"></el-input> -->
      </el-form-item>
      <el-form-item label="密件抄送" prop="bcc">
        <zzu-email-tag v-model="formAddOrUpdate.bcc"></zzu-email-tag>
        <!-- <el-input v-model="formAddOrUpdate.bcc" placeholder="密件抄送"></el-input> -->
        <!-- <span class="tips">邮箱地址以 ; 隔开</span> -->
      </el-form-item>
      <el-form-item label="标题" prop="subject">
        <el-input v-model="formAddOrUpdate.subject" placeholder="标题"></el-input>
      </el-form-item>

<!--       <el-form-item label="附件" prop="attacheFiles">
        <zzu-upload v-model="formAddOrUpdate.attacheFiles" placeholder="附件"></zzu-upload>
      </el-form-item> -->

      <el-form-item label="正文" prop="text">
        <zzu-rich-text v-model="formAddOrUpdate.text" placeholder="正文"></zzu-rich-text>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-add" type="primary" @click="submitForm('formAddOrUpdate')">发送</el-button>
        <el-button icon="el-icon-back" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>

<script type="text/babel">
	import zzuRichText from '@/components/rich-text'
  import zzuUpload from '@/components/upload'
  import zzuEmailTag from '@/components/email-tag'

	export default {
		name: "contentAddOrUpdate",
		components: {
			zzuRichText, zzuUpload, zzuEmailTag
		},
    props: {
      // to: {
      //   type: Array,
      //   default: []
      // }
    },
		data () {
			return {
				id: this.$route.query.id,
				formAddOrUpdate: {
          from: ['zhangzhongyou@zzumall.com'],
          to: [],
          cc: [],
          bcc: [],
          attacheFiles: [],
          subject: '',
          text: ''
        },
        ruleAddOrUpdate: {
          subject: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          text: [
            {required: true, message: '请输入正文', trigger: 'blur'}
          ]
        },
			}
		},
		created () {
      // this.formAddOrUpdate.to = this.to;
		},
		methods: {
			submitForm (formName) {
				// 更新或保存信息
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = this.deepCopy(this.formAddOrUpdate);

            data.from = this.formAddOrUpdate.from[0];

            console.log(data, this.formAddOrUpdate)

            this.$http.post('test/sendAttachMail',
              data
              ).then(rs => {
                if(rs.data.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '发送成功!'
                  });
                } else {
                  this.$message({
                    type: 'error',
                    message: '发送失败!'
                  });
                }
              }).catch(this.$message({
                    type: 'error',
                    message: '发送失败!'
                  }));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
			},
			goBack () {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  @import '~@/assets/css/base-block';

</style>
