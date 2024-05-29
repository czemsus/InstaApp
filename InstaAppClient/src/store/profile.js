import { fetchUserData } from "@/api/api";
import router from "../router/index";

const profile = {
  state() {
    return {
      userData: null,
    };
  },

  mutations: {
    SET_USER_DATA(state, user) {
      state.userData = user;
    },
  },

  getters: {
    GET_USER_DATA(state) {
      return state.userData;
    },
  },

  actions: {
    async FETCH_USER_DATA({ commit }, token) {
      try {
        const data = await fetchUserData(token);
        console.log(data);
        commit("SET_USER_DATA", data);
      } catch (err) {
        return false;
      }
    },
  },
};

export default profile;
