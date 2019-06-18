<!-- 
	email 标签 组件
 -->

<template>
	<div class="tag">
		<el-tag
      :key="index"
      v-for="(tag, index) in currentValue"
      :closable="!disabled"
      :disable-transitions="false"
      @close="handlerClose(tag)">
      {{ tag }}
    </el-tag>
    
    <template v-if="!disabled">      
  		<el-input
        class="input-new-tag"
        v-if="tagVisible"
        v-model="tagValue"
        ref="showInput"
        size="small"
        @keyup.enter.native="handlerInputConfirm"
        @blur="handlerInputConfirm"
      >
      </el-input>

      <el-button v-else class="button-new-tag" size="small" @click="showInput">{{ btnName }}</el-button>
    </template>
	</div>
</template>

<script type="text/babel">

	export default {
		name: 'zzuEmailTag',
		props: {
			value: Array,
			btnName: {
				type: String,
				default: '添加邮箱'
			},
      disabled: {
        type: Boolean,
        default: false
      }
		},
		data () {
			return {
				tagVisible: false,
        tagValue: '',
        currentValue: this.value ? this.value : []
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
		methods: {
			handlerClose(tag) {
        this.currentValue.splice(this.currentValue.indexOf(tag), 1);
      },
      showInput() {
        this.tagVisible = true;
        this.$nextTick(_ => {
          this.$refs.showInput.focus();
        });
      },
      handlerInputConfirm() {
        let tagValue = this.tagValue;
        if (tagValue) {
          if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(tagValue)) {
            this.currentValue.push(tagValue);
          } else {
            this.$message({
              type: 'error',
              message: '邮箱格式不正确!'
            });
            return false;
          }
        }
        this.tagVisible = false;
        this.tagValue = '';
      },
      setCurrentValue(value) {
        // 设置当前值
        if (value === this.currentValue) return;
        this.currentValue = value;
      }
		}
	}
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/core/index';
  
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .el-tag {
    height: 32px;
    line-height: 30px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 180px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .tag {
    .el-button:first-child {
      margin-left: 0;
    }
  }
</style>