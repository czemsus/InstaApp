import { fetchUserData, getPhotos, patchUserData } from "@/api/api";
import router from "../router/index";

const profile = {
  state() {
    return {
      userData: null,
      userPhotos: [],
    };
  },

  mutations: {
    SET_USER_DATA(state, user) {
      state.userData = user;
    },
    SET_USER_PHOTOS(state, photos) {
      state.userPhotos = photos;
    },
  },

  getters: {
    GET_USER_DATA(state) {
      return state.userData;
    },
    GET_USER_PHOTOS(state) {
      return state.userPhotos;
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
    async GET_USER_PHOTOS({ commit, rootState }, email) {
      try {
        const data = await getPhotos();
        let photos = data.data.filter(
          (photo) => photo.album == rootState.profile.userData.email
        );

        commit("SET_USER_PHOTOS", photos);
      } catch (err) {
        console.error("Error patching user data:", err);
        return false;
      }
    },
    async RELOAD_USER_DATA({ dispatch, getters }) {
      const token = getters.GET_TOKEN;
      if (token) {
        await dispatch("FETCH_USER_DATA", token);
        const user = getters.GET_USER_DATA;
        await dispatch("GET_USER_PHOTOS", user.email);
      }
    },
  },
};

export default profile;
