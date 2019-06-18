import * as types from '../mutation-types'

export default {
  state: {
    baseInfoId:"",
  },
  mutations: {
    updateBaseInfoId (state, payload) {
      state.baseInfoId = payload.baseInfoId
//    console.log(state.baseInfoID)
    },
  }
}
