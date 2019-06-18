<!-- 
 页面 
--> 
<template>
 <div class="img-input">
  <el-form-item label="产品图片：" prop="img">
   <input class="upload" @change='add_img'  type="file">  

      <div class="form-img">
          <div class="form-img-block" v-for="(item, index) in form.imgList" :key="index">
            <img :src="item.url">
            <div v-if="index == 0" class="form-img-first">首图</div>

            <div class="form-img-footer">
              <div @click="deleteImg(index)">删除</div>
              <div @click="openImg(item.url,index)">放大</div>
              <div v-if="index != 0" @click="setFirst(index)">设为首图</div>
            </div>

          </div>
        </div>

        <div class="form-img-tips">
          <p>1、图片数量最少5张，最多10张；</p>
          <p>2、可自由设置主图1张；</p>
          <p> 3、为了保证在手机端的呈现效果，图片像素不低于640*360；大小不超过2M；格式为jpg、png、jpeg；</p>
          <p>4、图片不得含有水印、文字或LOGO；</p>
          <p>5、请上传有版权的实景图片，不得存在侵权行为，如有侵权，由上传方承担；</p>
        </div>
      </el-form-item>

      <!-- 图片放大 -->
      <el-dialog :visible.sync="dialogVisible" width="40%" center>
        <div class="img">
          <img :src="dialogImge" alt="图片">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
 </div>
</template>
  
<script type='text/babel'>
export default {
  name: "pushImg",
  props:["idData"],
  data() {
    return {
      imgs: {},
      imgData: {
        accept: "image/gif, image/jpeg, image/png, image/jpg"
      },
      dialogVisible: false,
      dialogImge: "",
      form: {
        imgList: [
          {
            url:
              "http://p1.meituan.net/poi/413cf1e76a794b9582febf01552e02d549152.jpg"
          },
          {
            url: "http://p0.meituan.net/shaitu/__48748880__2963038.jpg"
          },
          {
            url:
              "http://p0.meituan.net/poi/20357aabd93917ebed857b4c1648be7865536.jpg"
          },
          {
            url:
              "http://p1.meituan.net/deal/e76372c3ad780861c80bce43f844b0d229125.jpg"
          }
        ]
      }
    };
  },
  watch: {},
  mounted() {},
  methods: {
    add_img(event) {
      let reader = new FileReader();
      let img1 = event.target.files[0];
      let type = img1.type; //文件的类型，判断是否是图片
      let size = img1.size; //文件的大小，判断图片的大小
      if (this.imgData.accept.indexOf(type) == -1) {
        // alert('请选择我们支持的图片格式！');
        this.$message({
          message: "请选择我们支持的图片格式！",
          center: true
        });
        return false;
      }
      if (size > 2097152) {
        // alert('请选择2M以内的图片！');
        this.$message({
          message: "请选择2M以内的图片！",
          center: true
        });

        return false;
      }

      this.form.imgList.push({
        url:
          "http://p1.meituan.net/poi/413cf1e76a794b9582febf01552e02d549152.jpg"
      });
      // let form = new FormData();
      // form.append('file',img1,img1.name);
      // console.log(form)
      // console.log(img1)
      // this.$http.post('/xxx/xxxxx/xxxxx',form,{
      //     headers:{'Content-Type':'multipart/form-data'}
      // }).then(response => {
      //     console.log(response.data)
      //     uri = response.data.url
      //     reader.readAsDataURL(img1);
      //     var that=this;
      //     reader.onloadend=function(){
      //         // that.imgs.push(uri);
      //       that.$emit('pushImg', uri);
      //     }
      // }).catch(error => {
      //     // alert('上传图片出错！');
      //     this.$message({
      //       message: "上传图片出错！",
      //       center: true
      //     });
      // })
    },
    deleteImg(index) {
      this.form.imgList.splice(index, 1);
      console.log(this.idData)
    },
    //放大
    openImg(url, index) {
      this.dialogImge = url;
      this.dialogVisible = true;
      // this.form
    },
    setFirst(index) {
      let data = this.form.imgList.splice(index, 1);
      this.form.imgList.unshift(data[0]);
      console.log(this.form.imgList);
      this.$emit("pushImg", { tAssetId: index });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~@/assets/css/core/index";

.form-img {
  @extend %clearfix;
}

.form-img-block {
  position: relative;
  width: 200px;
  height: 150px;
  margin: 10px 30px 20px 0;
  border-radius: 4px;
  box-shadow: 2px 2px 5px #aaa;
  display: inline-block;

  &:hover {

    .form-img-footer {
      height: 30px;
    }
  }

  img {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: block;
  }

  .form-img-first {
    position: absolute;
    left: 0;
    top: 8px;
    padding: 2px 5px;
    line-height: 1;
    background-color: #f93;
    color: #fff;
    display: block;
  }

  .form-img-footer {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 0;
    line-height: 30px;
    vertical-align: middle;
    color: #fff;
    overflow: hidden;
    background: #06c1ae;
    opacity: 0.9;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 10;

    & > div {
      float: left;
      width: 33.3%;
      display: inline-block;
      cursor: pointer;
    }
  }
}
.img-input {
  display: inline-block;
  padding: 5px;

  input {
    color: #fff;
    width: 80px;
  }
}

.dialogImg {
  margin: 0 auto;
}

.form-recommended-block {
  margin-bottom: $padding/2;

  & > .el-input {
    width: 90%;
  }
}

.img {
  width: 100%;
  
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
