import { sendImage, editPhoto, getMeta } from "@/api/api";
import router from "../router/index";

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
    async SEND_IMAGE({ commit }, { formdata, token }) {
      try {
        const data = await sendImage(formdata, token);
        router.push("/profile");
      } catch (err) {
        return false;
      }
    },
    async GET_META({ commit }, id) {
      try {
        const data = await getMeta(id);
        return data;
      } catch (err) {
        return false;
      }
    },
    async MODIFY_IMAGE_DATA({ commit, dispatch }, { tags, desc, id }) {
      try {
        let object = {
          tags: tags,
          desc: desc,
          description: desc,
          id: id,
        };
        const data = await editPhoto(object);
        if (!data?.photo || (data.photo.desc ?? "") !== desc) {
          throw new Error("The server did not save the updated photo description");
        }
        commit("UPDATE_PHOTO", data.photo);
        await dispatch("PHOTO_CHANGED");
        return data;
      } catch (err) {
        console.error("Error updating photo data:", err);
        return false;
      }
    },
  },
};

export default files;
