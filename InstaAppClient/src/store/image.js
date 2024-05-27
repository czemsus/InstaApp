import { uploadPhoto } from "@/api/api";
import router from "../router/index";

const image = {
  state() {
    return {

    };
  },

  mutations: {
  },

  getters: {
  },

  actions: {
    async SEND_IMAGE({ commit }, image) {
        try {
            const fd = new FormData()
            fd.append(image)
          const data = await uploadPhoto(image);
        console.log("uploadded");
          router.push("/");
        } catch (err) {

        } finally {
        }
      },
  },
};

export default image;
