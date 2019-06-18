<!--
	图片上传
 	七牛云
 -->

<template>
  <div>
    <div class="el-upload__tip">{{ placeholder }}</div>

    <el-upload
      v-if="listType == 'picture'"
      class="upload-demo"
      :action="url"
      :data="uploadData"
      :multiple="multiple"
      :limit="limit"
      :drag="drag"
      :disabled="disabled"
      :before-upload="beforeUploadHandler"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :file-list="currentValue"
      :on-change="onUpload"
      :on-success="onSuccess"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <template v-else-if="listType == 'picture-card'">
      <el-upload
        ref="pic"
        :action="url"
        list-type="picture-card"
        :data="uploadData"
        :multiple="multiple"
        :limit="limit"
        :drag="drag"
        :disabled="disabled"
        :before-upload="beforeUploadHandler"
        :on-change="onUpload"
        :on-success="onSuccess"
        :on-preview="handlePreview"
        :on-exceed="handleExceed"
        :file-list="currentValue"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" v-if="!audio" :src="dialogImageUrl" alt="">
      </el-dialog>
    </template>

    <el-upload
      v-else
      class="upload-demo"
      :data="uploadData"
      :action="url"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :multiple="multiple"
      :limit="limit"
      :before-upload="beforeUploadHandler"
      :on-change="onUpload"
      :on-success="onSuccess"
      :on-exceed="handleExceed"
      :file-list="currentValue"
      :disabled="disabled">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <el-dialog :visible.sync="previewer.visible">
      <div>
        <a :href="previewer.img"
        >点击下载文件查看内容</a>
      </div>
      <div v-if="audio">
        <audio controls="controls" :src="previewer.img">
          您的浏览器不支持 audio 标签。
        </audio>
      </div>
      <img v-if="!audio" style="width: 100%" :src="previewer.img">
    </el-dialog>
  </div>
</template>

<script type="text/babel">
  export default {
    name: "zzuUpload",
    props: {
      value: Array, // 图片列表
      url: { // 图片上传地址
        type: String,
        default: 'http://upload-z1.qiniup.com'
      },
      audio: {
        type: Boolean,
        default: false
      },
      maxSize: {
        type: Number,
        default: 5000
      },
      modCode: {
        type: String, // UDC_M00_T01
        default: 'UDC_M00_T01'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      drag: {
        type: Boolean,
        default: false
      },
      listType: { // text/picture/picture-card 具体参考element
        type: String,
        default: 'picture'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      limit: Number,
      onExceed: Function,
      placeholder: String,
      size: Object
    },
    data() {
      return {
        dialogVisible: false,
        dialogImageUrl: '',
        keyname: "",
        uploadData: {
          token: ''
        },
        currentValue: this.value ? this.value : [],
        previewer: {
          visible: false,
          img: ''
        }
      };
    },
    watch: {
      'value'(newValue, oldValue) {
        this.setCurrentValue(newValue);
      },
      'currentValue'(newValue, oldValue) {
        this.$emit('input', newValue);
      }
    },
    mounted() {

    },
    methods: {
      // 上传之前钩子函数
      beforeUploadHandler(file) {
        // console.log(file)
        if ((this.listType == 'picture' || this.listType == 'picture-card') && file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg') {
          this.$message({
            showClose: true,
            message: `只能上传jpg/png文件`,
            type: 'error'
          });
          return false
        }
        if (file.size > this.maxSize * 1024) {
          this.$message({
            showClose: true,
            message: `文件大小不能超过${ this.maxSize | this.kbTrans }`,
            type: 'error'
          });
          return false
        }
        return new Promise((resolve, reject) => {
          this.$http.post('biz/Asset/upToken').then(rs => {
            if (rs.data.code == 0) {
              this.uploadData.token = rs.data.data
              resolve(file)
            } else reject()
          }).catch(e => reject(e))
        })
      },
      handleRemove(file, fileList) {
        // 删除
        this.$emit("xy-remove", file);
        this.setCurrentValue(fileList)
      },
      handlePreview(file) {
        // 点击文件列表中已上传的文件时的钩子
        this.previewer.visible = true;
        this.previewer.img = file.url;
        // 第一次上传时加上attname
        if (!file.beginTime) {
          this.previewer.img = file.url + '?attname=' + this.keyname
        }
      },
      setCurrentValue(value) {
        // 设置当前值
        if (value === this.currentValue) return;
        this.currentValue = value;
      },
      onUpload(file, fileList) {
        // 上传完成后
        this.keyname = file.name
        if (!file.response || !file.response.hash) {
          return;
        }
        let data = {
          fsize: file.size,
          keyName: file.name, // 文件名
          hash: file.response && file.response.hash,
          ext: file.raw.type, // 后缀名
          bucket: '', //
          url: this.$appCfg.fileUrl + '/' + file.response.hash, //
          modCode: this.modCode, // UDC_M00_T01
          assertDesc: '' // 资源描述
        }
        if (this.size) {
          var img = null;
          img = document.createElement("img");
          document.body.insertAdjacentElement("beforeend", img);
          img.style.visibility = "hidden";
          img.src = file.url
          var imgwidth = img.offsetWidth;
          var imgheight = img.offsetHeight;
          if (this.size.height != imgheight && this.size.weight != imgwidth) {
            this.$message({
              message: `请上传的图片尺寸为${this.size.weight}px宽，${this.size.height}px高`,
              type: 'error'
            })
            // fileList.splice(0,1)
            this.$refs.pic.clearFiles()
            return
          }
        }

        this.$http.post('biz/Asset/saveOrUpdate',
          data
        ).then(rs => {
          if (rs.data.code == 0) {
            console.log(file,'file')
            this.currentValue.push(
              {
                id: rs.data.data,
                name: file.name,
                url: this.$appCfg.fileUrl + '/' + file.response.hash
              }
            );
          } else {
            this.$message({
              type: 'error',
              message: '文件上传失败'
            });
          }
        }).catch()
      },
      onSuccess(file, fileList) {
        //上传成功
        // console.log(fileList);
        // this.currentValue.push(file)
        //  this.$emit("xy-add", file);
      },
      handlePictureCardPreview() {

      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    }
  }
</script>

<style scoped lang="scss">

</style>


