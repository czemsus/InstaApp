import { createStore } from "vuex";

import login from "./login.js";
import files from "./files.js";
import profile from "./profile.js";
import showImages from "./showImages.js";

const modules = {
  login,
  files,
  profile,
  showImages,
};

export default createStore({
  modules,
});
