  import { fetchUserData } from "@/api/api";
import router from "../router/index";
  
  const profile = {
    state() {
      return {
        userData : null
      };
    },
  
    mutations: {
        SET_USER_DATA(state, user){
            console.log(state.userData);
            state.userData = user
            console.log("set");
            console.log(state.userData);
        }
    },
  
    getters: {},
  
    actions: {
      async FETCH_USER_DATA({ commit }, token) {
        try {
            const data = await fetchUserData(token)
            commit("SET_USER_DATA", data);

        } catch (err) {
          return false;
        }
      },
    },
  };
  
  export default profile;
  