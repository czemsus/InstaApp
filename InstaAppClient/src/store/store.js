import { createStore } from "vuex";
import axios from "axios";

import login from "./login.js";
import files from "./files.js";
import profile from "./profile.js";

const modules = {
  login,
  files,
  profile
};

export default createStore({
  modules,
});
