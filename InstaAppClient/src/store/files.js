import {
  getTokenValid,
  postLoginData,
  postRegisterData,
  sendImage,
} from "@/api/api";
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
  },
};

export default files;
