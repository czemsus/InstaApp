import axios from "axios";

const post = async (url, object) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await axios.post(url, object);
        console.log("axios", response.status);
        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
};

const postLoginData = (object) =>
  post("http://localhost:3000/api/user/login", object);

const postRegisterData = (object) =>
  post("http://localhost:3000/api/user/register", object);

export { postLoginData, postRegisterData };
