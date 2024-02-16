import axios from "@/axios";
import router from "@/router";

export const currentUser = {
  namespaced: true,
  state: () => ({
    id: null,
    username: null,
    firstName: null,
    lastName: null,
    role: null,
    isAuthorized: false
  }),
  getters: {
    fullName: state => state.firstName + ' ' + state.lastName,
    isUser: state => state.role === 'USER',
    isManager: state => state.role === 'MANAGER',
    isAdmin: state => state.role === 'ADMIN'
  },
  mutations: {
    setUser(state, user) {
      state.id = user.id;
      state.username = user.username;
      state.firstName = user.firstName
      state.lastName = user.lastName;
      state.role = user.role;
      state.isAuthorized = true;
    },
    resetUser(state) {
      state.id = null;
      state.username = null;
      state.firstName = null
      state.lastName = null;
      state.role = null;
      state.isAuthorized = false;
    }
  },
  actions: {
    register({commit, dispatch}, {username, password, firstName, lastName}) {
      return axios({
        method: 'post',
        url: '/auth/register',
        data: {
          username,
          password,
          firstName,
          lastName
        }
      }).then(response => {
        localStorage.setItem('authToken', JSON.stringify(response.data.token));
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        dispatch('setAxiosToken', response.data.token);
        commit('setUser', response.data.user);
      });
    },
    login({commit, dispatch}, {username, password}) {
      return axios({
        method: 'post',
        url: '/auth/login',
        data: {
          username,
          password
        }
      }).then(response => {
        localStorage.setItem('authToken', JSON.stringify(response.data.token));
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        dispatch('setAxiosToken', response.data.token);
        commit('setUser', response.data.user);
      });
    },
    logout({commit, dispatch}) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      dispatch('clearAxiosToken');
      commit('resetUser');
      router.push('/auth');
    },
    setAxiosToken(_, authToken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    },
    clearAxiosToken() {
      delete axios.defaults.headers.common["Authorization"];
    }
  }
}