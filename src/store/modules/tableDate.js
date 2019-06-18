import * as types from '../mutation-types'

export default {
  state: {
    tableDate:"",
  },
  mutations: {
    updateTableDate (state, payload) {
      state.tableDate = payload.tableDate
//    console.log(state.tableDate)
    },
  }
}
