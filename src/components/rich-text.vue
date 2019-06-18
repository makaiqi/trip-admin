<!--
	富文本
 -->

<template>
  <div>
    <quill-editor class="quill-editor" :style="{ height: height + 'px' }" v-model="currentValue"
                  ref="quillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)">
    </quill-editor>
    <el-upload class="upload-demo" :action="photoUrl" :before-upload='beforeUpload' :data="uploadData" :on-success='upScuccess'
               :on-change="onUpload" ref="upload" style="display:none" :multiple="true">
      <el-button size="small" type="primary" id="imgInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script type="text/babel">
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: "richText",
    components: {
      quillEditor
    },
    props: {
      value: String,
      height: {
        type: Number,
        default: 400
      },
      modCode: {
        type: String, // UDC_M00_T01
        default: 'UDC_M00_T01'
      },
      enabled: {
        type: Boolean,
        default: true
      },
    },
    data () {
      return {
        currentValue: this.value === undefined ? '' : this.value,
        count: 0,
        editorOption: {
          placeholder: "请输入内容"
        },
        photoUrl: 'http://upload-z1.qiniup.com',
        uploadData: {
          token: ''
        },
        uploadType : '',    // 上传的文件类型（图片、视频）
        fullscreenLoading : false
      }
    },
    watch: {
      'value' (newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue' (newValue, oldValue) {
        this.$emit('input', newValue);
      }
    },
    // 页面加载后执行 为编辑器的图片图标和视频图标绑定点击事件
    mounted() {
      if(this.value) {
        let value = this.value;
        this.$nextTick(() => {
          this.setCurrentValue(value)
        })
      }
      // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      this.$refs.quillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler)
      this.$refs.quillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
    },
    methods: {
      setCurrentValue(value) {
        // 设置当前值
        if (value === this.currentValue) return;

        this.currentValue = value;
        this.$emit('change', value);
      },
      onEditorBlur (data) {
        // console.log(data)
      },
      onEditorReady (data) {
        // console.log(data)
      },
      // 图片上传前获得数据token数据
      qnUpload(file) {
        // console.log(file)
        this.fullscreenLoading = true
        const suffix = file.name.split('.')
        const ext = suffix.splice(suffix.length - 1, 1)[0]
        // console.log(this.uploadType)
        if (this.uploadType === 'image') {  // 如果是点击插入图片
          return new Promise((resolve, reject) => {
            this.$http.post('biz/Asset/upToken').then(rs => {
              if (rs.data.code == 0) {
                this.uploadData.token = rs.data.data
                resolve(file)
              } else reject()
            }).catch(e => reject(e))
          })
        } else if (this.uploadType === 'video') {  // 如果是点击插入视频
          return new Promise((resolve, reject) => {
            this.$http.post('biz/Asset/upToken').then(rs => {
              if (rs.data.code == 0) {
                this.uploadData.token = rs.data.data
                resolve(file)
              } else reject()
            }).catch(e => reject(e))
          })
        }
      },

      // 图片上传之前调取的函数
      beforeUpload(file) {
       // console.log('before upload',arguments, arguments.length)
        return this.qnUpload(file)
      },

      // 图片上传成功回调   插入到编辑器中
      upScuccess(e, file, fileList) {
        // console.log('up success')
        // console.log(file,e,fileList)
        this.fullscreenLoading = false
        this.count++
        if (this.count == fileList.length) {
          this.count = 0
          let vm = this
          let urlList = []
          for (let i=0;i<fileList.length;i++) {
            urlList.push(this.$appCfg.fileUrl + '/' + fileList[i].response.hash)
          }
          urlList.reverse()
          for (let j=0;j<urlList.length;j++) {
            let url = urlList[j]
            if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
              let value = url
              vm.addRange = vm.$refs.quillEditor.quill.getSelection()
              value = value.indexOf('http') !== -1 ? value : 'http:' + value
              vm.$refs.quillEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value)   // 调用编辑器的 insertEmbed 方法，插入URL
            } else {
              this.$message.error(`${vm.uploadType}插入失败`)
            }
          }
          this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
        }
      },
      onUpload (file, fileList) {
        // console.log('onUpload',file,fileList)
        if(!file.response || !file.response.hash) {
          return;
        }
        let data = {
          fsize: file.size,
          keyName: file.name, // 文件名
          hash: file.response && file.response.hash,
          ext: file.raw.type, // 后缀名
          bucket: '', //
          url: this.$appCfg.fileUrl + '/' + file.response.hash, //
          modCode: 'UDC_M00_T01', // UDC_M00_T01
          assertDesc: '' // 资源描述
        }
        this.postData(data)
      },
      // 点击图片ICON触发事件
      imgHandler(state) {
        this.addRange = this.$refs.quillEditor.quill.getSelection()
        if (state) {
          let fileInput = document.getElementById('imgInput')
          fileInput.click() // 加一个触发事件
        }
        this.uploadType = 'image'
      },

      // 点击视频ICON触发事件
      videoHandler(state) {
        // console.log(1)
        this.addRange = this.$refs.quillEditor.quill.getSelection()
        if (state) {
          let fileInput = document.getElementById('imgInput')
          fileInput.click() // 加一个触发事件
        }
        this.uploadType = 'video'
      },

      // 编辑器光标离开 将编辑器内容发射给父组件
      onEditorBlur(editor) {
        this.$emit('getValue', this.content)
      },

      // 编辑器获得光标
      onEditorFocus(editor) {
        editor.enable(this.enabled)   // 实现达到上限字符可删除
      },

      // 编辑器文本发生变化
      onEditorChange({ editor, html, text }) {
        let textLength = text.length
        if (textLength > 10000) {
          any>this.$message.error('最多输入10000个字符')
          editor.enable(false)
        }
        this.$emit('getValue', this.content)
      },
      // 图片上传成功后把一些数据传给后台
      postData (data) {
        this.$http.post('biz/Asset/saveOrUpdate',
          data
        ).then(rs => {
          if (rs.data.code == 0) {
            // console.log(rs)
            // this.currentValue.push(
            //   {
            //     id: rs.data.data,
            //     name: file.response.hash,
            //     url: this.$appCfg.fileUrl + '/' + file.response.hash
            //   }
            // );
          } else {
            this.$message({
              type: 'error',
              message: '文件上传失败'
            });
          }
        }).catch()

      }
    }
  }
</script>

<style lang="scss" type="text/css" scoped>
  .quill-editor {
    margin-bottom: 150px;
  }
</style>
