<!--
	密码找回
 -->

<template>
  <div class="reset-pwd-wrap">
    <div class="pwd-reset">
      <h1>密码重置</h1>
      <el-form :model="form" status-icon :rules="formRule" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model.number="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="identifyingCode">
          <el-input maxlength="6" minlength="6"	 v-model.number="form.identifyingCode">
            <div class="code" slot="suffix" @click="getCode">{{ code.status ? code.currentNum + 's' : code.content }}</div>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="form.pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="password" v-model="form.checkPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>

	export default {
		name: "pwdReset",
		data () {
			return {
				code: {
					status: false,
					content: "获取验证码",
					currentNum: 10,
					initNum: 10,
					countDownNum: '',
					speed: 1000,
					numEnd: 0
				},
				form: {
					mobile: "", //  手机号
					identifyingCode: "", // 验证码。
					pwd: "", // 密码
					checkPwd: "" // 确认密码
				},
				formRule: {
					mobile:[
            {required: true, message: '请输入电话号码', trigger: 'blur'}
            // {required: true, type: 'regexp', pattern: /(\+\d+)?1[34578]\d{9}$/, message: '请输入电话号码', trigger: 'blur'}
          ],
          identifyingCode:[
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          pwd:[
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          checkPwd:[
            {required: true, message: '请选择确认密码', trigger: 'blur'}
          ]
				}
			}
		},
		watch: {
			'code.currentNum' (newValue, oldValue) {
				if(newValue == 0) {
					window.clearInterval(this.code.countDownNum);
					this.code.status = false;
					this.code.currentNum = this.code.initNum;
				}
			}
		},
		methods: {
			countDown () {
				this.code.countDownNum = setInterval(() => {
					if(this.code.currentNum > this.code.numEnd) {
						this.code.currentNum--;
					} else {
						window.clearInterval(this.code.countDownNum);
					}
				}, this.code.speed)
			},
			getCode () {
				if(/(\+\d+)?1[34578]\d{9}$/.test(this.form.mobile)) {
					if(this.code.status) {
						return
					} else {
						this.code.status = true;
						this.countDown();
					}

					this.$http.post('biz/Member/sendSms',
						{
							templateCode: "SMS_130550102",
							phoneNumbers: this.form.mobile, // 手机号
							signName: "掌中游"
						}).then(rs => {
							if(rs.data.code == 0) {
								this.$message("发送成功")
							} else {
								this.$message("发送失败")
							}
						})
				} else {
					this.$message("电话号码格式不正确")
				}
			},
			submitForm (form) {
				this.$refs[form].validate((valid) => {
          if (valid) {
            if(this.form.pwd != this.form.checkPwd) {
							this.$message("两次密码不一致")
							return
						}
						this.$http.post('arch/User/findPwd',
							this.form
							).then(rs => {
								if(rs.data.code == 0) {
									this.$message("修改成功")
								} else {
									this.$message("修改失败")
								}
							})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
			},
			cancelForm (form) {
				this.$router.push({ name: 'login' })
			}
		}
	}
</script>

<style lang="scss">
  @import '~@/assets/css/core/index';
  .reset-pwd-wrap{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url('../../assets/image/login-bg_4.jpg');
  }
	.pwd-reset {
    position: absolute;
    border-radius: 5px;
    position: absolute;
    top: 280px;
    right: 50px;
		max-width: 400px;
		margin: 0 auto;
    background: rgba(255,255,255,0.9);
    padding: 20px 30px 20px 20px;
    border-radius: 5px;
		h1  {
			text-align: center;
			margin-bottom: 20px;
		}
	}

	.code {
		position: absolute;
		top: 0;
		right: -6px;
		width: 6em;
		color: #fff;
		background-color: #ccc;
		border-radius: 0 6px 6px 0;
		z-index: 10;
	}
</style>

