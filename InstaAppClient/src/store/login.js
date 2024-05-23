import { postLoginData } from "@/api/api";
import axios from "axios";

const login = {
  state() {
    return {
      userToken: null,
      loginStatus: false,
    };
  },

  mutations: {
    SET_USER_TOKEN(state, token) {
      state.userToken = token;
    },
    SET_LOGIN_LOADER(state, status) {
      state.loginStatus = status;
    },
  },

  getters: {
    GET_TOKEN(state) {
      return state.userToken;
    },
  },

  actions: {
    async LOGIN({ state, commit }, user) {
      commit("SET_LOGIN_LOADING", true);
      try {
        const data = await postLoginData(user);
        commit("SET_USER_TOKEN", state, data.token);
      } catch (err) {
        console.log("err", err);
      } finally {
        commit("SET_LOGIN_LOADING", false);
      }
    },
  },
};

export default login;
