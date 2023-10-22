import {GAME_STATUS, GAME_STATUS_SEVERITY} from "@/enums/enums";
import {axiosInstance as axios} from "@/axios";
import * as util from "@/util";

export const game = {
  namespaced: true,
  state: () => ({
    id: 0,
    name: "",
    arenaType: "",
    arenaDescription: "",
    dateStart: "",
    dateEnd: "",
    status: "",
    description: "",
    manager: {},
    winner: {},
    happenedEvents: [],
    players: []
  }),
  getters: {
    statusSeverity: state => GAME_STATUS_SEVERITY[state.status],
    statusText: state => GAME_STATUS[state.status],
    playersByDistrict: state => Object.assign({}, [...Array(12).keys()].map(i => [state.players[i], state.players[i+12]])),
    playersLeft: state => state.players.filter(player => player.state !== 'dead').length
  },
  mutations: {
    setId(state, id) {
      state.id = id;
    },
    setName(state, name) {
      state.name = name;
    },
    setArenaType(state, arenaType) {
      state.arenaType = arenaType;
    },
    setArenaDescription(state, arenaDescription) {
      state.arenaDescription = arenaDescription;
    },
    setDateStart(state, dateStart) {
      state.dateStart = dateStart;
    },
    setDateEnd(state, dateEnd) {
      state.dateEnd = dateEnd;
    },
    setStatus(state, status) {
      state.status = status;
    },
    setDescription(state, description) {
      state.description = description;
    },
    setManager(state, manager) {
      state.manager = manager;
    },
    setWinner(state, winner) {
      state.winner = winner;
    },
    setHappenedEvents(state, happenedEvents) {
      state.happenedEvents = happenedEvents;
    },
    addHappenedEvents(state, happenedEvents) {
      state.happenedEvents.unshift(happenedEvents);
    },
    setPlayers(state, players) {
      state.players = players;
    }
  },
  actions: {
    async fetchGame({commit}, id) {
      await axios({
        method: 'get',
        url: '/games/' + id
      }).then(response => {
        let game = response.data;

        commit('setId', game.id);
        commit('setName', game.name);
        commit('setArenaType', game.arenaType);
        commit('setArenaDescription', game.arenaDescription);
        commit('setDateStart', util.timestampToDateTime(game.dateStart));
        commit('setDateEnd', util.timestampToDateTime(game.dateEnd));
        commit('setStatus', game.status);
        commit('setDescription', game.description);
        commit('setManager', game.manager);
        commit('setWinner', game.winner);

        commit('setHappenedEvents', game.happenedEvents.reverse());
        commit('setPlayers', game.players);

        console.log(game);
      }).catch(e => {
        console.log(e);
      });
    },
    getAllGames() {
      return axios({
        method: 'get',
        url: '/games'
      }).then(response => {
        return response.data;
      }).catch(e => {
        console.log(e);
      });
    },
    fetchHappenedEvents({commit}, {gameId, after}) {
      axios({
        method: 'get',
        url: '/games/' + gameId + '/events',
        params: {
          after: '4040-07-22T21:00:00.000+00:00'
        }
      }).then(response => {
        commit('addHappenedEvents', response.data);
        console.log(response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    publishGame({commit}, id) {
      axios({
        method: 'post',
        url: '/games/' + id + '/publish'
      }).then(response => {
        console.log("publishGame", response);
      }).catch(e => {
        console.log(e);
      });
    }
  }
}