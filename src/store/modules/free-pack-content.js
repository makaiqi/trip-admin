import * as types from '../mutation-types'

export default {
  state: {
   list:"",
  },
  mutations: {
    updateFreeAdd (state, payload) {
      state.list = payload.list
      console.log(typeof state.list,'state.list')
    },
  }
}
