import { getAllPhotos, setPhotoLike } from "@/api/api";

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
    UPDATE_PHOTO_LIKE(state, { id, liked, likesCount }) {
      const photo = state.listOfPictures.find((item) => item.id === id);
      if (photo) {
        photo.likedByUser = liked;
        photo.likesCount = likesCount;
      }
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
        commit("SET_LIST", data.data);
      } catch (error) {
        console.error("Error fetching photos:", error);
        throw error;
      }
    },
    async TOGGLE_PHOTO_LIKE({ commit }, { id, liked }) {
      try {
        const data = await setPhotoLike(id, liked);
        commit("UPDATE_PHOTO_LIKE", {
          id,
          liked: data.liked,
          likesCount: data.likesCount,
        });
        return true;
      } catch (error) {
        console.error("Error updating photo like:", error);
        return false;
      }
    },
  },
};

export default showImages;
