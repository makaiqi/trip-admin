<!--
  tag 查询和新增方式
  单选
  可模糊查询
 -->

<template>
  <el-autocomplete
    ref="input"
    v-model="currentValue"
    value-key="tagName"
    :disabled="disabled"
    :fetch-suggestions="loadData"
    :placeholder="placeholder"
    @select="handlerSelect"
    @keyup.enter.native="handlerInputConfirm"
    @blur="handlerBlur"
  ></el-autocomplete>
</template>

<script type="text/babel">
  const tagTypeArr = {
    'no': "V001", // 未分类
    'travel': "V002", // 旅游频道
    'store': "V003", // 电商频道
    'discover': "V004" //发现内容
  }
  export default {
    name: 'tagInput',
    props: {
      value: [String, Number],
      placeholder: {
        type: String,
        default: '请输入标签名'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      tagType: {
        type: String,
        default: "no"
      },
      id: String // 父区域id
    },
    data () {
      return {
        currentValue: this.value === undefined ? '' : this.value,
        options: [],
        citySelect: {
          value: "",
          list: [],
          timeout: null
        }
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
    mounted () {
      console.log(this.$elKit)
    },
    methods: {
      loadData(queryString, cb) {
        // 获取信息
        this.$http.get(`biz/Tag/list`,
          {
            params: {
              tagTypeCode: tagTypeArr[this.tagType],
              search: this.currentValue,
              paging: false
            }
          }
        ).then(rs => {
          if(rs.data.code == 0) {
            this.options = rs.data.data
            cb(rs.data.data)
          } else {
            cb([]);
          }
        }).catch(cb([]));
      },
      handlerSelect(item) {
        // 选中后的操作
        this.currentValue = '';
        this.$emit('handler-tag-change', item);
      },
      handlerInputConfirm() {
        if(this.currentValue) {
          if(!this.$elKit.isChinese.test(this.currentValue)){
            this.$message({
              type: 'error',
              message: "标签名只能是中文"
            })
            return;
          }
          let isPost = true
          this.options.forEach(item => {
            if (this.currentValue == item.tagName) {
              isPost = false
              this.$emit('handler-tag-change', item)
            }
          })
          if (!isPost) return
          this.$http.post(`biz/Tag/saveOrUpdate`,
            {
              id: '',
              tagName: this.currentValue,
              tagTypeCode: tagTypeArr[this.tagType]
            }
          ).then(rs => {
            if(this.currentValue=='') return;
            if(rs.data.code == 0) {
              this.$emit('handler-tag-change', {
                id: rs.data.data,
                tagName: this.currentValue
              });
              this.currentValue = '';
            } else {
              this.$message({
                type: 'error',
                message: '标签已存在'
              });
            }
          });
        } else {
          this.currentValue = '';
          this.$emit('handler-null')
        }
      },
      handlerBlur () {
        console.log(1)
      },
      focus () {
        this.$refs.input.focus();
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


</style>
