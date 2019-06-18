// 用户
import * as types from '../mutation-types'

export default {
  state: {
    userId: '', // 用户id
    roleId: '', // 用户角色Id
    roleName: '' ,// 用户角色名称
    mobile:'' ,   //用户手机号
  },
  mutations: {
    updateUserId (state, payload) {
      state.userId = payload.userId
    },
    updateRoleId (state, payload) {
      state.roleId = payload.roleId
    },
    updateRoleName (state, payload) {
      state.roleName = payload.roleName
    },
    updateMobile (state, payload) {
      state.mobile = payload.mobile
    }
  }
}
