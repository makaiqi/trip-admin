import * as types from '../mutation-types'

export default {
  state: {
    pageSize: 10, // 分页条数
    pageSizes: [10, 20, 30, 50] // 分页选项
  },
  mutations: {
    updatePageSize (state, payload) {
      state.pageSize = payload.pageSize
    },
    updatepageSizes (state, payload) {
    	state.pageSizes = payload.pageSizes
    }
  }
}
