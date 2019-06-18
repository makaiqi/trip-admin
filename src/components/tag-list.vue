<!--
	标签 组件
 -->

<template>
	<div class="tag">
		<el-tag
      :key="index"
      v-for="(tag, index) in currentValue"
      :closable="closable"
      :disable-transitions="false"
      @close="handlerClose(tag)">
      {{ tag[name] }}
    </el-tag>

		<zzu-tag-select :tag-type="tagType" v-show="tagVisible" ref="saveTagInput" @handler-null="handlerNull" @handler-tag-change="handlerTagChange"></zzu-tag-select>

    <el-button  v-show="!tagVisible" class="button-new-tag" size="small" :disabled="disabled" @click="showTagInput">{{ btnName }}</el-button>
	</div>
</template>

<script type="text/babel">
	import zzuTagSelect from '@/components/tag-select'

	export default {
		name: 'zzuTagList',
		components: {
			zzuTagSelect
		},
		props: {
			value: Array,
      disabled: Boolean,
			name: { // 不建议传值
				type: String,
				default: 'tagName'
			},
			btnName: {
				type: String,
				default: '添加标签'
			},
      tagType: {
        type: String,
        default: "no"
      },
      closable: {
        type: Boolean,
        default: true
      },
      max: Number
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
      },
      'closable' (newValue, oldValue) {
        console.log(newValue)
      }
    },
		methods: {
			handlerClose(tag) {
        this.currentValue.splice(this.currentValue.indexOf(tag), 1);
      },
      showTagInput() {
        if(this.max && this.currentValue.length == this.max) {
          this.$message('最大数量为' + this.max);
        } else {
          this.tagVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.focus();
          });
        }
      },
      handlerNull () {
        this.tagVisible = false;
      },
      handlerTagChange(data) {
      	let currentValueId = [];
      	this.currentValue.map(item => {
      		currentValueId.push(item.id)
      	});
      	let ind = currentValueId.indexOf(data.id);
      	if(ind == -1) {
	      	this.currentValue.push(data);
	      	this.tagVisible = false;
      	} else {
      		this.$message({
            type: 'error',
            message: '标签已存在'
          });
      	}
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
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .tag {
    .el-button:first-child {
      margin-left: 0;
    }
  }
</style>
