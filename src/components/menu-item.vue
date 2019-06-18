<!-- 
	菜单块
 -->

<template>
	<div>
		<template v-for="(item, index) in menuData">
			<el-submenu v-if="item.children && item.children.length > 0"  :data-index="menuIndex + index + ''" :index="menuIndex + index + ''">
		    <template slot="title">
		      <i v-if="item.icon" :class="['zzu-menu-icon fa', item.icon]"></i>
		      <span slot="title">{{ item.menuName }}</span>
		    </template>
				
				<zzu-menu-item :menu-data="item.children" :data-index="menuIndex + index + '-'" :menu-index="menuIndex + index + '-'"></zzu-menu-item>
		  </el-submenu>

		  <el-menu-item v-else-if="item.type == 'group'"  :data-index="menuIndex + index + ''" :index="menuIndex + index + ''">
		  	<span class="group-label">{{ item.menuName }}</span>
		  </el-menu-item>

		  <el-menu-item @click.native="goPage({name: item.url})" v-else  :data-index="menuIndex + index + ''" :index="menuIndex + index + ''">
		    <i v-if="item.icon" :class="['zzu-menu-icon fa', item.icon]"></i>
		    <span slot="title" @click="goPage(item.url)">{{ item.menuName }}</span>
		  </el-menu-item>
		</template>
	</div>
</template>

<script type="text/babel">
	import menuItem from '@/components/menu-item'

	export default {
		name: 'zzuMenuItem',
		components: {
			menuItem
		},
		props: {
			menuData: Array,
			menuIndex: {
				type: String,
				default: ''
			},
		},
		data () {
			return {

			}
		}
	}
</script>

<style scoped lang="scss">
	.group-label {
		color: #909399;
	}

	*::-webkit-scrollbar {
    display: none;
	}
</style>