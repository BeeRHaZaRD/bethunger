import axios from "@/axios";

export const game = {
  namespaced: true,
  state: () => ({
    requiredFields: [],
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
    playersLeft: state => Object.values(state.players).flat().filter(player => player && player.state !== 'dead').length
  },
  mutations: {
    setRequiredFields(state, requiredFields) {
      state.requiredFields = requiredFields;
    },
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
      state.happenedEvents.unshift(...happenedEvents);
    },
    setPlayers(state, players) {
      state.players = players;
    }
  },
  actions: {
    setGame({commit}, game) {
      if (game.status === 'draft') {
        commit('setRequiredFields', ['dateStart', 'arenaType', 'arenaDescription', 'description', 'manager']);
      }
      commit('setId', game.id || null);
      commit('setName', game.name || null);
      commit('setArenaType', game.arenaType || null);
      commit('setArenaDescription', game.arenaDescription || null);
      commit('setDateStart', game.dateStart || null);
      commit('setDateEnd', game.dateEnd || null);
      commit('setStatus', game.status || null);
      commit('setDescription', game.description || null);
      commit('setManager', game.manager || null);
      commit('setWinner', game.winner || null);
      commit('setHappenedEvents', game.happenedEvents.reverse());

      for (let i = 1; i < 13; i++) {
        if (game.players[i]) {
          game.players[i][0] ??= null
          game.players[i][1] ??= null
        } else {
          game.players[i] = [null, null]
        }
      }
      // console.log(game.players)
      commit('setPlayers', game.players);
    },
    async fetchGame({dispatch}, id) {
      await axios({
        method: 'get',
        url: '/games/' + id
      }).then(response => {
        dispatch('setGame', response.data);
        console.log(response.data);
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
          after: after
        }
      }).then(response => {
        if (response.data.length > 0) {
          commit('addHappenedEvents', response.data);
        }
        console.log(response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    publishGame({dispatch}, id) {
      axios({
        method: 'post',
        url: '/games/' + id + '/publish'
      }).then(response => {
        dispatch('setGame', response.data);
      }).catch(e => {
        console.log(e);
      });
    }
  }
}