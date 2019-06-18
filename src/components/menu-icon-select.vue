<!-- 
	菜单图标组件
 -->

<template>
	<el-select v-model="currentValue" placeholder="请选择图标">
    <el-option
      v-for="(item, index) in 12"
      :key="index"
      :value="'menu-icon-' + (index+1)">
      <div :class="['menu-icon', 'menu-icon-' + (index + 1)]">{{ 'menu-icon-' + (index+1) }}</div>
    </el-option>
  </el-select>
</template>

<script>
	export default {
		name: "zzuMenuIconSelect",
		props: {
			value: String
		},
		data () {
			return {
				currentValue: "",
				menuData: {
					list: [
						{
							value: "menu-icon-1",
							label: ""
						}
					]
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
    methods: {
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
	
	$menuIconW: 30px;

	.menu-icon {
    position: relative;
    height: $menuIconW;
    padding-left: $menuIconW;
    background: no-repeat;
    background-position: center left;
    background-size: auto 60%;
	}

	@for $i from 1 through 12 {
	  .menu-icon-#{$i} {
      background-image: url("~@/assets/img/menu-icon/menu-icon-#{$i}.png");
	  }
	}
</style>