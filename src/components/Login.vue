<template lang="pug">
  .ui.middle.aligned.center.aligned.grid: .column
    img#logo(src="http://www.zzumall.com/Public/Home/img/logo.png" alt="")
    h2 运营端后台管理系统
    Form.ui.large.form(@submit.native="onSubmit")
      FormItem: Input(placeholder="用户名" v-model="mobile" ref="mobile" autofocus)
        template(slot="prepend") 👤
      FormItem: Input(placeholder="密码" v-model="pwd" type="password")
        template(slot="prepend") 🔑
      Button(type="primary" native-type="submit" plain) 登 录
      Button(type="success" @click.native="pwdReset" plain) 重置密码
</template>

<script>
  import {Button, Form, FormItem, Input, Tag} from 'element-ui'

  export default {
    name: 'Login',
    components: {Form, Button, Tag, Input, FormItem},
    data() {
      return {
        mobile: '',
        pwd: ''
      }
    },
    methods: {
      onSubmit(e) {
        e.preventDefault()
        const payload = {
          mobile: this.mobile, pwd: this.pwd
        }
        this.$http.post('arch/User/login', payload)
          .then(rs => {
            if (rs.data.code == 0) {
              // let data = this.getUserInfo(rs.data.data.id)
              // data.then(rs => {
              //     console.log(rs)
              // })
              sessionStorage.setItem('user', JSON.stringify(rs.data.data))
              this.$store.commit("updateUserId", {userId : rs.data.data.id});
              this.$store.commit('updateMobile', {mobile : rs.data.data.mobile})
              this.$router.push({name: 'layout'})
            } else {
              this.$message({
                type: 'error',
                message: '登录失败，请检查用户名及密码'
              })
            }
          }).catch(error => {
          if (error && error.rs) {
            switch (error.rs.status) {
              case 401 :
                this.$message({
                  type: 'error',
                  message: '登录失败，请检查用户名及密码'
                });
            }
          } else {
            this.$message({
              type: 'error',
              message: '登录失败，连接服务器失败!'
            });
          }

        })
      },
      pwdReset() {
        this.$router.push({name: "pwdReset"})
      }
    }
  }
</script>

<style scoped>
  .ui {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url('../assets/image/login_bg.jpg');
  }

  #logo {
    /*width: 200px;*/
    width: 120px;
    margin: 20px 0 20px 0;
  }

  .grid {
    text-align: center;
    width: 100%;
    height: 100vh;
  }

  .column {
    background: rgba(255,255,255,0.9);
    border-radius: 5px;
    position: absolute;
    top: 280px;
    right: 50px;
    padding: 26px;
    max-width: 340px;
  }
  .ui.large.form{
    background: rgba(255,255,255,0.1);
  }

  a.tag {
    margin-left: 10px;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
  }

  h5 {
    margin-top: 20px;
  }
</style>

