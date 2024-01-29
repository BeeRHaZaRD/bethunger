import axios from "@/axios";
import {dateTimeToString, dateTimeToIso} from "@/util"
import moment from "moment";

export const game = {
  namespaced: true,
  state: () => ({
    publishRequiredFields: [],
    isEditMode: false,
    id: 0,
    name: null,
    description: null,
    arenaType: null,
    arenaDescription: null,
    dateStart: null,
    duration: null,
    status: null,
    manager: {},
    winner: {},
    eventTypes: [],
    happenedEvents: [],
    plannedEvents: [],
    items: [],
    players: []
  }),
  getters: {
    playersLeft: state => Object.values(state.players).flat()
        .filter(player => player !== null && player.status !== 'DEAD')
        .length
  },
  mutations: {
    setGame(state, game) {
      if (game.status === 'draft') {
        state.publishRequiredFields = ['dateStart', 'arenaType', 'arenaDescription', 'description'];
      }
      state.id = game.id;
      state.name = game.name;
      state.description = game.description;
      state.arenaType = game.arenaType;
      state.arenaDescription = game.arenaDescription;
      state.dateStart = game.dateStart ? new Date(game.dateStart) : null;
      state.duration = game.duration;
      state.status = game.status;
      state.manager = game.manager;
      state.winner = game.winner || null;
      state.eventTypes = game.eventTypes;
      state.happenedEvents = game.happenedEvents;
      state.plannedEvents = game.plannedEvents;
      state.items = game.items;
      state.players = game.players;
    },
    setIsEditMode(state, isEditMode){
      state.isEditMode = isEditMode;
    },
    addHappenedEvent(state, happenedEvent) {
      state.happenedEvents.unshift(happenedEvent);
    },
    addPlannedEvent(state, plannedEvent) {
      state.plannedEvents.push(plannedEvent);
    },
    removePlannedEvent(state, plannedEvent) {
      state.plannedEvents = state.plannedEvents.filter(_plannedEvent => _plannedEvent.id !== plannedEvent.id);
    },
    setPlannedEventStatus(state, {plannedEvent, status}) {
      state.plannedEvents.find(_plannedEvent => _plannedEvent.id === plannedEvent.id).status = status;
    },
    addPlayer(state, player) {
      const sex = player.sex === 'MALE' ? 0 : 1;
      state.players[player.district][sex] = player;
    },
    removePlayer(state, player) {
      const sex = player.sex === 'MALE' ? 0 : 1;
      state.players[player.district][sex] = null;
    },
    setTrainResults(state, {player, trainResults}) {
      const sex = player.sex === 'MALE' ? 0 : 1;
      state.players[player.district][sex].trainResults = trainResults;
    },
    addItem(state, item) {
      state.items.push(item);
    },
    removeItem(state, item) {
      state.items = state.items.filter(_item => _item.id !== item.id);
    },
    setPlayerStatus(state, {player, status}) {
      const sex = player.sex === 'MALE' ? 0 : 1;
      state.players[player.district][sex].status = status;
    }
  },
  actions: {
    fetchGame({commit}, id) {
      return axios({
        method: 'get',
        url: '/games/' + id
      }).then(response => {
        commit('setGame', response.data);
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
        return response.data.map(game => {
          // TODO compute dateStart/duration in the target component
          game.dateStart = dateTimeToString(game.dateStart);
          game.duration = moment.duration(game.duration, 'seconds');
          game.manager.fullName = game.manager ? (game.manager.firstName + ' ' + game.manager.lastName) : null;
          return game;
        });
      }).catch(e => {
        console.log(e);
      });
    },
    createGame(_, game) {
      return axios({
        method: 'post',
        url: '/games',
        data: {
          name: game.name,
          managerId: game.manager.id
        }
      }).then(response => {
        const newGame = response.data;
        newGame.manager.fullName = newGame.manager ? (newGame.manager.firstName + ' ' + newGame.manager.lastName) : null;
        return newGame;
      }).catch(e => {
        console.log(e);
      });
    },
    updateGameInfo({commit}, {gameId, game}) {
      return axios({
        method: 'put',
        url: '/games/' + gameId,
        data: {
          name: game.name,
          description: game.description,
          arenaType: game.arenaType,
          arenaDescription: game.arenaDescription,
          dateStart: dateTimeToIso(game.dateStart)
        }
      }).catch(e => {
        console.log(e);
      });
    },
    publishGame({commit}, gameId) {
      return axios({
        method: 'post',
        url: '/games/' + gameId + '/publish'
      }).then(response => {
        commit('setGame', response.data);
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
      return axios({
        method: 'post',
        url: '/games/' + gameId + '/items/' + item.id,
      }).then((response) => {
        commit('addItem', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    removeItem({commit}, {gameId, item}) {
      return axios({
        method: 'delete',
        url: '/games/' + gameId + '/items/' + item.id
      }).then(() => {
        commit('removeItem', item);
      }).catch(e => {
        console.log(e);
      });
    },
    getAvailablePlayers({}, {district, sex}) {
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
      return axios({
        method: 'post',
        url: '/games/' + gameId + '/players/' + player.id,
      }).then((response) => {
        commit('addPlayer', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    removePlayer({commit}, {gameId, player}) {
      return axios({
        method: 'delete',
        url: '/games/' + gameId + '/players/' + player.id
      }).then(() => {
        commit('removePlayer', player);
      }).catch(e => {
        console.log(e);
      });
    },
    updateTrainResults({commit}, {player, trainResults}) {
      return axios({
        method: 'put',
        url: '/players/' + player.id + '/trainResults',
        data: {...trainResults}
      }).then(() => {
        commit('setTrainResults', {player, trainResults});
      }).catch(e => {
        console.log(e);
      });
    },
    addPlannedEvent({commit}, {gameId, eventTypeId, startAt}) {
      return axios({
        method: 'post',
        url: '/games/' + gameId + '/plannedEvents',
        data: {
          eventTypeId: eventTypeId,
          startAt: dateTimeToIso(startAt)
        }
      }).then((response) => {
        commit('addPlannedEvent', response.data);
      }).catch(e => {
        console.log(e);
      });
    },
    removePlannedEvent({commit}, {gameId, plannedEvent}) {
      return axios({
        method: 'delete',
        url: '/games/' + gameId + '/plannedEvents/' + plannedEvent.id
      }).then(() => {
        commit('removePlannedEvent', plannedEvent);
      }).catch(e => {
        console.log(e);
      });
    },
    fetchHappenedEvents({commit}, {gameId, after}) {
      return axios({
        method: 'get',
        url: '/games/' + gameId + '/happenedEvents',
        params: {
          after: after
        }
      }).then(response => {
        console.log(response.data);
        if (response.data.length === 0) {
          return;
        }
        for (let event of response.data.reverse()) {
          switch (event.type) {
            case 'PLAYER':
              commit('setPlayerStatus', {player: event.player, status: event.player.status});
              break;
            case 'PLANNED_EVENT':
              commit('setPlannedEventStatus', {plannedEvent: event.plannedEvent, status: event.plannedEvent.status});
              // TODO PLANNED_EVENT
              break;
            case 'SUPPLY':
              // TODO: SUPPLY
              break;
          }
          commit('addHappenedEvent', event);
        }
      }).catch(e => {
        console.log(e);
      });
    },
    getHappenedEventsByPlayer({commit}, {gameId, playerId}) {
      return axios({
        method: 'get',
        url: '/games/' + gameId + '/happenedEvents',
        params: {
          playerId: playerId
        }
      }).then(response => {
        return response.data;
      }).catch(e => {
        console.log(e);
      });
    },
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
      }).catch(e => {
        console.log(e);
      });
    }
  }
}