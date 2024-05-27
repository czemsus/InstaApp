import { createStore } from "vuex";
import axios from "axios";

import login from "./login.js";
import image from "./image.js";

const modules = {
  login,image
};

export default createStore({
  modules,
});
