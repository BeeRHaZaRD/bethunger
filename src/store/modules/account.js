import axios from "@/axios";

export const account = {
  namespaced: true,
  state: () => ({
    balance: null
  }),
  mutations: {
    setBalance(state, balance) {
      state.balance = balance;
    }
  },
  actions: {
    fetchBalance({commit}) {
      return axios({
        method: 'get',
        url: '/account/balance'
      }).then(response => {
        commit('setBalance', response.data.balance);
      }).catch(e => {
        console.log(e);
      });
    },
    deposit({commit}, amount) {
      return axios({
        method: 'post',
        url: '/account/deposit',
        data: {
          amount: amount
        }
      }).then(response => {
        commit('setBalance', response.data.balance);
      }).catch(e => {
        console.log(e);
      });
    },
    withdraw({commit}, amount) {
      return axios({
        method: 'post',
        url: '/account/withdraw',
        data: {
          amount: amount
        }
      }).then(response => {
        commit('setBalance', response.data.balance);
      }).catch(e => {
        console.log(e);
      });
    }
  }
}
