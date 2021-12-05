import { createStore } from "vuex";

export default createStore({
  state: {
    cheltuieli: [],
    isLoggedIn: false,
    tipPlati:[]
  },
  getters: {
    cheltuieli: state => {
      return state.cheltuieli
    },
    tipPlati: state =>{
      return state.tipPlati
    }
  },
  mutations: {
    SET_CHELTUIELI: (state, cheltuieli) => {
      state.cheltuieli = cheltuieli;
    },
    SET_LOGG: (state, status) => {
      state.isLoggedIn = status;
    },
    ADD_CHELTUIALA: (state, cheltuiala) => {
      state.cheltuieli.push(cheltuiala);
    },
    DELETE_CHELTUIALA: (state, cheltuiala) => {
      let index = state.cheltuieli.indexOf(cheltuiala);
      state.cheltuieli.splice(index, 1);
    },
    SET_TIPPLATA: (state, tipPlati) => {
      state.tipPlati = tipPlati;
    },
    ADD_TIPPLATA: (state,tipPlata)=>{
      state.tipPlati.push(tipPlata);
    },
    DELETE_TIPPLATA: (state, tipPlata)=>{
      let index = state.tipPlati.indexOf(tipPlata);
      state.tipPlati.splice(index, 1);
    }
  },
  actions: {
    fetchCheltuieli: ({ commit }, payload) => {
      commit('SET_CHELTUIELI', payload)
    },
    fetchTipPlata: ({ commit }, payload) => {
      commit('SET_TIPPLATA', payload)
    },
    login: ({ commit }, payload) => {
      commit('SET_LOGG', payload);
    },
    addCheltuiala: ({ commit }, payload) => {
      commit('ADD_CHELTUIALA', payload);
    },
    deleteCheltuiala: ({ commit }, payload) => {
      commit("DELETE_CHELTUIALA", payload);
    },
    addTipPlata:({commit},payload)=>{
      commit('ADD_TIPPLATA',payload);
    },
    deleteTipPlata:({commit},payload)=>{
      commit('DELETE_TIPPLATA',payload);
    }
  },
  modules: {},
});
