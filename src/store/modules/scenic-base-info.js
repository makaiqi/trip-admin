import * as types from '../mutation-types'

export default {
  state: {
    id: 12
  },
  mutations: {
    updateScenicBaseInfoId (state, payload) {
      state.id = payload.id
    },
  }
}
