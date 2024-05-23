import { postLoginData, postRegisterData } from "@/api/api";

const login = {
  state() {
    return {
      userToken: null,
      loginStatus: false,
      error: null,
      message: "",
    };
  },

  mutations: {
    SET_USER_TOKEN(state, token) {
      state.userToken = token;
    },
    SET_LOGIN_LOADER(state, status) {
      state.loginStatus = status;
    },
    SET_STATUS(state, err) {
      state.error = err;
    },
    SET_MESSAGE(state, msg) {
      state.message = msg;
    },
  },

  getters: {
    GET_TOKEN(state) {
      return state.userToken;
    },
    GET_LOGIN_LOADER(state) {
      return state.loginStatus;
    },
    GET_STATUS(state) {
      return state.error;
    },
    GET_MESSAGE(state) {
      return state.message;
    },
  },

  actions: {
    async LOGIN({ commit }, user) {
      commit("SET_LOGIN_LOADER", true);
      try {
        const data = await postLoginData(user);
        commit("SET_USER_TOKEN", data.token);
        commit("SET_STATUS", data.status);
        commit("SET_MESSAGE", data.msg);
      } catch (err) {
        commit("SET_STATUS", "error");
        commit("SET_MESSAGE", err.message || "Login failed");
      } finally {
        commit("SET_LOGIN_LOADER", false);
      }
    },
    async REGISTER({ commit }, user) {
      commit("SET_LOGIN_LOADER", true);
      try {
        const data = await postRegisterData(user);
        commit("SET_STATUS", data.status);
        commit("SET_MESSAGE", data.msg);
      } catch (err) {
        commit("SET_STATUS", "error");
        commit("SET_MESSAGE", err.message || "Login failed");
      } finally {
        commit("SET_LOGIN_LOADER", false);
      }
    },
  },
};

export default login;
