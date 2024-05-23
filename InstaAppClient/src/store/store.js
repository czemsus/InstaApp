import { createStore } from "vuex";
import axios from "axios";

import login from "./login.js";

const modules = {
  login,
};

export default createStore({
  modules,
});
