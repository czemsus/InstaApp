import { getTokenValid, postLoginData, postRegisterData } from "@/api/api";
import router from "../router/index";

const login = {
  state() {
    return {
      userToken: null,
      loginStatus: false,
      error: null,
      message: "",
      email: "",
    };
  },

  mutations: {
    SET_USER_TOKEN(state, token) {
      state.userToken = token;
      localStorage.setItem("userToken", token);
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
    SET_EMAIL(state, email) {
      state.email = email;
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
    GET_EMAIL(state) {
      return state.email;
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
        router.push("/");
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
        commit("SET_MESSAGE", err.message || "Register failed");
      } finally {
        commit("SET_LOGIN_LOADER", false);
      }
    },
    async GET_VALID({ commit }, token) {
      try {
        const data = await getTokenValid(token);
        commit("SET_EMAIL", data.email);
        return data.valid;
      } catch (err) {
        return false;
      }
    },
  },
};

export default login;
