import { getCurrentUser, getUserRole } from '@/_helpers/auth';
import { createStore } from 'vuex';

const store = createStore({
  state: {
    userRoles: {
      isAdmin: false,
      isChief: false,
    },
    isLoggedIn: false,
    loading: true,
    currentUser: null,
  },
  mutations: {
    setUserRoles(state, roles) {
      state.userRoles = roles;
    },
    setLoggedIn(state, value) {
      state.isLoggedIn = value;
    },
    setLoading(state, value) {
      state.loading = value;
    },
    setCurrentUser(state, value) {
      state.currentUser = value;
    },
  },
  actions: {
    async setUserRolesFromAuth({ commit }, userId) {
      const role = await getUserRole(userId);
      const roles = { isAdmin: role === 'admin', isChief: role === 'chief' };
      commit('setUserRoles', roles);
    },
    async cacheCurrentUser({ commit }) {
      try {
        const user = await getCurrentUser();
        commit('setCurrentUser', user);
      } catch (error) {
        commit('setCurrentUser', null);
      }
    },

  },
  
});

export default store;
