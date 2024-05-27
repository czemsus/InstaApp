import { createStore } from "vuex";
import axios from "axios";

import login from "./login.js";
import files from "./files.js";

const modules = {
  login,
  files,
};

export default createStore({
  modules,
});
