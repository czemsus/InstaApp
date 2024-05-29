import { fetchUserData } from "@/api/api";

const files = {
  state() {
    return {
      userToken: null,
      loginStatus: false,
      error: null,
      message: "",
    };
  },

  mutations: {},

  getters: {},

  actions: {
    async FETCH_USER_DATA({ commit }, token) {
      try {
        const data = await fetchUserData(token);
        commit("SET_USER_DATA", data);
      } catch (err) {
        return false;
      }
    },
  },
};

export default files;
