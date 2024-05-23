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
    GET_LOGIN_LOADER(state) {
      return state.loginStatus;
    },
  },

  actions: {
    async LOGIN({ state, commit }, user) {
      commit("SET_LOGIN_LOADER", true);
      try {
        const data = await postLoginData(user);
        commit("SET_USER_TOKEN", state, data.token);
      } catch (err) {
        console.log("err", err);
      } finally {
        commit("SET_LOGIN_LOADER", false);
      }
    },
  },
};

export default login;
