import { getAllPhotos } from "@/api/api";

const showImages = {
  state() {
    return {
      listOfPictures: [],
    };
  },

  mutations: {
    SET_LIST(state, photos) {
      state.listOfPictures = photos;
    },
  },

  getters: {
    GET_LIST(state) {
      return state.listOfPictures;
    },
  },

  actions: {
    async FETCH_PHOTOS({ commit }) {
      try {
        const data = await getAllPhotos();
        console.log(data.data);
        commit("SET_LIST", data.data);
      } catch (err) {
        return false;
      }
    },
  },
};

export default showImages;
