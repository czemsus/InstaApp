import { fetchUserData, patchUserData } from "@/api/api";
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
        commit("SET_USER_DATA", data);
      } catch (err) {
        return false;
      }
    },
    async PATCH_USER_DATA({ commit }, { obj, token }) {
      try {
        const data = await patchUserData(obj, token);
        router.push("/profile");
      } catch (err) {
        console.error("Error patching user data:", err);
        return false;
      }
    },
  },
};

export default profile;
