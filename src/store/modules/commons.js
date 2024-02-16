import axios from "@/axios";
import {makeFullName} from "@/utils/util";
import store from "@/store";

export const commons = {
  namespaced: true,
  actions: {
    getAllManagers() {
      return axios({
        method: 'get',
        url: '/users',
        params: {
          role: 'MANAGER'
        }
      }).then(response => {
        return response.data.map(manager => {
          manager.fullName = manager.firstName + ' ' + manager.lastName;
          return manager;
        });
      });
    },
    getAllItems() {
      return axios({
        method: 'get',
        url: '/items'
      }).then(response => {
        return response.data;
      });
    },
    getAvailablePlayers({}, {district, sex}) {
      return axios({
        method: 'get',
        url: '/players/available',
        params: {district, sex}
      }).then(response => {
        return response.data.map(player => {
          player.fullName = makeFullName(player);
          return player;
        });
      });
    },
    updateTrainResults({commit}, {player, trainResults}) {
      return axios({
        method: 'put',
        url: '/players/' + player.id + '/trainings',
        data: {...trainResults}
      }).then(response => {
        store.commit('game/setTrainResults', {player, trainResults: response.data});
      });
    }
  }
}