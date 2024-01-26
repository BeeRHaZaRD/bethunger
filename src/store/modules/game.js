import axios from "@/axios";

export const game = {
  namespaced: true,
  state: () => ({
    publishRequiredFields: [],
    pageMode: "VIEW", // VIEW | EDIT
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
    eventTypes: [],
    happenedEvents: [],
    plannedEvents: [],
    players: [],
    items: []
  }),
  getters: {
    playersLeft: state => Object.values(state.players).flat().filter(player => player?.state !== 'DEAD').length
  },
  mutations: {
    setPublishRequiredFields(state, publishRequiredFields) {
      state.publishRequiredFields = publishRequiredFields;
    },
    setPageMode(state, pageMode) {
      state.pageMode = pageMode;
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
    setEventTypes(state, eventTypes) {
      state.eventTypes = eventTypes;
    },
    setHappenedEvents(state, happenedEvents) {
      state.happenedEvents = happenedEvents;
    },
    addHappenedEvent(state, happenedEvent) {
      state.happenedEvents.unshift(happenedEvent);
    },
    setPlannedEvents(state, plannedEvents) {
      state.plannedEvents = plannedEvents;
    },
    addPlannedEvent(state, plannedEvent) {
      state.plannedEvents.push(plannedEvent);
    },
    removePlannedEvent(state, targetPlannedEvent) {
      state.plannedEvents = state.plannedEvents.filter(plannedEvent => plannedEvent.id !== targetPlannedEvent.id);
    },
    setPlayers(state, players) {
      state.players = players;
    },
    addPlayer(state, player) {
      let sex = player.sex === 'MALE' ? 0 : 1;
      state.players[player.district][sex] = player;
    },
    removePlayer(state, player) {
      let sex = player.sex === 'MALE' ? 0 : 1;
      state.players[player.district][sex] = null;
    },
    setItems(state, items) {
      state.items = items;
    },
    addItem(state, item) {
      state.items.push(item);
    },
    removeItem(state, targetItem) {
      state.items = state.items.filter(item => item.id !== targetItem.id);
    },
    updatePlayerStatus(state, {player, status}) {
      let sex = player.sex === 'MALE' ? 0 : 1;
      state.players[player.district][sex].state = status;
    }
  },
  actions: {
    setGame({commit}, game) {
      if (game.status === 'draft') {
        commit('setPublishRequiredFields', ['dateStart', 'arenaType', 'arenaDescription', 'description']);
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
      commit('setEventTypes', game.eventTypes);
      commit('setHappenedEvents', game.happenedEvents);
      commit('setPlannedEvents', game.plannedEvents);
      commit('setItems', game.items)
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
    updateGameInfo({dispatch}, {gameId, game}) {
      axios({
        method: 'put',
        url: '/games/' + gameId,
        data: {
          name: game.name,
          description: game.description,
          arenaType: game.arenaType,
          arenaDescription: game.arenaDescription,
          dateStart: game.dateStart
        }
      }).then(response => {
        dispatch('setGame', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    publishGame({dispatch}, gameId) {
      axios({
        method: 'post',
        url: '/games/' + gameId + '/publish'
      }).then(response => {
        dispatch('setGame', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    getAllItems() {
      return axios({
        method: 'get',
        url: '/items'
      }).then(response => {
        return response.data;
      }).catch(e => {
        console.log(e);
      });
    },
    addItem({commit}, {gameId, item}) {
      axios({
        method: 'post',
        url: '/games/' + gameId + '/items/' + item.id,
      }).then((response) => {
        commit('addItem', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    removeItem({commit}, {gameId, item}) {
      axios({
        method: 'delete',
        url: '/games/' + gameId + '/items/' + item.id
      }).then(() => {
        commit('removeItem', item);
      }).catch(e => {
        console.log(e);
      });
    },
    getAvailablePlayers({dispatch}, {district, sex}) {
      return axios({
        method: 'get',
        url: '/players/available',
        params: {district, sex}
      }).then(response => {
        return response.data;
      }).catch(e => {
        console.log(e);
      });
    },
    addPlayer({commit}, {gameId, player}) {
      axios({
        method: 'post',
        url: '/games/' + gameId + '/players/' + player.id,
      }).then((response) => {
        commit('addPlayer', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    removePlayer({commit}, {gameId, player}) {
      axios({
        method: 'delete',
        url: '/games/' + gameId + '/players/' + player.id
      }).then(() => {
        commit('removePlayer', player);
      }).catch(e => {
        console.log(e);
      });
    },
    addPlannedEvent({commit}, {gameId, eventTypeId, startAt}) {
      axios({
        method: 'post',
        url: '/games/' + gameId + '/plannedEvents',
        data: {eventTypeId, startAt}
      }).then((response) => {
        commit('addPlannedEvent', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    removePlannedEvent({commit}, {gameId, plannedEvent}) {
      axios({
        method: 'delete',
        url: '/games/' + gameId + '/plannedEvents/' + plannedEvent.id
      }).then(() => {
        commit('removePlannedEvent', plannedEvent);
      }).catch(e => {
        console.log(e);
      });
    },
    fetchHappenedEvents({state, commit}, {gameId, after}) {
      axios({
        method: 'get',
        url: '/games/' + gameId + '/happenedEvents',
        params: {
          after: after
        }
      }).then(response => {
        if (response.data.length === 0) {
          return;
        }
        for (let event of response.data.reverse()) {
          switch (event.type) {
            case 'PLAYER':
              commit('updatePlayerStatus', {player: event.player, status: event.player.status});
              break;
            case 'PLANNED_EVENT':
              // TODO PLANNED_EVENT
              break;
            case 'SUPPLY':
              // TODO: SUPPLY
              break;
          }
          commit('addHappenedEvent', event);
        }
        console.log(response.data);
      }).catch(e => {
        console.log(e);
      });
    }
  }
}