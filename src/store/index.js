import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import page from './modules/page'
import ticketProductbaseinfo from './modules/tilcket-product-baseinfo'
import tableProductDate from './modules/tableDate'
import freePackContent from './modules/free-pack-content'
import scenicBaseInfo from './modules/scenic-base-info'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state: {
		last_route_path: null
	},
	mutations: {
    save_last_route(state, route) {
      state.last_route_path = route.fullPath
    },
  },
  modules: {
    user,
    page,
    ticketProductbaseinfo,
    tableProductDate,
    freePackContent,
    scenicBaseInfo
  },
  strict: debug
})

