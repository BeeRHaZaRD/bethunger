import axios from "@/axios";
import router from "@/router";

export const currentUser = {
  namespaced: true,
  state: () => ({
    role: '',
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    isAuthorized: false
  }),
  getters: {
    fullName: state => state.firstName + ' ' + state.lastName
  },
  mutations: {
    setIsAuthorized(state, isAuthorized) {
      state.isAuthorized = isAuthorized;
    },
    setRole(state, role) {
      state.role = role;
    },
    setLogin(state, login) {
      state.login = login;
    },
    setFirstName(state, firstName) {
      state.firstName = firstName;
    },
    setLastName(state, lastName) {
      state.lastName = lastName;
    },
    setEmail(state, email) {
      state.email = email;
    }
  },
  actions: {
    setUser({commit}, user) {
      commit('setRole', user.role);
      commit('setLogin', user.login);
      commit('setFirstName', user.firstName);
      commit('setLastName', user.lastName);
      commit('setEmail', user.email);
      commit('setIsAuthorized', true);
    },
    login({commit, dispatch}, {login, password}) {
      return axios({
        method: 'post',
        url: '/auth/login',
        data: {
          login: login,
          password: password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        localStorage.setItem('authToken', JSON.stringify(response.data.token));
        dispatch('setAxiosToken', response.data.token);
        dispatch('setUser', response.data.user);
      }).catch(e => {
        console.log(e);
      });
    },
    logout({commit, dispatch}) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      dispatch('clearAxiosToken');
      commit('setIsAuthorized', false);
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